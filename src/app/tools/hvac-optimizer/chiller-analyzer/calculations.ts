// Chiller Performance Analyzer Calculations
// Uses CoolProp WASM for real thermodynamic properties

import {
  ChillerInputs,
  ChillerResults,
  CycleResults,
  CyclePoint,
  ValidationError,
  PlotData
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
  // Input pressure is in kPa, convert to Pa for CoolProp, then K to °C
  const pressurePa = pressure * 1000; // kPa to Pa
  const tempK = props('T', fluid, 'P', pressurePa, 'Q', 0); // K
  const tempC = tempK - 273.15; // K to °C

  console.log(`Saturation temp for ${pressure} kPa ${fluid}:`, {
    pressurePa,
    tempK: tempK.toFixed(2),
    tempC: tempC.toFixed(2)
  });

  return tempC;
}

// Validate chiller inputs
export function validateChillerInputs(inputs: ChillerInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  if (inputs.oemCOP <= 0 || inputs.oemCOP > 10) {
    errors.push({
      field: 'oemCOP',
      message: 'OEM COP must be between 0 and 10'
    });
  }

  if (inputs.oemCapacity <= 0) {
    errors.push({
      field: 'oemCapacity',
      message: 'OEM capacity must be positive'
    });
  }

  if (inputs.evapPressure <= 0 || inputs.evapPressure >= inputs.condPressure) {
    errors.push({
      field: 'evapPressure',
      message: 'Evaporator pressure must be positive and less than condenser pressure'
    });
  }

  if (inputs.condPressure <= inputs.evapPressure) {
    errors.push({
      field: 'condPressure',
      message: 'Condenser pressure must be greater than evaporator pressure'
    });
  }

  if (inputs.superheat < 0 || inputs.superheat > 30) {
    errors.push({
      field: 'superheat',
      message: 'Superheat should be between 0 and 30 K'
    });
  }

  if (inputs.subcooling < 0 || inputs.subcooling > 20) {
    errors.push({
      field: 'subcooling',
      message: 'Subcooling should be between 0 and 20 K'
    });
  }

  if (inputs.compressorEfficiency <= 0 || inputs.compressorEfficiency > 1) {
    errors.push({
      field: 'compressorEfficiency',
      message: 'Compressor efficiency must be between 0 and 1'
    });
  }

  if (inputs.systemEfficiencyFactor <= 0 || inputs.systemEfficiencyFactor > 1) {
    errors.push({
      field: 'systemEfficiencyFactor',
      message: 'System efficiency factor must be between 0 and 1'
    });
  }

  if (inputs.ambientDBT < -20 || inputs.ambientDBT > 60) {
    errors.push({
      field: 'ambientDBT',
      message: 'Ambient dry bulb temperature should be between -20 and 60°C'
    });
  }

  if (inputs.relativeHumidity < 0 || inputs.relativeHumidity > 100) {
    errors.push({
      field: 'relativeHumidity',
      message: 'Relative humidity must be between 0 and 100%'
    });
  }

  if (inputs.relativeHumidity < 5 || inputs.relativeHumidity > 99) {
    errors.push({
      field: 'relativeHumidity',
      message: 'Warning: Relative humidity outside optimal range (5-99%) for wet bulb calculation accuracy'
    });
  }

  return errors;
}

// Professional compressor model based on Ouadha et al., 2008 and real-world calibration
function calculateCompressorEfficiency(pressureRatio: number, includeSystemLosses: boolean = true): { volumetricEff: number, isentropicEff: number } {
  // Input validation - compressor model valid range
  if (pressureRatio < 1.5) {
    console.warn(`Pressure ratio ${pressureRatio.toFixed(2)} below valid range for compressor model`);
    return { volumetricEff: 0.85, isentropicEff: 0.75 };
  }

  // Volumetric efficiency correlation from Ouadha et al., 2008
  const volumetricEff = 1.95125 - 0.80946 * pressureRatio + 0.17054 * Math.pow(pressureRatio, 2) - 0.01221 * Math.pow(pressureRatio, 3);

  // Isentropic efficiency correlation (ideal thermodynamic efficiency)
  let isentropicEff = 0.66768 + 0.0025 * pressureRatio - 0.00303 * Math.pow(pressureRatio, 2);

  if (includeSystemLosses) {
    // Real-world system efficiency factors based on field data
    const motorEfficiency = 0.90;        // Motor efficiency (85-95% typical)
    const mechanicalEfficiency = 0.95;   // Mechanical transmission losses (92-98% typical)
    const systemFactor = 0.58;           // System losses factor (calibrated to match observed COP values)

    // Apply combined efficiency factors to convert ideal to realistic performance
    isentropicEff = isentropicEff * motorEfficiency * mechanicalEfficiency * systemFactor;

    console.log(`Compressor efficiency analysis (PR=${pressureRatio.toFixed(2)}):`, {
      idealIsentropicEff: (0.66768 + 0.0025 * pressureRatio - 0.00303 * Math.pow(pressureRatio, 2)).toFixed(3),
      motorEff: motorEfficiency,
      mechanicalEff: mechanicalEfficiency,
      systemFactor: systemFactor,
      realIsentropicEff: isentropicEff.toFixed(3)
    });
  }

  return {
    volumetricEff: Math.max(0.5, Math.min(1.0, volumetricEff)),
    isentropicEff: Math.max(0.3, Math.min(0.95, isentropicEff))
  };
}

// Get system efficiency factors for transparency
export function getCompressorEfficiencyFactors(): { motorEfficiency: number, mechanicalEfficiency: number, systemFactor: number, combinedFactor: number } {
  const motorEfficiency = 0.90;
  const mechanicalEfficiency = 0.95;
  const systemFactor = 0.58;

  return {
    motorEfficiency,
    mechanicalEfficiency,
    systemFactor,
    combinedFactor: motorEfficiency * mechanicalEfficiency * systemFactor
  };
}

// Professional heat exchanger analysis - Log Mean Temperature Difference calculation
export function calculateLMTD(
  direction: 'counter' | 'parallel',
  hotInletTemp: number,
  hotOutletTemp: number,
  coldInletTemp: number,
  coldOutletTemp: number
): number {
  let deltaT1: number, deltaT2: number;

  if (direction === 'counter') {
    // Counter-flow configuration (most efficient)
    deltaT1 = hotInletTemp - coldOutletTemp;
    deltaT2 = hotOutletTemp - coldInletTemp;
  } else {
    // Parallel-flow configuration
    deltaT1 = hotInletTemp - coldInletTemp;
    deltaT2 = hotOutletTemp - coldOutletTemp;
  }

  // Avoid division by zero and logarithm of zero/negative numbers
  if (deltaT1 <= 0 || deltaT2 <= 0) {
    console.warn('Invalid temperature differences for LMTD calculation:', { deltaT1, deltaT2 });
    return 0;
  }

  if (Math.abs(deltaT1 - deltaT2) < 0.1) {
    // When temperature differences are nearly equal, LMTD approaches arithmetic mean
    return (deltaT1 + deltaT2) / 2;
  }

  const lmtd = (deltaT1 - deltaT2) / Math.log(deltaT1 / deltaT2);

  console.log('LMTD calculation:', {
    direction,
    deltaT1: deltaT1.toFixed(2) + '°C',
    deltaT2: deltaT2.toFixed(2) + '°C',
    lmtd: lmtd.toFixed(2) + '°C'
  });

  return lmtd;
}

// Calculate pressure ratio from temperatures (professional utility function)
export function calculatePressureRatio(evapTemp: number, condTemp: number, refrigerant: string): number {
  try {
    const evapPressure = props('P', refrigerant, 'T', evapTemp + 273.15, 'Q', 1); // Pa
    const condPressure = props('P', refrigerant, 'T', condTemp + 273.15, 'Q', 0); // Pa
    const pressureRatio = condPressure / evapPressure;

    console.log('Pressure ratio calculation:', {
      evapTemp: evapTemp.toFixed(1) + '°C',
      condTemp: condTemp.toFixed(1) + '°C',
      evapPressure: (evapPressure / 1000).toFixed(1) + ' kPa',
      condPressure: (condPressure / 1000).toFixed(1) + ' kPa',
      pressureRatio: pressureRatio.toFixed(2)
    });

    return pressureRatio;
  } catch (error) {
    console.error('Error calculating pressure ratio:', error);
    return 3.0; // Default reasonable value
  }
}

// Professional wet bulb temperature calculation using Stull formula
// Accurate for RH 5-99% and temperatures -20°C to 50°C
export function calculateWetBulbTemperature(dryBulbTemp: number, relativeHumidity: number): number {
  // Input validation
  if (relativeHumidity < 5 || relativeHumidity > 99) {
    console.warn(`Relative humidity ${relativeHumidity}% outside optimal range (5-99%). Results may be less accurate.`);
  }

  if (dryBulbTemp < -20 || dryBulbTemp > 50) {
    console.warn(`Temperature ${dryBulbTemp}°C outside optimal range (-20°C to 50°C). Results may be less accurate.`);
  }

  const T = dryBulbTemp; // °C
  const RH = relativeHumidity; // %

  // Stull formula for wet bulb temperature
  // Tw = T * arctan(0.151977 * sqrt(RH + 8.313659)) + 0.00391838 * RH^1.5 * arctan(0.023101 * RH) 
  //      - arctan(RH - 1.676331) + arctan(T + RH) - 4.686035

  const term1 = T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659));
  const term2 = 0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH);
  const term3 = -Math.atan(RH - 1.676331);
  const term4 = Math.atan(T + RH);
  const term5 = -4.686035;

  const wetBulbTemp = term1 + term2 + term3 + term4 + term5;

  console.log('Wet bulb temperature calculation:', {
    dryBulbTemp: T.toFixed(1) + '°C',
    relativeHumidity: RH.toFixed(1) + '%',
    wetBulbTemp: wetBulbTemp.toFixed(1) + '°C',
    formula: 'Stull (accurate for RH 5-99%, T -20°C to 50°C)'
  });

  // Validation: WBT should never exceed DBT
  if (wetBulbTemp > dryBulbTemp) {
    console.warn(`Calculated WBT (${wetBulbTemp.toFixed(1)}°C) exceeds DBT (${dryBulbTemp.toFixed(1)}°C). Using DBT as WBT.`);
    return dryBulbTemp;
  }

  return wetBulbTemp;
}

// Calculate dew point temperature for additional psychrometric analysis
export function calculateDewPointTemperature(dryBulbTemp: number, relativeHumidity: number): number {
  const T = dryBulbTemp; // °C
  const RH = relativeHumidity / 100; // Convert % to decimal

  // Magnus formula for dew point (accurate for normal atmospheric conditions)
  const a = 17.27;
  const b = 237.7;

  const alpha = ((a * T) / (b + T)) + Math.log(RH);
  const dewPoint = (b * alpha) / (a - alpha);

  console.log('Dew point calculation:', {
    dryBulbTemp: T.toFixed(1) + '°C',
    relativeHumidity: (RH * 100).toFixed(1) + '%',
    dewPoint: dewPoint.toFixed(1) + '°C'
  });

  return dewPoint;
}

// Professional psychrometric analysis
export function analyzePsychrometrics(dryBulbTemp: number, relativeHumidity: number): {
  wetBulbTemp: number;
  dewPointTemp: number;
  analysis: string[];
} {
  const wetBulbTemp = calculateWetBulbTemperature(dryBulbTemp, relativeHumidity);
  const dewPointTemp = calculateDewPointTemperature(dryBulbTemp, relativeHumidity);

  const analysis: string[] = [];

  // Psychrometric analysis
  const wetBulbDepression = dryBulbTemp - wetBulbTemp;
  const dewPointDepression = dryBulbTemp - dewPointTemp;

  analysis.push(`Wet bulb depression: ${wetBulbDepression.toFixed(1)}°C`);
  analysis.push(`Dew point depression: ${dewPointDepression.toFixed(1)}°C`);

  // Cooling potential analysis
  if (wetBulbDepression > 15) {
    analysis.push('Excellent evaporative cooling potential');
  } else if (wetBulbDepression > 10) {
    analysis.push('Good evaporative cooling potential');
  } else if (wetBulbDepression > 5) {
    analysis.push('Moderate evaporative cooling potential');
  } else {
    analysis.push('Limited evaporative cooling potential');
  }

  // Humidity comfort analysis
  if (relativeHumidity > 70) {
    analysis.push('High humidity - may affect condenser performance');
  } else if (relativeHumidity < 30) {
    analysis.push('Low humidity - excellent for air-cooled condensers');
  } else {
    analysis.push('Moderate humidity - good for condenser operation');
  }

  return {
    wetBulbTemp,
    dewPointTemp,
    analysis
  };
}

// Calculate refrigerant density at suction conditions (for volumetric flow analysis)
export function calculateSuctionDensity(evapTemp: number, superheat: number, refrigerant: string): number {
  try {
    const suctionTemp = evapTemp + superheat; // °C
    const suctionPressure = props('P', refrigerant, 'T', evapTemp + 273.15, 'Q', 1); // Pa
    const density = props('D', refrigerant, 'T', suctionTemp + 273.15, 'P', suctionPressure); // kg/m³

    console.log('Suction density calculation:', {
      evapTemp: evapTemp.toFixed(1) + '°C',
      superheat: superheat.toFixed(1) + 'K',
      suctionTemp: suctionTemp.toFixed(1) + '°C',
      suctionPressure: (suctionPressure / 1000).toFixed(1) + ' kPa',
      density: density.toFixed(2) + ' kg/m³'
    });

    return density;
  } catch (error) {
    console.error('Error calculating suction density:', error);
    return 5.0; // Default reasonable value for R134a
  }
}

// Professional COP calculation from enthalpy array (matching Python getMyCOP function)
export function calculateCOPFromEnthalpies(enthalpies: number[]): number {
  // COP = (h1 - h4) / (h2 - h1) where:
  // h1 = compressor inlet enthalpy (J/kg)
  // h2 = compressor outlet enthalpy (J/kg) 
  // h4 = evaporator inlet enthalpy (J/kg)

  if (enthalpies.length < 5) {
    console.error('Insufficient enthalpy data for COP calculation');
    return 0;
  }

  const h1 = enthalpies[0]; // Compressor inlet
  const h2 = enthalpies[1]; // Compressor outlet
  const h4 = enthalpies[4]; // Evaporator inlet (after expansion)

  const coolingEffect = h1 - h4; // Specific cooling effect (J/kg)
  const compressorWork = h2 - h1; // Specific compressor work (J/kg)

  if (compressorWork <= 0) {
    console.error('Invalid compressor work for COP calculation');
    return 0;
  }

  const cop = coolingEffect / compressorWork;

  console.log('COP calculation from enthalpies:', {
    h1: (h1 / 1000).toFixed(1) + ' kJ/kg',
    h2: (h2 / 1000).toFixed(1) + ' kJ/kg',
    h4: (h4 / 1000).toFixed(1) + ' kJ/kg',
    coolingEffect: (coolingEffect / 1000).toFixed(1) + ' kJ/kg',
    compressorWork: (compressorWork / 1000).toFixed(1) + ' kJ/kg',
    cop: cop.toFixed(2)
  });

  return cop;
}

// Validate VCC cycle sequence for correct thermodynamic connections
export function validateVCCSequence(enthalpy: number[], pressure: number[], cycleName: string): boolean {
  if (enthalpy.length < 8 || pressure.length < 8) {
    console.error(`${cycleName}: Insufficient points for VCC validation`);
    return false;
  }

  const validations = {
    // State 1 → State 2: Compression (pressure increases, enthalpy increases)
    compression: pressure[1] > pressure[0] && enthalpy[1] > enthalpy[0],

    // State 2 → State 2-3v: Desuperheating (pressure constant, enthalpy decreases)
    desuperheating: Math.abs(pressure[1] - pressure[2]) < 0.1 && enthalpy[2] < enthalpy[1],

    // State 2-3v → State 2-3l: Condensation (pressure constant, enthalpy decreases)
    condensation: Math.abs(pressure[2] - pressure[3]) < 0.1 && enthalpy[3] < enthalpy[2],

    // State 2-3l → State 3: Subcooling (pressure constant, enthalpy decreases) OR no subcooling (same point)
    subcooling: Math.abs(pressure[3] - pressure[4]) < 0.1 && (enthalpy[4] <= enthalpy[3] + 0.1),

    // State 3 → State 4: Expansion (pressure decreases, enthalpy constant)
    expansion: pressure[4] > pressure[5] && Math.abs(enthalpy[4] - enthalpy[5]) < 1.0,

    // State 4 → State 4-1v: Evaporation (pressure constant, enthalpy increases)
    evaporation: Math.abs(pressure[5] - pressure[6]) < 0.1 && enthalpy[6] > enthalpy[5],

    // State 4-1v → State 1: Superheating (pressure constant, enthalpy increases)
    superheating: Math.abs(pressure[6] - pressure[7]) < 0.1 && enthalpy[7] > enthalpy[6],

    // Cycle closure: State 1 matches
    closure: Math.abs(enthalpy[0] - enthalpy[7]) < 0.1 && Math.abs(pressure[0] - pressure[7]) < 0.01
  };

  const isValid = Object.values(validations).every(v => v);

  console.log(`${cycleName} VCC Sequence Validation:`, {
    ...validations,
    overallValid: isValid,
    pressureRatio: (pressure[1] / pressure[0]).toFixed(2),
    coolingEffect: (enthalpy[0] - enthalpy[5]).toFixed(1) + ' kJ/kg',
    compressorWork: (enthalpy[1] - enthalpy[0]).toFixed(1) + ' kJ/kg'
  });

  return isValid;
}

// Test function to verify P-H diagram data generation - call this to debug
export function testPHDiagramData(refrigerant: string = 'R134a'): void {
  console.log('=== P-H DIAGRAM TEST ===');

  try {
    // Test basic cycle calculation
    const testCycle = calculateVCCCycle(
      7.0,    // evapTemp
      45.0,   // condTemp  
      5.0,    // superheat
      5.0,    // subcooling
      0.85,   // compressorEff
      100,    // capacity (kW)
      refrigerant,
      'Test Cycle'
    );

    console.log('Test cycle results:', {
      name: testCycle.name,
      cop: testCycle.cop.toFixed(2),
      points: testCycle.points.length,
      evapTemp: testCycle.evapTemp,
      condTemp: testCycle.condTemp,
      pressureRatio: testCycle.pressureRatio.toFixed(2)
    });

    // Test cycle data extraction
    if (testCycle.points.length >= 4) {
      const point1 = testCycle.points[0];
      const point2 = testCycle.points[1];
      const point3 = testCycle.points[2];
      const point4 = testCycle.points[3];

      console.log('Test cycle P-H data:', {
        point1: `h=${point1.enthalpy?.toFixed(1)} kJ/kg, P=${point1.pressure.toFixed(2)} bar`,
        point2: `h=${point2.enthalpy?.toFixed(1)} kJ/kg, P=${point2.pressure.toFixed(2)} bar`,
        point3: `h=${point3.enthalpy?.toFixed(1)} kJ/kg, P=${point3.pressure.toFixed(2)} bar`,
        point4: `h=${point4.enthalpy?.toFixed(1)} kJ/kg, P=${point4.pressure.toFixed(2)} bar`
      });

      // Verify cycle makes thermodynamic sense
      const isValidCycle = (
        point1.pressure < point2.pressure &&  // Compression increases pressure
        point2.pressure === point3.pressure && // Constant pressure condensation
        point3.pressure > point4.pressure &&  // Expansion decreases pressure
        point4.pressure === point1.pressure && // Constant pressure evaporation
        (point1.enthalpy || 0) > (point4.enthalpy || 0) && // Evaporation adds enthalpy
        (point2.enthalpy || 0) > (point1.enthalpy || 0)    // Compression adds enthalpy
      );

      console.log('Cycle validation:', {
        isValid: isValidCycle,
        compressionRatio: (point2.pressure / point1.pressure).toFixed(2),
        coolingEffect: ((point1.enthalpy || 0) - (point4.enthalpy || 0)).toFixed(1) + ' kJ/kg',
        compressorWork: ((point2.enthalpy || 0) - (point1.enthalpy || 0)).toFixed(1) + ' kJ/kg'
      });
    }

  } catch (error) {
    console.error('P-H diagram test failed:', error);
  }
}

// Enhanced cycle state analysis for professional reporting
export function analyzeCycleStates(results: CycleResults): {
  stateAnalysis: string[];
  performanceMetrics: { [key: string]: number };
  recommendations: string[];
} {
  const analysis: string[] = [];
  const metrics: { [key: string]: number } = {};
  const recommendations: string[] = [];

  if (results.points.length >= 4) {
    const point1 = results.points[0]; // Compressor inlet
    const point2 = results.points[1]; // Compressor outlet
    const point3 = results.points[2]; // Condenser outlet
    const point4 = results.points[3]; // Evaporator inlet

    // Temperature analysis
    const compressorTempRise = point2.temperature - point1.temperature;
    const subcooling = results.condTemp - point3.temperature;
    const superheat = point1.temperature - results.evapTemp;

    analysis.push(`Compressor temperature rise: ${compressorTempRise.toFixed(1)}°C`);
    analysis.push(`Actual superheat: ${superheat.toFixed(1)}K`);
    analysis.push(`Actual subcooling: ${subcooling.toFixed(1)}K`);

    // Performance metrics
    metrics.compressorTempRise = compressorTempRise;
    metrics.actualSuperheat = superheat;
    metrics.actualSubcooling = subcooling;
    metrics.pressureRatio = results.pressureRatio;
    metrics.isentropicEfficiency = results.performance.isentropicEfficiency;

    // Professional recommendations based on state analysis
    if (compressorTempRise > 60) {
      recommendations.push(`High compressor temperature rise (${compressorTempRise.toFixed(1)}°C) - consider reducing pressure ratio`);
    }

    if (superheat > 15) {
      recommendations.push(`Excessive superheat (${superheat.toFixed(1)}K) - optimize expansion valve control`);
    }

    if (subcooling < 2) {
      recommendations.push(`Low subcooling (${subcooling.toFixed(1)}K) - risk of flash gas formation`);
    }
  }

  return {
    stateAnalysis: analysis,
    performanceMetrics: metrics,
    recommendations: recommendations
  };
}

// Professional VCC Model - Enhanced thermodynamic cycle analysis
// Based on professional mechanical engineering principles and your Python prototype
function calculateVCCCycle(
  evapTemp: number,
  condTemp: number,
  superheat: number,
  subcooling: number,
  compressorEff: number,
  capacity: number,
  refrigerant: string,
  cycleName: string
): CycleResults {
  try {
    // Following Python myVCCmodel function exactly
    console.log(`${cycleName} VCC Model - Input:`, {
      evapTemp: evapTemp.toFixed(1) + '°C',
      condTemp: condTemp.toFixed(1) + '°C',
      superheat: superheat.toFixed(1) + 'K',
      subcooling: subcooling.toFixed(1) + 'K',
      compressorEff: compressorEff.toFixed(2)
    });

    // Calculate saturation pressures (convert to Pa for CoolProp)
    const P1 = props('P', refrigerant, 'T', evapTemp + 273.15, 'Q', 1); // Pa
    const P3 = props('P', refrigerant, 'T', condTemp + 273.15, 'Q', 0); // Pa
    const pressureRatio = P3 / P1;

    // Point 1: inlet to compressor (like Python)
    const T1 = evapTemp + superheat; // °C
    const H1 = props('H', refrigerant, 'T', T1 + 273.15, 'P', P1); // J/kg
    const S1 = props('S', refrigerant, 'H', H1, 'P', P1); // J/kg·K
    const rho1 = props('D', refrigerant, 'T', T1 + 273.15, 'P', P1); // kg/m³

    // Point 3: inlet to expansion valve (like Python)
    const T3 = condTemp - subcooling; // °C

    // CRITICAL FIX: If subcooling = 0, use saturated liquid properties
    let H3, S3, rho3;
    if (Math.abs(subcooling) < 0.1) {
      // No subcooling - State 3 is at saturated liquid line
      H3 = props('H', refrigerant, 'P', P3, 'Q', 0); // J/kg (saturated liquid)
      S3 = props('S', refrigerant, 'P', P3, 'Q', 0); // J/kg·K (saturated liquid)
      rho3 = props('D', refrigerant, 'P', P3, 'Q', 0); // kg/m³ (saturated liquid)
      console.log(`${cycleName} - State 3: Using saturated liquid properties (no subcooling)`);
    } else {
      // With subcooling - State 3 is subcooled liquid
      H3 = props('H', refrigerant, 'T', T3 + 273.15, 'P', P3); // J/kg
      S3 = props('S', refrigerant, 'H', H3, 'P', P3); // J/kg·K
      rho3 = props('D', refrigerant, 'T', T3 + 273.15, 'P', P3); // kg/m³
      console.log(`${cycleName} - State 3: Using subcooled liquid properties (${subcooling.toFixed(1)}K subcooling)`);
    }

    // Point 2: inlet to condenser (like Python)
    const P2 = P3;
    const H2_is = props('H', refrigerant, 'P', P2, 'S', S1); // J/kg (isentropic)
    const H2 = (H2_is - H1) / compressorEff + H1; // J/kg (actual)
    const T2 = props('T', refrigerant, 'H', H2, 'P', P2) - 273.15; // °C
    const S2 = props('S', refrigerant, 'P', P2, 'H', H2); // J/kg·K
    const rho2 = props('D', refrigerant, 'H', H2, 'P', P2); // kg/m³

    // Point 4: inlet to evaporator (like Python)
    const H4 = H3; // J/kg (isenthalpic expansion)
    const T4 = evapTemp; // °C
    const P4 = P1; // Pa
    const S4 = props('S', refrigerant, 'H', H4, 'P', P4); // J/kg·K
    const x4 = props('Q', refrigerant, 'H', H4, 'P', P4); // quality
    const rho4 = props('D', refrigerant, 'H', H4, 'P', P4); // kg/m³

    // Calculate performance (convert J/kg to kJ/kg for display)
    const qEvap = (H1 - H4) / 1000; // kJ/kg (specific cooling effect)
    const massFlowRate = capacity / qEvap; // kg/s
    const compressorPower = massFlowRate * (H2 - H1) / 1000; // kW
    const heatingCapacity = massFlowRate * (H2 - H3) / 1000; // kW
    const cop_cooling = capacity / compressorPower;
    const cop_heating = heatingCapacity / compressorPower;
    const volumetricFlowRate = massFlowRate / rho1; // m³/s

    console.log(`${cycleName} - Thermodynamic results:`, {
      qEvap: qEvap.toFixed(2) + ' kJ/kg',
      massFlowRate: massFlowRate.toFixed(4) + ' kg/s',
      compressorPower: compressorPower.toFixed(2) + ' kW',
      cop_cooling: cop_cooling.toFixed(2)
    });

    // Validate all calculated values before creating cycle points
    const validateValue = (value: number, name: string): number => {
      if (!isFinite(value) || isNaN(value)) {
        console.warn(`Invalid ${name} value: ${value}, using default`);
        return 0;
      }
      return value;
    };

    // Create cycle points with validation (convert to display units)
    const points: CyclePoint[] = [
      {
        id: 1,
        name: 'Compressor Inlet',
        temperature: validateValue(T1, 'T1'),
        pressure: validateValue(P1 / 1e5, 'P1'), // Convert Pa to bar
        enthalpy: validateValue(H1 / 1000, 'H1'), // Convert J/kg to kJ/kg
        entropy: validateValue(S1 / 1000, 'S1'), // Convert J/kg·K to kJ/kg·K
        density: validateValue(rho1, 'rho1'),
        phase: 'vapor'
      },
      {
        id: 2,
        name: 'Compressor Outlet',
        temperature: validateValue(T2, 'T2'),
        pressure: validateValue(P2 / 1e5, 'P2'), // Convert Pa to bar
        enthalpy: validateValue(H2 / 1000, 'H2'), // Convert J/kg to kJ/kg
        entropy: validateValue(S2 / 1000, 'S2'), // Convert J/kg·K to kJ/kg·K
        density: validateValue(rho2, 'rho2'),
        phase: 'vapor'
      },
      {
        id: 3,
        name: 'Condenser Outlet',
        temperature: validateValue(T3, 'T3'),
        pressure: validateValue(P3 / 1e5, 'P3'), // Convert Pa to bar
        enthalpy: validateValue(H3 / 1000, 'H3'), // Convert J/kg to kJ/kg
        entropy: validateValue(S3 / 1000, 'S3'), // Convert J/kg·K to kJ/kg·K
        density: validateValue(rho3, 'rho3'),
        phase: Math.abs(subcooling) < 0.1 ? 'saturated-liquid' : 'liquid'
      },
      {
        id: 4,
        name: 'Evaporator Inlet',
        temperature: validateValue(T4, 'T4'),
        pressure: validateValue(P4 / 1e5, 'P4'), // Convert Pa to bar
        enthalpy: validateValue(H4 / 1000, 'H4'), // Convert J/kg to kJ/kg
        entropy: validateValue(S4 / 1000, 'S4'), // Convert J/kg·K to kJ/kg·K
        density: validateValue(rho4, 'rho4'),
        quality: validateValue(x4, 'x4'),
        phase: 'two-phase'
      }
    ];

    // Log detailed cycle information for debugging
    console.log(`${cycleName} - Detailed cycle points:`, {
      point1: `${T1.toFixed(1)}°C, ${(P1 / 1e5).toFixed(2)} bar, ${(H1 / 1000).toFixed(1)} kJ/kg`,
      point2: `${T2.toFixed(1)}°C, ${(P2 / 1e5).toFixed(2)} bar, ${(H2 / 1000).toFixed(1)} kJ/kg`,
      point3: `${T3.toFixed(1)}°C, ${(P3 / 1e5).toFixed(2)} bar, ${(H3 / 1000).toFixed(1)} kJ/kg`,
      point4: `${T4.toFixed(1)}°C, ${(P4 / 1e5).toFixed(2)} bar, ${(H4 / 1000).toFixed(1)} kJ/kg, x=${x4.toFixed(3)}`,
      pressureRatio: pressureRatio.toFixed(2),
      tempRise: (T2 - T1).toFixed(1) + '°C'
    });

    return {
      name: cycleName,
      cop: cop_cooling,
      power: compressorPower,
      capacity: capacity,
      evapTemp: evapTemp,
      condTemp: condTemp,
      pressureRatio: pressureRatio,
      energySavings: 0, // Will be set later
      points: points,
      performance: {
        coolingCapacity: capacity,
        heatingCapacity: heatingCapacity,
        compressorPower: compressorPower,
        cop_cooling: cop_cooling,
        cop_heating: cop_heating,
        massFlowRate: massFlowRate,
        volumetricFlowRate: volumetricFlowRate,
        pressureRatio: pressureRatio,
        isentropicEfficiency: compressorEff,
        volumetricEfficiency: 0.85 // Assumed
      }
    };

  } catch (error) {
    console.error(`Error calculating ${cycleName} VCC cycle:`, error);
    throw new Error(`Failed to calculate ${cycleName} VCC cycle: ${error}`);
  }
}

// Professional chiller performance analysis using proper thermodynamic principles
// Enhanced implementation based on mechanical engineering best practices
export function calculateChillerComparison(inputs: ChillerInputs): ChillerResults {
  try {
    const { refrigerant, oemCapacity, oemCOP, evapPressure, condPressure, superheat, subcooling, compressorEfficiency, ambientDBT, relativeHumidity, condApproach } = inputs;

    // Calculate wet bulb temperature from dry bulb temperature and relative humidity
    const psychrometrics = analyzePsychrometrics(ambientDBT, relativeHumidity);
    const ambientWBT = psychrometrics.wetBulbTemp;

    console.log('=== PROFESSIONAL CHILLER ANALYSIS ===');
    console.log('System parameters:', {
      refrigerant,
      capacity: oemCapacity + ' kW',
      evapPressure: evapPressure + ' kPa',
      condPressure: condPressure + ' kPa',
      superheat: superheat + ' K',
      subcooling: subcooling + ' K'
    });

    console.log('Environmental conditions:', {
      ambientDBT: ambientDBT + '°C',
      relativeHumidity: relativeHumidity + '%',
      calculatedWBT: ambientWBT.toFixed(1) + '°C',
      dewPoint: psychrometrics.dewPointTemp.toFixed(1) + '°C',
      condApproach: condApproach + 'K',
      optimizedCondTemp: (ambientWBT + condApproach).toFixed(1) + '°C'
    });

    console.log('Psychrometric analysis:', psychrometrics.analysis);

    // Calculate saturation temperatures from measured pressures
    const actualEvapTemp = saturationTemperature(evapPressure, refrigerant);
    const actualCondTemp = saturationTemperature(condPressure, refrigerant);
    const actualPressureRatio = condPressure / evapPressure;

    console.log('Measured conditions analysis:', {
      evapSatTemp: actualEvapTemp.toFixed(1) + '°C',
      condSatTemp: actualCondTemp.toFixed(1) + '°C',
      pressureRatio: actualPressureRatio.toFixed(2),
      superheatMeasured: superheat + 'K',
      subcoolingMeasured: subcooling + 'K'
    });

    // 1. OEM BASELINE CYCLE - Professional design conditions
    // Standard AHRI conditions for air-cooled chiller performance rating
    const oemEvapTemp = 7.0;  // Standard chilled water supply temperature (44°F)
    const oemCondTemp = 45.0; // Standard condensing temperature at 35°C ambient (95°F)
    const oemSuperheat = 5.0; // Standard superheat
    const oemSubcooling = 5.0; // Standard subcooling

    console.log('OEM design conditions:', {
      evapTemp: oemEvapTemp + '°C',
      condTemp: oemCondTemp + '°C',
      superheat: oemSuperheat + 'K',
      subcooling: oemSubcooling + 'K',
      ratedCOP: oemCOP
    });

    const oemResults = calculateVCCCycle(
      oemEvapTemp,
      oemCondTemp,
      oemSuperheat,
      oemSubcooling,
      compressorEfficiency,
      oemCapacity,
      refrigerant,
      'OEM Baseline'
    );

    // Override with manufacturer's rated COP (includes all real-world losses)
    oemResults.cop = oemCOP;
    oemResults.power = oemCapacity / oemCOP;
    oemResults.performance.cop_cooling = oemCOP;
    oemResults.performance.compressorPower = oemCapacity / oemCOP;

    // 2. ACTUAL OPERATING CYCLE - Based on real sensor measurements
    // Professional compressor analysis using enhanced model
    const actualCompressorEff = calculateCompressorEfficiency(actualPressureRatio, true);

    console.log('Actual cycle analysis:', {
      pressureRatio: actualPressureRatio.toFixed(2),
      volumetricEff: actualCompressorEff.volumetricEff.toFixed(3),
      isentropicEff: actualCompressorEff.isentropicEff.toFixed(3),
      operatingConditions: `${actualEvapTemp.toFixed(1)}°C evap / ${actualCondTemp.toFixed(1)}°C cond`
    });

    const actualResults = calculateVCCCycle(
      actualEvapTemp,
      actualCondTemp,
      superheat,
      subcooling,
      actualCompressorEff.isentropicEff, // Use calculated realistic efficiency
      oemCapacity,
      refrigerant,
      'Actual Operating'
    );

    // Apply system efficiency factor to account for additional real-world losses
    // This includes motor efficiency, mechanical losses, heat losses, fouling, etc.
    const systemEfficiencyFactor = inputs.systemEfficiencyFactor;
    const actualCOPWithLosses = actualResults.cop * systemEfficiencyFactor;

    // Update results with realistic performance
    actualResults.cop = actualCOPWithLosses;
    actualResults.power = oemCapacity / actualCOPWithLosses;
    actualResults.performance.cop_cooling = actualCOPWithLosses;
    actualResults.performance.compressorPower = oemCapacity / actualCOPWithLosses;

    console.log('Actual performance with system losses:', {
      thermodynamicCOP: (oemCapacity / (oemCapacity / actualResults.cop * systemEfficiencyFactor)).toFixed(2),
      systemCOP: actualCOPWithLosses.toFixed(2),
      systemEfficiency: (systemEfficiencyFactor * 100).toFixed(0) + '%',
      powerConsumption: actualResults.power.toFixed(1) + ' kW',
      degradationVsOEM: (((oemCOP - actualCOPWithLosses) / oemCOP) * 100).toFixed(1) + '%'
    });

    // 3. OPTIMIZED CYCLE - Professional condenser optimization strategy
    // Using wet bulb approach temperature for optimal condenser performance
    const optimizedCondTemp = ambientWBT + condApproach;

    // Calculate optimized pressure ratio and compressor efficiency
    const optimizedCondPressure = props('P', refrigerant, 'T', optimizedCondTemp + 273.15, 'Q', 0) / 1000; // kPa
    const optimizedPressureRatio = optimizedCondPressure / evapPressure;
    const optimizedCompressorEff = calculateCompressorEfficiency(optimizedPressureRatio, true);

    console.log('Optimized cycle design:', {
      strategy: `WBT + ${condApproach}K approach`,
      condTemp: optimizedCondTemp.toFixed(1) + '°C',
      condTempReduction: (actualCondTemp - optimizedCondTemp).toFixed(1) + '°C',
      pressureRatio: optimizedPressureRatio.toFixed(2),
      pressureRatioImprovement: (actualPressureRatio - optimizedPressureRatio).toFixed(2),
      volumetricEff: optimizedCompressorEff.volumetricEff.toFixed(3),
      isentropicEff: optimizedCompressorEff.isentropicEff.toFixed(3)
    });

    const optimizedResults = calculateVCCCycle(
      actualEvapTemp, // Maintain same evaporator conditions to preserve cooling capacity
      optimizedCondTemp,
      superheat,
      subcooling,
      optimizedCompressorEff.isentropicEff, // Use calculated realistic efficiency
      oemCapacity,
      refrigerant,
      'Optimized Solution'
    );

    // Apply same system efficiency factor for consistent comparison
    const optimizedCOPWithLosses = optimizedResults.cop * systemEfficiencyFactor;

    // Update results with realistic performance
    optimizedResults.cop = optimizedCOPWithLosses;
    optimizedResults.power = oemCapacity / optimizedCOPWithLosses;
    optimizedResults.performance.cop_cooling = optimizedCOPWithLosses;
    optimizedResults.performance.compressorPower = oemCapacity / optimizedCOPWithLosses;

    console.log('Optimization performance analysis:', {
      condTempReduction: (actualCondTemp - optimizedCondTemp).toFixed(1) + '°C',
      pressureRatioImprovement: ((actualPressureRatio - optimizedPressureRatio) / actualPressureRatio * 100).toFixed(1) + '%',
      thermodynamicCOP: (oemCapacity / (oemCapacity / optimizedResults.cop * systemEfficiencyFactor)).toFixed(2),
      systemCOP: optimizedCOPWithLosses.toFixed(2),
      powerConsumption: optimizedResults.power.toFixed(1) + ' kW',
      improvementVsActual: (((actualCOPWithLosses - optimizedCOPWithLosses) / actualCOPWithLosses) * -100).toFixed(1) + '%'
    });

    // Calculate energy savings using professional thermodynamic relationships
    // Energy savings = (Power_baseline - Power_improved) / Power_baseline * 100%
    actualResults.energySavings = ((oemResults.power - actualResults.power) / oemResults.power) * 100;
    optimizedResults.energySavings = ((actualResults.power - optimizedResults.power) / actualResults.power) * 100;

    // Additional performance metrics
    const optimizedVsOEMSavings = ((oemResults.power - optimizedResults.power) / oemResults.power) * 100;
    const copImprovementActualToOptimized = ((optimizedCOPWithLosses - actualCOPWithLosses) / actualCOPWithLosses) * 100;
    const copDegradationOEMToActual = ((oemCOP - actualCOPWithLosses) / oemCOP) * 100;

    console.log('=== PERFORMANCE COMPARISON SUMMARY ===');
    console.log('Energy analysis:', {
      oemPower: oemResults.power.toFixed(1) + ' kW',
      actualPower: actualResults.power.toFixed(1) + ' kW',
      optimizedPower: optimizedResults.power.toFixed(1) + ' kW'
    });

    console.log('COP analysis:', {
      oemCOP: oemCOP.toFixed(2),
      actualCOP: actualCOPWithLosses.toFixed(2),
      optimizedCOP: optimizedCOPWithLosses.toFixed(2)
    });

    console.log('Savings analysis:', {
      actualVsOEM: actualResults.energySavings.toFixed(1) + '% (negative = increased consumption)',
      optimizedVsActual: optimizedResults.energySavings.toFixed(1) + '%',
      optimizedVsOEM: optimizedVsOEMSavings.toFixed(1) + '%',
      copImprovementPotential: copImprovementActualToOptimized.toFixed(1) + '%',
      currentDegradation: copDegradationOEMToActual.toFixed(1) + '%'
    });

    // Generate P-H diagram data
    const phDiagramData = generateChillerPHDiagramData(refrigerant, oemResults, actualResults, optimizedResults, inputs);

    // Generate professional recommendations
    const recommendations = generateChillerRecommendations(inputs, oemResults, actualResults, optimizedResults);

    console.log('=== ANALYSIS COMPLETE ===');

    return {
      oem: oemResults,
      actual: actualResults,
      optimized: optimizedResults,
      degradationZone: actualResults.cop < oemResults.cop,
      recommendations: recommendations,
      phDiagramData: phDiagramData
    };

  } catch (error) {
    console.error('Chiller analysis error:', error);
    throw new Error(`Failed to calculate chiller analysis: ${error}`);
  }
}

// Generate P-H diagram data for chiller comparison
function generateChillerPHDiagramData(
  refrigerant: string,
  oemResults: CycleResults,
  actualResults: CycleResults,
  optimizedResults: CycleResults,
  inputs: ChillerInputs
) {
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

    // Extract cycle data - create complete vapor compression cycle like Python prototype
    const extractCycleData = (results: CycleResults) => {
      if (results.points.length < 4) {
        throw new Error(`Incomplete cycle data: only ${results.points.length} points`);
      }

      // Create complete cycle with all intermediate saturation points (matching Python prototype)
      // This creates the proper P-H diagram representation with saturation transitions
      const point1 = results.points[0]; // Compressor inlet (superheated vapor)
      const point2 = results.points[1]; // Compressor outlet (superheated vapor)
      const point3 = results.points[2]; // Condenser outlet (subcooled liquid)
      const point4 = results.points[3]; // Evaporator inlet (two-phase)

      try {
        // Calculate intermediate saturation points for proper cycle visualization
        // Saturated vapor at condenser pressure (between points 2 and 3)
        const h23_vapor = props('H', refrigerant, 'P', point2.pressure * 1e5, 'Q', 1) / 1000; // kJ/kg
        const p23_vapor = point2.pressure; // bar

        // Saturated liquid at condenser pressure (between points 2 and 3)
        const h23_liquid = props('H', refrigerant, 'P', point2.pressure * 1e5, 'Q', 0) / 1000; // kJ/kg
        const p23_liquid = point2.pressure; // bar

        // Saturated vapor at evaporator pressure (between points 4 and 1)
        const h41_vapor = props('H', refrigerant, 'P', point1.pressure * 1e5, 'Q', 1) / 1000; // kJ/kg
        const p41_vapor = point1.pressure; // bar

        // CORRECT VCC cycle sequence following actual thermodynamic processes:
        // 1 → 2: Compression (isentropic)
        // 2 → 2-3v: Desuperheating (constant pressure)
        // 2-3v → 2-3l: Condensation (constant pressure, constant temperature)
        // 2-3l → 3: Subcooling (constant pressure)
        // 3 → 4: Expansion (isenthalpic)
        // 4 → 4-1v: Evaporation (constant pressure, constant temperature)
        // 4-1v → 1: Superheating (constant pressure)

        // CRITICAL FIX: If subcooling = 0, then State 3 should be at saturated liquid line
        const actualSubcooling = results.condTemp - point3.temperature;
        const state3Enthalpy = Math.abs(actualSubcooling) < 0.1 ? h23_liquid : (point3.enthalpy || 0);

        console.log(`${results.name} - State 3 Analysis:`, {
          condTemp: results.condTemp.toFixed(1) + '°C',
          point3Temp: point3.temperature.toFixed(1) + '°C',
          actualSubcooling: actualSubcooling.toFixed(1) + 'K',
          usingSaturatedLiquid: Math.abs(actualSubcooling) < 0.1,
          state3Enthalpy: state3Enthalpy.toFixed(1) + ' kJ/kg',
          saturatedLiquidEnthalpy: h23_liquid.toFixed(1) + ' kJ/kg'
        });

        const enthalpy = [
          point1.enthalpy || 0,  // State 1: Compressor inlet (superheated vapor)
          point2.enthalpy || 0,  // State 2: Compressor outlet (superheated vapor)
          h23_vapor,             // State 2-3v: Saturated vapor at condenser pressure
          h23_liquid,            // State 2-3l: Saturated liquid at condenser pressure
          state3Enthalpy,        // State 3: Condenser outlet (saturated liquid OR subcooled liquid)
          point4.enthalpy || 0,  // State 4: Evaporator inlet (two-phase)
          h41_vapor,             // State 4-1v: Saturated vapor at evaporator pressure
          point1.enthalpy || 0   // State 1: Back to compressor inlet (close cycle)
        ];

        const pressure = [
          point1.pressure,  // State 1: Evaporator pressure (low)
          point2.pressure,  // State 2: Condenser pressure (high)
          p23_vapor,        // State 2-3v: Condenser pressure (high)
          p23_liquid,       // State 2-3l: Condenser pressure (high)
          point3.pressure,  // State 3: Condenser pressure (high)
          point4.pressure,  // State 4: Evaporator pressure (low)
          p41_vapor,        // State 4-1v: Evaporator pressure (low)
          point1.pressure   // State 1: Evaporator pressure (low) - cycle closure
        ];

        // Verify the cycle follows correct thermodynamic sequence
        console.log(`${results.name} - VCC Process Verification:`, {
          '1→2_Compression': `P: ${point1.pressure.toFixed(2)} → ${point2.pressure.toFixed(2)} bar, h: ${(point1.enthalpy || 0).toFixed(1)} → ${(point2.enthalpy || 0).toFixed(1)} kJ/kg`,
          '2→3_Condensation': `P: ${point2.pressure.toFixed(2)} bar (constant), h: ${(point2.enthalpy || 0).toFixed(1)} → ${(point3.enthalpy || 0).toFixed(1)} kJ/kg`,
          '3→4_Expansion': `P: ${point3.pressure.toFixed(2)} → ${point4.pressure.toFixed(2)} bar, h: ${(point3.enthalpy || 0).toFixed(1)} → ${(point4.enthalpy || 0).toFixed(1)} kJ/kg (isenthalpic)`,
          '4→1_Evaporation': `P: ${point4.pressure.toFixed(2)} bar (constant), h: ${(point4.enthalpy || 0).toFixed(1)} → ${(point1.enthalpy || 0).toFixed(1)} kJ/kg`
        });

        // Validate the thermodynamic cycle makes sense
        const cycleValidation = {
          compressionOK: point2.pressure > point1.pressure, // Compression increases pressure
          condensationOK: Math.abs(point2.pressure - point3.pressure) < 0.01, // Constant pressure condensation
          expansionOK: point3.pressure > point4.pressure, // Expansion decreases pressure
          evaporationOK: Math.abs(point4.pressure - point1.pressure) < 0.01, // Constant pressure evaporation
          enthalpyIncreaseCompression: (point2.enthalpy || 0) > (point1.enthalpy || 0),
          enthalpyIncreaseEvaporation: (point1.enthalpy || 0) > (point4.enthalpy || 0)
        };

        console.log(`${results.name} thermodynamic validation:`, cycleValidation);

        // Validate cycle data before returning
        const validEnthalpy = enthalpy.filter(h => h && !isNaN(h) && isFinite(h));
        const validPressure = pressure.filter(p => p && !isNaN(p) && isFinite(p));

        if (validEnthalpy.length !== enthalpy.length || validPressure.length !== pressure.length) {
          console.warn(`${results.name} has invalid data points:`, {
            originalEnthalpy: enthalpy.length,
            validEnthalpy: validEnthalpy.length,
            originalPressure: pressure.length,
            validPressure: validPressure.length
          });
        }

        console.log(`${results.name} complete cycle data:`, {
          points: enthalpy.length,
          enthalpy: enthalpy.map(h => h.toFixed(1)),
          pressure: pressure.map(p => p.toFixed(2)),
          evapTemp: results.evapTemp.toFixed(1) + '°C',
          condTemp: results.condTemp.toFixed(1) + '°C',
          pressureRatio: results.pressureRatio.toFixed(2),
          cop: results.cop.toFixed(2)
        });

        // Validate the VCC sequence is thermodynamically correct
        const isValidSequence = validateVCCSequence(enthalpy, pressure, results.name);
        if (!isValidSequence) {
          console.warn(`${results.name}: VCC sequence validation failed - check thermodynamic connections`);
        }

        return { enthalpy, pressure };

      } catch (error) {
        console.error(`Error creating complete cycle for ${results.name}:`, error);

        // Fallback to basic 4-point cycle if saturation point calculation fails
        const enthalpy = [
          point1.enthalpy || 0,
          point2.enthalpy || 0,
          point3.enthalpy || 0,
          point4.enthalpy || 0,
          point1.enthalpy || 0
        ];

        const pressure = [
          point1.pressure,
          point2.pressure,
          point3.pressure,
          point4.pressure,
          point1.pressure
        ];

        return { enthalpy, pressure };
      }
    };

    const oemCycle = extractCycleData(oemResults);
    const actualCycle = extractCycleData(actualResults);
    const optimizedCycle = extractCycleData(optimizedResults);

    // Generate isotherms, isobars, quality lines if requested
    const isotherms = inputs.showIsotherms ? generateIsotherms(refrigerant) : undefined;
    const isobars = inputs.showIsobars ? generateIsobars(refrigerant) : undefined;
    const qualityLines = inputs.showQualityLines ? generateQualityLines(refrigerant, saturationPressure) : undefined;

    // Create combined cycle data for scaling
    const cycleEnthalpy = [
      ...oemCycle.enthalpy,
      ...actualCycle.enthalpy,
      ...optimizedCycle.enthalpy
    ].filter(h => h && !isNaN(h));

    const cyclePressure = [
      ...oemCycle.pressure,
      ...actualCycle.pressure,
      ...optimizedCycle.pressure
    ].filter(p => p && !isNaN(p));

    return {
      enthalpy: tempRange,
      pressure: saturationPressure,
      saturatedLiquidEnthalpy,
      saturatedVaporEnthalpy,
      saturationPressure,
      cycleEnthalpy,
      cyclePressure,
      oemCycle,
      actualCycle,
      optimizedCycle,
      isotherms,
      isobars,
      qualityLines
    };

  } catch (error) {
    console.error('P-H diagram generation error:', error);
    throw new Error('Failed to generate P-H diagram data');
  }
}

// Generate isotherms for P-H diagram
function generateIsotherms(refrigerant: string) {
  const isotherms = { enthalpy: [] as number[][], pressure: [] as number[][], temperatures: [] as number[] };
  const tempLines = [-10, 10, 30, 50, 70, 90]; // °C - adjusted range

  tempLines.forEach(temp => {
    const enthalpyLine: number[] = [];
    const pressureLine: number[] = [];

    const pressureRange = Array.from({ length: 20 }, (_, i) => 0.5 + i * 0.75); // 0.5 to 15 bar
    pressureRange.forEach(pressure => {
      try {
        const tSat = saturationTemperature(pressure * 1000, refrigerant); // Convert bar to kPa
        if (temp > tSat + 1) { // Add margin to avoid saturation line
          const h = props('H', refrigerant, 'T', temp + 273.15, 'P', pressure * 1e5) / 1000;
          if (h && !isNaN(h)) {
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          }
        }
      } catch (e) {
        // Skip invalid states
      }
    });

    if (enthalpyLine.length > 3) { // Ensure we have enough points
      isotherms.enthalpy.push(enthalpyLine);
      isotherms.pressure.push(pressureLine);
      isotherms.temperatures.push(temp);
    }
  });

  console.log(`Generated ${isotherms.enthalpy.length} isotherms`);
  return isotherms;
}

// Generate isobars for P-H diagram
function generateIsobars(refrigerant: string) {
  const isobars = { enthalpy: [] as number[][], pressure: [] as number[][], pressures: [] as number[] };
  const pressureLines = [1, 2, 5, 10, 15, 20]; // bar

  pressureLines.forEach(pressure => {
    const enthalpyLine: number[] = [];
    const pressureLine: number[] = [];

    try {
      const tSat = saturationTemperature(pressure * 1000, refrigerant); // Convert bar to kPa

      // Liquid region (subcooled) - reduced range to avoid errors
      for (let temp = tSat - 10; temp <= tSat - 0.1; temp += 2) {
        try {
          const h = props('H', refrigerant, 'T', temp + 273.15, 'P', pressure * 1e5) / 1000;
          if (h && !isNaN(h)) {
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          }
        } catch (e) {
          // Skip invalid states
        }
      }

      // Two-phase region
      for (let q = 0; q <= 1; q += 0.1) {
        try {
          const h = props('H', refrigerant, 'P', pressure * 1e5, 'Q', q) / 1000;
          if (h && !isNaN(h)) {
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          }
        } catch (e) {
          // Skip invalid states
        }
      }

      // Vapor region (superheated) - reduced range
      for (let temp = tSat + 0.1; temp <= tSat + 30; temp += 3) {
        try {
          const h = props('H', refrigerant, 'T', temp + 273.15, 'P', pressure * 1e5) / 1000;
          if (h && !isNaN(h)) {
            enthalpyLine.push(h);
            pressureLine.push(pressure);
          }
        } catch (e) {
          // Skip invalid states
        }
      }

      if (enthalpyLine.length > 5) { // Ensure we have enough points
        isobars.enthalpy.push(enthalpyLine);
        isobars.pressure.push(pressureLine);
        isobars.pressures.push(pressure);
      }
    } catch (e) {
      console.warn(`Failed to generate isobar for ${pressure} bar:`, e);
    }
  });

  console.log(`Generated ${isobars.enthalpy.length} isobars`);
  return isobars;
}

// Generate quality lines for P-H diagram
function generateQualityLines(refrigerant: string, saturationPressure: number[]) {
  const qualityLines = { enthalpy: [] as number[][], pressure: [] as number[][], qualities: [] as number[] };
  const qualities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

  qualities.forEach(quality => {
    const enthalpyLine: number[] = [];
    const pressureLine: number[] = [];

    saturationPressure.forEach(pressure => {
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

  return qualityLines;
}

// Generate professional engineering recommendations based on thermodynamic analysis
function generateChillerRecommendations(
  inputs: ChillerInputs,
  oemResults: CycleResults,
  actualResults: CycleResults,
  optimizedResults: CycleResults
): string[] {
  const recommendations: string[] = [];

  // Calculate wet bulb temperature for optimization recommendations
  const ambientWBT = calculateWetBulbTemperature(inputs.ambientDBT, inputs.relativeHumidity);

  // Calculate key performance indicators
  const copDegradation = ((oemResults.cop - actualResults.cop) / oemResults.cop * 100);
  const energySavingsPotential = optimizedResults.energySavings;
  const pressureRatioReduction = ((actualResults.pressureRatio - (inputs.condPressure / inputs.evapPressure)) / actualResults.pressureRatio * 100);

  // Priority 1: Major energy savings opportunity
  if (energySavingsPotential > 15) {
    recommendations.push(
      `🎯 HIGH PRIORITY: Implement condenser optimization to achieve ${energySavingsPotential.toFixed(1)}% energy savings by reducing condensing temperature to ${(ambientWBT + inputs.condApproach).toFixed(1)}°C`
    );
  } else if (energySavingsPotential > 8) {
    recommendations.push(
      `⚡ MEDIUM PRIORITY: Condenser optimization can achieve ${energySavingsPotential.toFixed(1)}% energy savings through improved heat rejection`
    );
  }

  // Priority 2: Performance degradation alert
  if (copDegradation > 15) {
    recommendations.push(
      `🚨 CRITICAL: Current COP is ${copDegradation.toFixed(1)}% below OEM specifications. Immediate maintenance required - check for refrigerant leaks, fouling, or mechanical issues`
    );
  } else if (copDegradation > 5) {
    recommendations.push(
      `⚠️ WARNING: Performance degradation of ${copDegradation.toFixed(1)}% detected. Schedule preventive maintenance to restore efficiency`
    );
  }

  // Priority 3: Operational optimization
  if (actualResults.pressureRatio > 4.5) {
    recommendations.push(
      `🔧 OPERATIONAL: High pressure ratio (${actualResults.pressureRatio.toFixed(2)}) indicates excessive condenser pressure. Optimize condenser fan control and cleaning schedule`
    );
  }

  // Superheat control optimization
  if (inputs.superheat > 12) {
    recommendations.push(
      `🎛️ CONTROLS: Superheat of ${inputs.superheat}K is excessive. Optimize expansion valve control to reduce compressor work and improve efficiency`
    );
  } else if (inputs.superheat < 3) {
    recommendations.push(
      `⚠️ SAFETY: Low superheat (${inputs.superheat}K) risks liquid slugging. Increase superheat setpoint to 5-8K for safe operation`
    );
  }

  // System efficiency analysis
  if (inputs.systemEfficiencyFactor < 0.4) {
    recommendations.push(
      `🔍 INVESTIGATION: Very low system efficiency factor (${(inputs.systemEfficiencyFactor * 100).toFixed(0)}%) indicates major mechanical losses. Investigate motor efficiency, belt drives, and bearing condition`
    );
  }

  // Subcooling optimization
  if (inputs.subcooling < 2) {
    recommendations.push(
      `💧 SUBCOOLING: Increase subcooling to 3-5K to improve system efficiency and prevent flash gas formation`
    );
  } else if (inputs.subcooling > 10) {
    recommendations.push(
      `💧 SUBCOOLING: Excessive subcooling (${inputs.subcooling}K) may indicate condenser oversizing or control issues`
    );
  }

  // Implementation strategy recommendations
  recommendations.push(
    `📋 IMPLEMENTATION: Maintain evaporator temperature at ${actualResults.evapTemp.toFixed(1)}°C to preserve cooling capacity while optimizing condenser side`
  );

  if (energySavingsPotential > 10) {
    recommendations.push(
      `🎯 STRATEGY: Install variable speed drives on condenser fans for optimal approach temperature control based on ambient conditions`
    );
  }

  recommendations.push(
    `📊 MONITORING: Implement continuous monitoring of pressure ratio, superheat, and COP to maintain optimal performance`
  );

  // Economic analysis recommendation
  const annualSavings = energySavingsPotential * actualResults.power * 8760 * 0.12 / 100; // Assuming $0.12/kWh, 8760 hours/year
  if (annualSavings > 5000) {
    recommendations.push(
      `💰 ECONOMICS: Estimated annual energy cost savings of $${annualSavings.toFixed(0)} justify optimization investment`
    );
  }

  return recommendations;
}

// Create Plotly data for chiller P-H diagram
export function createChillerPHPlotData(phData: any, refrigerant: string): PlotData[] {
  const plotData: PlotData[] = [];

  // Debug logging
  console.log('P-H Diagram Data:', {
    oemCycle: phData.oemCycle,
    actualCycle: phData.actualCycle,
    optimizedCycle: phData.optimizedCycle
  });

  // Saturation dome (liquid line)
  plotData.push({
    x: phData.saturatedLiquidEnthalpy,
    y: phData.saturationPressure,
    mode: 'lines',
    type: 'scatter',
    name: 'Saturated Liquid',
    line: { color: '#1f77b4', width: 2 },
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
    line: { color: '#ff7f0e', width: 2 },
    showlegend: true,
    hovertemplate: 'Saturated Vapor<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>'
  });

  // Isotherms
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

  // Isobars
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

  // Quality lines
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

  // Enhanced cycle data validation with detailed debugging
  const validateCycleData = (cycle: any, name: string) => {
    console.log(`Validating ${name} cycle data:`, {
      hasData: !!cycle,
      hasEnthalpy: !!(cycle && cycle.enthalpy),
      hasPressure: !!(cycle && cycle.pressure),
      enthalpyLength: cycle?.enthalpy?.length || 0,
      pressureLength: cycle?.pressure?.length || 0
    });

    if (!cycle || !cycle.enthalpy || !cycle.pressure) {
      console.error(`${name} cycle missing critical data:`, {
        cycle: !!cycle,
        enthalpy: cycle?.enthalpy,
        pressure: cycle?.pressure
      });
      return null;
    }

    // Detailed validation of each data point
    const enthalpyValidation = cycle.enthalpy.map((h: number, i: number) => ({
      index: i,
      value: h,
      isValid: h && !isNaN(h) && isFinite(h)
    }));

    const pressureValidation = cycle.pressure.map((p: number, i: number) => ({
      index: i,
      value: p,
      isValid: p && !isNaN(p) && isFinite(p)
    }));

    const validEnthalpy = cycle.enthalpy.filter((h: number) => h && !isNaN(h) && isFinite(h));
    const validPressure = cycle.pressure.filter((p: number) => p && !isNaN(p) && isFinite(p));

    console.log(`${name} cycle detailed validation:`, {
      originalLength: cycle.enthalpy.length,
      validEnthalpyCount: validEnthalpy.length,
      validPressureCount: validPressure.length,
      invalidEnthalpy: enthalpyValidation.filter(v => !v.isValid),
      invalidPressure: pressureValidation.filter(v => !v.isValid)
    });

    if (validEnthalpy.length !== validPressure.length) {
      console.warn(`${name} cycle data length mismatch - using minimum length`);
      const minLength = Math.min(validEnthalpy.length, validPressure.length);
      return {
        enthalpy: validEnthalpy.slice(0, minLength),
        pressure: validPressure.slice(0, minLength)
      };
    }

    if (validEnthalpy.length < 4) {
      console.error(`${name} cycle has insufficient valid points: ${validEnthalpy.length}`);
      return null;
    }

    console.log(`${name} cycle successfully validated:`, {
      points: validEnthalpy.length,
      enthalpyRange: `${Math.min(...validEnthalpy).toFixed(1)} to ${Math.max(...validEnthalpy).toFixed(1)} kJ/kg`,
      pressureRange: `${Math.min(...validPressure).toFixed(2)} to ${Math.max(...validPressure).toFixed(2)} bar`
    });

    return {
      enthalpy: validEnthalpy,
      pressure: validPressure
    };
  };

  // Professional VCC cycle plotting with proper state point labels and connections
  const plotVCCCycle = (cycleData: any, cycleName: string, color: string, showLabels: boolean = true) => {
    const validatedData = validateCycleData(cycleData, cycleName);
    if (!validatedData) return;

    const { enthalpy, pressure } = validatedData;

    // Correct VCC state point labels following thermodynamic process sequence
    const stateLabels = ['1', '2', '2-3v', '2-3l', '3', '4', '4-1v', '1'];
    const stateDescriptions = [
      'State 1: Compressor Inlet (Superheated Vapor)',
      'State 2: Compressor Outlet (Superheated Vapor)',
      'State 2-3v: Desuperheating End (Saturated Vapor)',
      'State 2-3l: Condensation End (Saturated Liquid)',
      'State 3: Condenser Outlet (Subcooled Liquid)',
      'State 4: Evaporator Inlet (Two-Phase)',
      'State 4-1v: Evaporation End (Saturated Vapor)',
      'State 1: Cycle Return (Compressor Inlet)'
    ];

    // Process descriptions for educational purposes
    const processDescriptions = [
      '1→2: Isentropic Compression',
      '2→2-3v: Desuperheating (Constant P)',
      '2-3v→2-3l: Condensation (Constant P,T)',
      '2-3l→3: Subcooling (Constant P)',
      '3→4: Isenthalpic Expansion',
      '4→4-1v: Evaporation (Constant P,T)',
      '4-1v→1: Superheating (Constant P)',
      'Cycle Complete'
    ];

    // Main cycle line with proper connections
    plotData.push({
      x: enthalpy,
      y: pressure,
      mode: 'lines+markers',
      type: 'scatter',
      name: `${cycleName} Cycle`,
      line: { color: color, width: 4 },
      marker: {
        color: color,
        size: 12,
        symbol: 'circle',
        line: { color: 'white', width: 2 }
      },
      showlegend: true,
      hovertemplate: `${cycleName} Cycle<br>` +
        'State: %{customdata.label}<br>' +
        'Process: %{customdata.process}<br>' +
        'h: %{x:.1f} kJ/kg<br>' +
        'P: %{y:.2f} bar<br>' +
        '%{customdata.description}<extra></extra>',
      customdata: enthalpy.map((_, i) => ({
        label: stateLabels[i] || `${i + 1}`,
        description: stateDescriptions[i] || 'Cycle Point',
        process: processDescriptions[i] || 'Process Step'
      }))
    });

    // Add state point labels if requested
    if (showLabels && enthalpy.length >= 4) {
      // Only label the main 4 thermodynamic states to avoid clutter
      const mainStates = [0, 1, 4, 5]; // Points 1, 2, 3, 4
      const mainLabels = ['1', '2', '3', '4'];
      const mainDescriptions = [
        'Compressor Inlet',
        'Compressor Outlet',
        'Condenser Outlet',
        'Evaporator Inlet'
      ];

      plotData.push({
        x: mainStates.map(i => enthalpy[i]),
        y: mainStates.map(i => pressure[i]),
        mode: 'markers+text',
        type: 'scatter',
        name: `${cycleName} Labels`,
        marker: {
          color: color,
          size: 16,
          symbol: 'circle',
          line: { color: 'white', width: 3 }
        },
        text: mainLabels,
        textposition: 'middle center',
        textfont: {
          color: 'white',
          size: 12,
          family: 'Arial Black'
        },
        showlegend: false,
        hovertemplate: `${cycleName} - State %{text}<br>` +
          '%{customdata}<br>' +
          'h: %{x:.1f} kJ/kg<br>' +
          'P: %{y:.2f} bar<extra></extra>',
        customdata: mainDescriptions
      });
    }

    console.log(`Plotted ${cycleName} cycle:`, {
      points: enthalpy.length,
      stateLabels: stateLabels.slice(0, enthalpy.length),
      enthalpyRange: `${Math.min(...enthalpy).toFixed(1)} to ${Math.max(...enthalpy).toFixed(1)} kJ/kg`,
      pressureRange: `${Math.min(...pressure).toFixed(2)} to ${Math.max(...pressure).toFixed(2)} bar`
    });
  };

  // Plot all three cycles with proper VCC state labeling
  plotVCCCycle(phData.oemCycle, 'OEM', '#2563eb', true);
  plotVCCCycle(phData.actualCycle, 'Actual', '#dc2626', true);
  plotVCCCycle(phData.optimizedCycle, 'Optimized', '#059669', true);

  // Add process arrows to show cycle direction (optional enhancement)
  const addProcessArrows = (cycleData: any, cycleName: string, color: string) => {
    const validatedData = validateCycleData(cycleData, cycleName);
    if (!validatedData || validatedData.enthalpy.length < 4) return;

    const { enthalpy, pressure } = validatedData;

    // Add arrows between main process steps
    const processes = [
      { from: 0, to: 1, name: 'Compression' },
      { from: 1, to: 4, name: 'Condensation' }, // Skip intermediate points for clarity
      { from: 4, to: 5, name: 'Expansion' },
      { from: 5, to: 0, name: 'Evaporation' } // Skip intermediate points for clarity
    ];

    processes.forEach(process => {
      if (process.from < enthalpy.length && process.to < enthalpy.length) {
        const midH = (enthalpy[process.from] + enthalpy[process.to]) / 2;
        const midP = (pressure[process.from] + pressure[process.to]) / 2;

        plotData.push({
          x: [midH],
          y: [midP],
          mode: 'markers',
          type: 'scatter',
          name: `${cycleName} ${process.name}`,
          marker: {
            color: color,
            size: 8,
            symbol: 'triangle-right',
            opacity: 0.7
          },
          showlegend: false,
          hovertemplate: `${cycleName}<br>${process.name}<extra></extra>`
        });
      }
    });
  };

  // Add process arrows for better visualization (optional)
  // addProcessArrows(phData.oemCycle, 'OEM', '#2563eb');
  // addProcessArrows(phData.actualCycle, 'Actual', '#dc2626');
  // addProcessArrows(phData.optimizedCycle, 'Optimized', '#059669');

  // Add degradation zone between OEM and Actual cycles (matching Python prototype)
  const addDegradationZone = () => {
    const oemData = validateCycleData(phData.oemCycle, 'OEM');
    const actualData = validateCycleData(phData.actualCycle, 'Actual');

    if (oemData && actualData && oemData.enthalpy.length === actualData.enthalpy.length) {
      // Create polygon for degradation zone
      const degradationEnthalpy = [
        ...oemData.enthalpy,
        ...actualData.enthalpy.slice().reverse()
      ];

      const degradationPressure = [
        ...oemData.pressure,
        ...actualData.pressure.slice().reverse()
      ];

      plotData.push({
        x: degradationEnthalpy,
        y: degradationPressure,
        fill: 'toself',
        fillcolor: 'rgba(220, 38, 38, 0.15)', // Semi-transparent red
        line: { color: 'rgba(220, 38, 38, 0)' }, // Invisible line
        mode: 'lines',
        type: 'scatter',
        name: 'Performance Degradation Zone',
        showlegend: true,
        hoverinfo: 'name',
        hovertemplate: 'Performance Degradation Zone<br>Area between OEM and Actual cycles<extra></extra>'
      });

      console.log('Added degradation zone visualization');
    }
  };

  // Add degradation zone if both OEM and Actual cycles exist
  addDegradationZone();

  // Add cycle comparison annotations
  const addCycleComparison = () => {
    const oemData = validateCycleData(phData.oemCycle, 'OEM');
    const actualData = validateCycleData(phData.actualCycle, 'Actual');
    const optimizedData = validateCycleData(phData.optimizedCycle, 'Optimized');

    if (oemData && actualData && optimizedData) {
      console.log('Cycle comparison summary:', {
        oemPoints: oemData.enthalpy.length,
        actualPoints: actualData.enthalpy.length,
        optimizedPoints: optimizedData.enthalpy.length,
        oemEnthalpyRange: `${Math.min(...oemData.enthalpy).toFixed(1)} - ${Math.max(...oemData.enthalpy).toFixed(1)} kJ/kg`,
        actualEnthalpyRange: `${Math.min(...actualData.enthalpy).toFixed(1)} - ${Math.max(...actualData.enthalpy).toFixed(1)} kJ/kg`,
        optimizedEnthalpyRange: `${Math.min(...optimizedData.enthalpy).toFixed(1)} - ${Math.max(...optimizedData.enthalpy).toFixed(1)} kJ/kg`
      });
    }
  };

  addCycleComparison();

  console.log('P-H diagram generation complete:', {
    totalTraces: plotData.length,
    cycleTraces: plotData.filter(trace => trace.name?.includes('Cycle')).length,
    labelTraces: plotData.filter(trace => trace.name?.includes('Labels')).length,
    backgroundTraces: plotData.filter(trace => !trace.name?.includes('Cycle') && !trace.name?.includes('Labels')).length
  });

  return plotData;
}