// P-H Analyzer Calculation Functions
// Uses CoolProp WASM for real thermodynamic properties

import { 
  PHAnalyzerInputs, 
  CycleResults, 
  CyclePoint,
  RefrigerationCycle,
  PlotData,
  ValidationError 
} from './types';

declare global {
  interface Window {
    Module: any;
  }
}

// CoolProp property calculation wrapper
export function props(property: string, fluid: string, state1: string, value1: number, state2: string, value2: number): number {
  try {
    if (!window.Module || typeof window.Module.PropsSI !== 'function') {
      throw new Error('CoolProp not loaded');
    }
    return window.Module.PropsSI(property, state1, value1, state2, value2, fluid);
  } catch (error) {
    console.error('CoolProp calculation error:', error);
    throw new Error(`Failed to calculate ${property} for ${fluid}`);
  }
}

// Saturation properties
export function saturationPressure(temperature: number, fluid: string): number {
  return props('P', fluid, 'T', temperature + 273.15, 'Q', 0) / 1e5; // Convert Pa to bar
}

export function saturationTemperature(pressure: number, fluid: string): number {
  return props('T', fluid, 'P', pressure * 1e5, 'Q', 0) - 273.15; // Convert K to °C
}

// Validate inputs
export function validateInputs(inputs: PHAnalyzerInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  if (inputs.evaporatorTemp >= inputs.condenserTemp) {
    errors.push({
      field: 'evaporatorTemp',
      message: 'Evaporator temperature must be lower than condenser temperature'
    });
  }

  if (inputs.coolingCapacity <= 0) {
    errors.push({
      field: 'coolingCapacity',
      message: 'Cooling capacity must be positive'
    });
  }

  if (inputs.compressorEfficiency <= 0 || inputs.compressorEfficiency > 1) {
    errors.push({
      field: 'compressorEfficiency',
      message: 'Compressor efficiency must be between 0 and 1'
    });
  }

  if (inputs.volumetricEfficiency && (inputs.volumetricEfficiency <= 0 || inputs.volumetricEfficiency > 1)) {
    errors.push({
      field: 'volumetricEfficiency',
      message: 'Volumetric efficiency must be between 0 and 1'
    });
  }

  if (inputs.subcooling < 0 || inputs.subcooling > 20) {
    errors.push({
      field: 'subcooling',
      message: 'Subcooling should be between 0 and 20 K'
    });
  }

  if (inputs.superheating < 0 || inputs.superheating > 30) {
    errors.push({
      field: 'superheating',
      message: 'Superheating should be between 0 and 30 K'
    });
  }

  if (inputs.ambientTemp && (inputs.ambientTemp < -20 || inputs.ambientTemp > 60)) {
    errors.push({
      field: 'ambientTemp',
      message: 'Ambient temperature should be between -20 and 60°C'
    });
  }

  if (inputs.indoorTemp && (inputs.indoorTemp < 10 || inputs.indoorTemp > 35)) {
    errors.push({
      field: 'indoorTemp',
      message: 'Indoor temperature should be between 10 and 35°C'
    });
  }

  return errors;
}

// Calculate 4-point vapor compression cycle with enhanced analysis
export function calculateBasicCycle(inputs: PHAnalyzerInputs): CycleResults {
  const { 
    refrigerant, 
    evaporatorTemp, 
    condenserTemp, 
    subcooling, 
    superheating, 
    compressorEfficiency, 
    volumetricEfficiency = 0.85,
    coolingCapacity,
    ambientTemp = 35,
    indoorTemp = 20
  } = inputs;
  
  try {
    // Calculate saturation pressures
    const pEvap = saturationPressure(evaporatorTemp, refrigerant); // bar
    const pCond = saturationPressure(condenserTemp, refrigerant); // bar
    const pressureRatio = pCond / pEvap;

    // Point 1: Compressor inlet (superheated vapor)
    const T1 = evaporatorTemp + superheating; // °C
    const P1 = pEvap; // bar
    const h1 = props('H', refrigerant, 'T', T1 + 273.15, 'P', P1 * 1e5) / 1000; // kJ/kg
    const s1 = props('S', refrigerant, 'T', T1 + 273.15, 'P', P1 * 1e5) / 1000; // kJ/kg·K
    const rho1 = props('D', refrigerant, 'T', T1 + 273.15, 'P', P1 * 1e5); // kg/m³
    const v1 = 1 / rho1; // m³/kg

    // Point 2s: Isentropic compression (ideal)
    const h2s = props('H', refrigerant, 'S', s1 * 1000, 'P', pCond * 1e5) / 1000; // kJ/kg
    
    // Point 2: Actual compression (with efficiency)
    const h2 = h1 + (h2s - h1) / compressorEfficiency; // kJ/kg
    const T2 = props('T', refrigerant, 'H', h2 * 1000, 'P', pCond * 1e5) - 273.15; // °C
    const s2 = props('S', refrigerant, 'H', h2 * 1000, 'P', pCond * 1e5) / 1000; // kJ/kg·K
    const rho2 = props('D', refrigerant, 'H', h2 * 1000, 'P', pCond * 1e5); // kg/m³

    // Point 3: Condenser outlet (subcooled liquid)
    const T3 = condenserTemp - subcooling; // °C
    const P3 = pCond; // bar
    const h3 = props('H', refrigerant, 'T', T3 + 273.15, 'P', P3 * 1e5) / 1000; // kJ/kg
    const s3 = props('S', refrigerant, 'T', T3 + 273.15, 'P', P3 * 1e5) / 1000; // kJ/kg·K
    const rho3 = props('D', refrigerant, 'T', T3 + 273.15, 'P', P3 * 1e5); // kg/m³

    // Point 4: Throttling (isenthalpic expansion)
    const h4 = h3; // kJ/kg (isenthalpic)
    const P4 = pEvap; // bar
    const T4 = props('T', refrigerant, 'H', h4 * 1000, 'P', P4 * 1e5) - 273.15; // °C
    const s4 = props('S', refrigerant, 'H', h4 * 1000, 'P', P4 * 1e5) / 1000; // kJ/kg·K
    const x4 = props('Q', refrigerant, 'H', h4 * 1000, 'P', P4 * 1e5); // quality
    const rho4 = props('D', refrigerant, 'H', h4 * 1000, 'P', P4 * 1e5); // kg/m³

    // Calculate mass flow rate from cooling capacity
    const qEvap = h1 - h4; // kJ/kg (specific cooling effect)
    const massFlowRate = coolingCapacity / qEvap; // kg/s

    // Calculate volumetric flow rate and displacement
    const volumetricFlowRate = massFlowRate * v1; // m³/s at compressor inlet
    const compressorDisplacement = volumetricFlowRate / volumetricEfficiency; // m³/s

    // Calculate performance parameters
    const compressorPower = massFlowRate * (h2 - h1); // kW
    const heatingCapacity = massFlowRate * (h2 - h3); // kW (condenser heat rejection)
    const cop_cooling = coolingCapacity / compressorPower; // COP for cooling
    const cop_heating = heatingCapacity / compressorPower; // COP for heating
    const eer = cop_cooling * 3.412; // EER (BTU/Wh)
    const seer = eer * 0.9; // Approximate SEER (accounting for part-load)

    // Estimate refrigerant charge (simplified)
    const evaporatorVolume = 0.05; // m³ (typical)
    const condenserVolume = 0.03; // m³ (typical)
    const pipingVolume = 0.02; // m³ (typical)
    const refrigerantCharge = (evaporatorVolume * rho4 + condenserVolume * rho3 + pipingVolume * rho1) / 1000; // kg

    // Create cycle points with enhanced data
    const points: CyclePoint[] = [
      {
        id: 1,
        name: 'Compressor Inlet',
        temperature: T1,
        pressure: P1,
        enthalpy: h1,
        entropy: s1,
        density: rho1,
        phase: 'vapor'
      },
      {
        id: 2,
        name: 'Compressor Outlet',
        temperature: T2,
        pressure: pCond,
        enthalpy: h2,
        entropy: s2,
        density: rho2,
        phase: 'vapor'
      },
      {
        id: 3,
        name: 'Condenser Outlet',
        temperature: T3,
        pressure: P3,
        enthalpy: h3,
        entropy: s3,
        density: rho3,
        phase: 'liquid'
      },
      {
        id: 4,
        name: 'Evaporator Inlet',
        temperature: T4,
        pressure: P4,
        enthalpy: h4,
        entropy: s4,
        density: rho4,
        quality: x4,
        phase: 'two-phase'
      }
    ];

    // Generate enhanced P-H diagram data
    const phDiagramData = generateEnhancedPHDiagramData(refrigerant, points, inputs);

    // Process analysis
    const processAnalysis = {
      compression: {
        workInput: h2 - h1,
        temperatureRise: T2 - T1,
        pressureRatio: pressureRatio,
        process: compressorEfficiency < 1 ? "Polytropic" : "Isentropic"
      },
      condensation: {
        heatRejected: h2 - h3,
        subcooling: subcooling,
        approach: condenserTemp - ambientTemp,
        process: "Constant pressure"
      },
      expansion: {
        pressureDrop: pCond - pEvap,
        throttlingLoss: h3 - h4, // Should be 0 for isenthalpic, but included for completeness
        qualityAfter: x4,
        process: "Isenthalpic"
      },
      evaporation: {
        coolingEffect: qEvap,
        superheating: superheating,
        approach: indoorTemp - evaporatorTemp,
        process: "Constant pressure"
      }
    };

    return {
      points,
      performance: {
        coolingCapacity,
        heatingCapacity,
        compressorPower,
        cop_cooling,
        cop_heating,
        eer,
        seer,
        massFlowRate,
        volumetricFlowRate,
        compressorDisplacement,
        refrigerantCharge,
        pressureRatio,
        isentropicEfficiency: compressorEfficiency,
        volumetricEfficiency
      },
      phDiagramData,
      processAnalysis
    };

  } catch (error) {
    console.error('Calculation error:', error);
    throw new Error(`Failed to calculate cycle: ${error}`);
  }
}

// Generate enhanced P-H diagram data with isotherms, isobars, and quality lines
export function generateEnhancedPHDiagramData(refrigerant: string, cyclePoints: CyclePoint[], inputs: PHAnalyzerInputs) {
  try {
    // Generate basic saturation curve data
    const tempRange = Array.from({ length: 50 }, (_, i) => -40 + i * 2); // -40°C to 60°C
    const saturatedLiquidEnthalpy: number[] = [];
    const saturatedVaporEnthalpy: number[] = [];
    const saturationPressure: number[] = [];

    tempRange.forEach(temp => {
      try {
        const pSat = props('P', refrigerant, 'T', temp + 273.15, 'Q', 0) / 1e5; // bar
        const hLiq = props('H', refrigerant, 'T', temp + 273.15, 'Q', 0) / 1000; // kJ/kg
        const hVap = props('H', refrigerant, 'T', temp + 273.15, 'Q', 1) / 1000; // kJ/kg
        
        saturatedLiquidEnthalpy.push(hLiq);
        saturatedVaporEnthalpy.push(hVap);
        saturationPressure.push(pSat);
      } catch (e) {
        // Skip points that cause calculation errors
      }
    });

    // Generate isotherms (constant temperature lines)
    const isotherms = { enthalpy: [] as number[][], pressure: [] as number[][], temperatures: [] as number[] };
    if (inputs.showIsotherms) {
      const tempLines = [-20, 0, 20, 40, 60, 80]; // °C
      tempLines.forEach(temp => {
        const enthalpyLine: number[] = [];
        const pressureLine: number[] = [];
        
        // Generate points across pressure range
        const pressureRange = Array.from({ length: 30 }, (_, i) => 0.5 + i * 0.5); // 0.5 to 15 bar
        pressureRange.forEach(pressure => {
          try {
            // Check if this state is possible
            const tSat = saturationTemperature(pressure, refrigerant);
            if (temp > tSat) {
              // Superheated region
              const h = props('H', refrigerant, 'T', temp + 273.15, 'P', pressure * 1e5) / 1000;
              enthalpyLine.push(h);
              pressureLine.push(pressure);
            }
          } catch (e) {
            // Skip invalid states
          }
        });
        
        if (enthalpyLine.length > 0) {
          isotherms.enthalpy.push(enthalpyLine);
          isotherms.pressure.push(pressureLine);
          isotherms.temperatures.push(temp);
        }
      });
    }

    // Generate isobars (constant pressure lines)
    const isobars = { enthalpy: [] as number[][], pressure: [] as number[][], pressures: [] as number[] };
    if (inputs.showIsobars) {
      const pressureLines = [1, 2, 5, 10, 15, 20]; // bar
      pressureLines.forEach(pressure => {
        const enthalpyLine: number[] = [];
        const pressureLine: number[] = [];
        
        // Generate points across enthalpy range
        const tSat = saturationTemperature(pressure, refrigerant);
        const hSatLiq = props('H', refrigerant, 'P', pressure * 1e5, 'Q', 0) / 1000;
        const hSatVap = props('H', refrigerant, 'P', pressure * 1e5, 'Q', 1) / 1000;
        
        // Liquid region (subcooled)
        for (let temp = tSat - 20; temp <= tSat; temp += 2) {
          try {
            const h = props('H', refrigerant, 'T', temp + 273.15, 'P', pressure * 1e5) / 1000;
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          } catch (e) {
            // Skip invalid states
          }
        }
        
        // Two-phase region
        for (let q = 0; q <= 1; q += 0.1) {
          try {
            const h = props('H', refrigerant, 'P', pressure * 1e5, 'Q', q) / 1000;
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          } catch (e) {
            // Skip invalid states
          }
        }
        
        // Vapor region (superheated)
        for (let temp = tSat; temp <= tSat + 50; temp += 5) {
          try {
            const h = props('H', refrigerant, 'T', temp + 273.15, 'P', pressure * 1e5) / 1000;
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          } catch (e) {
            // Skip invalid states
          }
        }
        
        if (enthalpyLine.length > 0) {
          isobars.enthalpy.push(enthalpyLine);
          isobars.pressure.push(pressureLine);
          isobars.pressures.push(pressure);
        }
      });
    }

    // Generate quality lines (constant dryness fraction)
    const qualityLines = { enthalpy: [] as number[][], pressure: [] as number[][], qualities: [] as number[] };
    if (inputs.showQualityLines) {
      const qualities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
      qualities.forEach(quality => {
        const enthalpyLine: number[] = [];
        const pressureLine: number[] = [];
        
        // Generate points across pressure range in two-phase region
        saturationPressure.forEach((pressure, index) => {
          try {
            const h = props('H', refrigerant, 'P', pressure * 1e5, 'Q', quality) / 1000;
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          } catch (e) {
            // Skip invalid states
          }
        });
        
        if (enthalpyLine.length > 0) {
          qualityLines.enthalpy.push(enthalpyLine);
          qualityLines.pressure.push(pressureLine);
          qualityLines.qualities.push(quality);
        }
      });
    }

    // Extract cycle data
    const cycleEnthalpy = cyclePoints.map(point => point.enthalpy || 0);
    const cyclePressure = cyclePoints.map(point => point.pressure);

    // Close the cycle (return to point 1)
    cycleEnthalpy.push(cyclePoints[0].enthalpy || 0);
    cyclePressure.push(cyclePoints[0].pressure);

    return {
      enthalpy: tempRange,
      pressure: saturationPressure,
      cycleEnthalpy,
      cyclePressure,
      saturatedLiquidEnthalpy,
      saturatedVaporEnthalpy,
      saturationPressure,
      isotherms,
      isobars,
      qualityLines
    };

  } catch (error) {
    console.error('Enhanced P-H diagram generation error:', error);
    // Fallback to basic diagram
    return generatePHDiagramData(refrigerant, cyclePoints);
  }
}

// Generate basic P-H diagram data (fallback)
export function generatePHDiagramData(refrigerant: string, cyclePoints: CyclePoint[]) {
  try {
    // Generate saturation curve data
    const tempRange = Array.from({ length: 50 }, (_, i) => -40 + i * 2); // -40°C to 60°C
    const saturatedLiquidEnthalpy: number[] = [];
    const saturatedVaporEnthalpy: number[] = [];
    const saturationPressure: number[] = [];

    tempRange.forEach(temp => {
      try {
        const pSat = props('P', refrigerant, 'T', temp + 273.15, 'Q', 0) / 1e5; // bar
        const hLiq = props('H', refrigerant, 'T', temp + 273.15, 'Q', 0) / 1000; // kJ/kg
        const hVap = props('H', refrigerant, 'T', temp + 273.15, 'Q', 1) / 1000; // kJ/kg
        
        saturatedLiquidEnthalpy.push(hLiq);
        saturatedVaporEnthalpy.push(hVap);
        saturationPressure.push(pSat);
      } catch (e) {
        // Skip points that cause calculation errors
      }
    });

    // Extract cycle data
    const cycleEnthalpy = cyclePoints.map(point => point.enthalpy || 0);
    const cyclePressure = cyclePoints.map(point => point.pressure);

    // Close the cycle (return to point 1)
    cycleEnthalpy.push(cyclePoints[0].enthalpy || 0);
    cyclePressure.push(cyclePoints[0].pressure);

    return {
      enthalpy: tempRange,
      pressure: saturationPressure,
      cycleEnthalpy,
      cyclePressure,
      saturatedLiquidEnthalpy,
      saturatedVaporEnthalpy,
      saturationPressure,
      isotherms: { enthalpy: [], pressure: [], temperatures: [] },
      isobars: { enthalpy: [], pressure: [], pressures: [] },
      qualityLines: { enthalpy: [], pressure: [], qualities: [] }
    };

  } catch (error) {
    console.error('P-H diagram generation error:', error);
    throw new Error('Failed to generate P-H diagram data');
  }
}

// Create enhanced Plotly data for P-H diagram
export function createEnhancedPHPlotData(phData: any, refrigerant: string): PlotData[] {
  const plotData: PlotData[] = [];

  // Saturation dome (liquid line)
  plotData.push({
    x: phData.saturatedLiquidEnthalpy,
    y: phData.saturationPressure,
    mode: 'lines',
    type: 'scatter',
    name: 'Saturated Liquid',
    line: { color: 'blue', width: 2 },
    showlegend: true,
    hovertemplate: 'Saturated Liquid<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>'
  });

  // Saturation dome (vapor line)
  plotData.push({
    x: phData.saturatedVaporEnthalpy,
    y: phData.saturationPressure,
    mode: 'lines',
    type: 'scatter',
    name: 'Saturated Vapor',
    line: { color: 'red', width: 2 },
    showlegend: true,
    hovertemplate: 'Saturated Vapor<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>'
  });

  // Isotherms (constant temperature lines)
  if (phData.isotherms && phData.isotherms.enthalpy.length > 0) {
    phData.isotherms.enthalpy.forEach((enthalpyLine: number[], index: number) => {
      if (enthalpyLine.length > 0) {
        plotData.push({
          x: enthalpyLine,
          y: phData.isotherms.pressure[index],
          mode: 'lines',
          type: 'scatter',
          name: `${phData.isotherms.temperatures[index]}°C`,
          line: { color: 'gray', width: 1, dash: 'dot' },
          showlegend: false,
          hovertemplate: `Isotherm ${phData.isotherms.temperatures[index]}°C<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>`
        });
      }
    });
  }

  // Isobars (constant pressure lines)
  if (phData.isobars && phData.isobars.enthalpy.length > 0) {
    phData.isobars.enthalpy.forEach((enthalpyLine: number[], index: number) => {
      if (enthalpyLine.length > 0) {
        plotData.push({
          x: enthalpyLine,
          y: phData.isobars.pressure[index],
          mode: 'lines',
          type: 'scatter',
          name: `${phData.isobars.pressures[index]} bar`,
          line: { color: 'orange', width: 1, dash: 'dash' },
          showlegend: false,
          hovertemplate: `Isobar ${phData.isobars.pressures[index]} bar<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>`
        });
      }
    });
  }

  // Quality lines (constant dryness fraction)
  if (phData.qualityLines && phData.qualityLines.enthalpy.length > 0) {
    phData.qualityLines.enthalpy.forEach((enthalpyLine: number[], index: number) => {
      if (enthalpyLine.length > 0) {
        plotData.push({
          x: enthalpyLine,
          y: phData.qualityLines.pressure[index],
          mode: 'lines',
          type: 'scatter',
          name: `x=${phData.qualityLines.qualities[index]}`,
          line: { color: 'purple', width: 1, dash: 'dashdot' },
          showlegend: false,
          hovertemplate: `Quality x=${phData.qualityLines.qualities[index]}<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>`
        });
      }
    });
  }

  // Refrigeration cycle
  plotData.push({
    x: phData.cycleEnthalpy,
    y: phData.cyclePressure,
    mode: 'lines+markers',
    type: 'scatter',
    name: `${refrigerant} Cycle`,
    line: { color: 'green', width: 4 },
    marker: { 
      color: 'green', 
      size: 10, 
      symbol: 'circle'
    },
    showlegend: true,
    hovertemplate: 'Cycle Point<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>'
  });

  return plotData;
}

// Create Plotly data for P-H diagram
export function createPHPlotData(phData: any, refrigerant: string): PlotData[] {
  const plotData: PlotData[] = [];

  // Saturation dome (liquid line)
  plotData.push({
    x: phData.saturatedLiquidEnthalpy,
    y: phData.saturationPressure,
    mode: 'lines',
    type: 'scatter',
    name: 'Saturated Liquid',
    line: { color: 'blue', width: 2 },
    showlegend: true,
    hovertemplate: 'Saturated Liquid<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>'
  });

  // Saturation dome (vapor line)
  plotData.push({
    x: phData.saturatedVaporEnthalpy,
    y: phData.saturationPressure,
    mode: 'lines',
    type: 'scatter',
    name: 'Saturated Vapor',
    line: { color: 'red', width: 2 },
    showlegend: true,
    hovertemplate: 'Saturated Vapor<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>'
  });

  // Refrigeration cycle
  plotData.push({
    x: phData.cycleEnthalpy,
    y: phData.cyclePressure,
    mode: 'lines+markers',
    type: 'scatter',
    name: `${refrigerant} Cycle`,
    line: { color: 'green', width: 3 },
    marker: { 
      color: 'green', 
      size: 8, 
      symbol: 'circle'
    },
    showlegend: true,
    hovertemplate: 'Cycle Point<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>'
  });

  return plotData;
}

// Format numbers for display
export const formatters = {
  decimal: (value: number, digits = 2) => value.toFixed(digits),
  temperature: (value: number) => `${value.toFixed(1)}°C`,
  pressure: (value: number) => `${value.toFixed(2)} bar`,
  enthalpy: (value: number) => `${value.toFixed(1)} kJ/kg`,
  power: (value: number) => `${value.toFixed(2)} kW`,
  flowRate: (value: number) => `${value.toFixed(3)} kg/s`,
  efficiency: (value: number) => `${value.toFixed(2)}`,
  percentage: (value: number) => `${(value * 100).toFixed(1)}%`
};
