/**
 * Chiller Performance Analysis Calculations
 * Based on the business logic from refrigeration_dash.py
 */

export interface ChillerInputs {
  // OEM Specifications
  oemCOP: number;
  oemCapacity: number; // kW
  refrigerant: string;
  
  // Actual Sensor Data
  evapPressure: number; // kPa
  condPressure: number; // kPa
  suctionTemp: number; // °C
  dischargeTemp: number; // °C
  evapLWT: number; // °C
  evapEWT: number; // °C
  condApproach: number; // K
  superheat: number; // K
  subcooling: number; // K
  
  // Environmental Conditions
  ambientDBT: number; // °C
  ambientWBT: number; // °C
  
  // System Parameters
  compressorEfficiency: number;
  systemEfficiencyFactor: number;
}

export interface CycleResults {
  cop: number;
  power: number; // kW
  capacity: number; // kW
  evapTemp: number; // °C
  condTemp: number; // °C
  pressureRatio: number;
  energySavings: number; // % vs reference
  cyclePoints: CyclePoint[];
}

export interface CyclePoint {
  id: number;
  name: string;
  temperature: number; // °C
  pressure: number; // kPa
  enthalpy?: number; // kJ/kg
  entropy?: number; // kJ/kg·K
}

export interface ComparisonResults {
  oem: CycleResults;
  actual: CycleResults;
  optimized: CycleResults;
  degradationZone: boolean;
  recommendations: string[];
}

/**
 * Business Logic Assumptions from Python Code:
 * 
 * 1. OEM Cycle:
 *    - Uses hardcoded COP of 2.87 (from Daikin datasheet)
 *    - Standard evap temp ~7°C, cond temp ~45°C at 35°C ambient
 *    - Standard superheat 5K, subcooling 5K
 * 
 * 2. Actual Cycle:
 *    - Uses sensor readings for pressures and temperatures
 *    - Hardcoded COP of 2.6 (-9.4% vs OEM)
 *    - System efficiency factor 0.42 accounts for real-world losses
 * 
 * 3. Optimized Cycle:
 *    - Reduces condenser temp using WBT + approach method
 *    - Keeps same evaporator conditions as actual
 *    - Hardcoded COP of 4.3 for demonstration
 *    - Results in ~28% energy savings vs actual
 */

// Simplified saturation temperature calculation for R134a
// In production, this would use CoolProp
export function saturationTemperature(pressure: number, fluid: string): number {
  if (fluid === 'R134a') {
    // Simplified Antoine equation approximation for R134a
    // P in Pa, returns T in °C
    const A = 8.89;
    const B = 1168.7;
    const C = -33.15;
    
    const logP = Math.log10(pressure / 1000); // Convert Pa to kPa for log
    return B / (A - logP) + C;
  }
  
  // Default approximation for other refrigerants
  return Math.log(pressure / 101325) * 25 + 0;
}

// Simplified saturation pressure calculation
export function saturationPressure(temperature: number, fluid: string): number {
  if (fluid === 'R134a') {
    // Simplified Antoine equation for R134a
    const A = 8.89;
    const B = 1168.7;
    const C = -33.15;
    
    const logP = A - B / (temperature + C);
    return Math.pow(10, logP) * 1000; // Return in Pa
  }
  
  // Default approximation
  return 101325 * Math.exp((temperature - 0) / 25);
}

export function calculateChillerPerformance(inputs: ChillerInputs): ComparisonResults {
  // Calculate saturation temperatures from pressures
  const actualEvapTemp = saturationTemperature(inputs.evapPressure * 1000, inputs.refrigerant);
  const actualCondTemp = saturationTemperature(inputs.condPressure * 1000, inputs.refrigerant);
  
  // OEM Cycle (baseline from datasheet)
  const oemEvapTemp = 7.0; // Standard evap temp
  const oemCondTemp = 45.0; // Standard cond temp at 35°C ambient
  const oemPressureRatio = saturationPressure(oemCondTemp, inputs.refrigerant) / 
                          saturationPressure(oemEvapTemp, inputs.refrigerant);
  
  const oemResults: CycleResults = {
    cop: inputs.oemCOP,
    power: inputs.oemCapacity / inputs.oemCOP,
    capacity: inputs.oemCapacity,
    evapTemp: oemEvapTemp,
    condTemp: oemCondTemp,
    pressureRatio: oemPressureRatio,
    energySavings: 0, // Baseline
    cyclePoints: generateCyclePoints(oemEvapTemp, oemCondTemp, 5, 5, inputs.refrigerant)
  };

  // Actual Cycle (from sensor data)
  // Apply business logic: hardcoded COP of 2.6 (-9.4% vs OEM)
  const actualCOP = 2.6;
  const actualPowerIncrease = -10.38; // Negative indicates increased power consumption
  
  const actualResults: CycleResults = {
    cop: actualCOP,
    power: inputs.oemCapacity / actualCOP,
    capacity: inputs.oemCapacity,
    evapTemp: actualEvapTemp,
    condTemp: actualCondTemp,
    pressureRatio: inputs.condPressure / inputs.evapPressure,
    energySavings: actualPowerIncrease,
    cyclePoints: generateCyclePoints(actualEvapTemp, actualCondTemp, inputs.superheat, inputs.subcooling, inputs.refrigerant)
  };

  // Optimized Cycle (WBT + approach method)
  const optimizedCondTemp = inputs.ambientWBT + inputs.condApproach;
  const optimizedCOP = 4.3; // Hardcoded as per Python logic
  const optimizedSavings = 28.06; // Savings vs actual cycle
  
  const optimizedResults: CycleResults = {
    cop: optimizedCOP,
    power: inputs.oemCapacity / optimizedCOP,
    capacity: inputs.oemCapacity,
    evapTemp: actualEvapTemp, // Keep same evap temp as actual
    condTemp: optimizedCondTemp,
    pressureRatio: saturationPressure(optimizedCondTemp, inputs.refrigerant) / 
                   saturationPressure(actualEvapTemp, inputs.refrigerant),
    energySavings: optimizedSavings,
    cyclePoints: generateCyclePoints(actualEvapTemp, optimizedCondTemp, inputs.superheat, inputs.subcooling, inputs.refrigerant)
  };

  // Generate recommendations
  const recommendations = generateRecommendations(inputs, actualResults, optimizedResults);
  
  return {
    oem: oemResults,
    actual: actualResults,
    optimized: optimizedResults,
    degradationZone: actualResults.cop < oemResults.cop,
    recommendations
  };
}

function generateCyclePoints(evapTemp: number, condTemp: number, superheat: number, subcooling: number, refrigerant: string): CyclePoint[] {
  const evapPressure = saturationPressure(evapTemp, refrigerant) / 1000; // Convert to kPa
  const condPressure = saturationPressure(condTemp, refrigerant) / 1000; // Convert to kPa
  
  return [
    {
      id: 1,
      name: "Evaporator Outlet",
      temperature: evapTemp + superheat,
      pressure: evapPressure
    },
    {
      id: 2,
      name: "Compressor Discharge",
      temperature: condTemp + 20, // Estimated discharge temp
      pressure: condPressure
    },
    {
      id: 3,
      name: "Condenser Outlet",
      temperature: condTemp - subcooling,
      pressure: condPressure
    },
    {
      id: 4,
      name: "Expansion Valve Outlet",
      temperature: evapTemp,
      pressure: evapPressure
    }
  ];
}

function generateRecommendations(inputs: ChillerInputs, actual: CycleResults, optimized: CycleResults): string[] {
  const recommendations: string[] = [];
  
  // Primary recommendation based on optimization potential
  if (optimized.energySavings > 10) {
    recommendations.push(
      `Reduce condenser approach temperature to ${inputs.ambientWBT + inputs.condApproach}°C (WBT + ${inputs.condApproach}K) for ${optimized.energySavings.toFixed(1)}% energy savings`
    );
  }
  
  // Performance degradation alert
  if (actual.cop < inputs.oemCOP) {
    const degradation = ((inputs.oemCOP - actual.cop) / inputs.oemCOP * 100).toFixed(1);
    recommendations.push(
      `Current COP is ${degradation}% below OEM specifications - consider maintenance or system optimization`
    );
  }
  
  // Pressure ratio optimization
  if (actual.pressureRatio > 4.0) {
    recommendations.push(
      `High pressure ratio (${actual.pressureRatio.toFixed(2)}) indicates potential for condenser optimization`
    );
  }
  
  // Superheat optimization
  if (inputs.superheat > 10) {
    recommendations.push(
      `Superheat of ${inputs.superheat}K is high - consider optimizing expansion valve control`
    );
  }
  
  // System efficiency factor consideration
  if (inputs.systemEfficiencyFactor < 0.5) {
    recommendations.push(
      `Low system efficiency factor (${inputs.systemEfficiencyFactor}) suggests significant mechanical losses - investigate motor and drive efficiency`
    );
  }
  
  // Implementation notes
  recommendations.push(
    "Maintain evaporator temperature at current levels to preserve cooling capacity"
  );
  
  recommendations.push(
    "Consider variable speed drives for enhanced condenser fan control"
  );
  
  return recommendations;
}

// Utility function to create P-H diagram data
export function createPHDiagramData(results: ComparisonResults) {
  // Simplified P-H diagram traces
  // In production, this would use detailed thermodynamic calculations
  
  const traces = [
    {
      x: [200, 250, 250, 220, 220, 200, 200], // Enthalpy approximation
      y: [results.oem.cyclePoints[0].pressure, results.oem.cyclePoints[1].pressure, 
          results.oem.cyclePoints[1].pressure, results.oem.cyclePoints[2].pressure,
          results.oem.cyclePoints[2].pressure, results.oem.cyclePoints[3].pressure,
          results.oem.cyclePoints[3].pressure],
      mode: 'lines+markers',
      name: 'OEM Cycle',
      line: { color: 'blue' },
      marker: { size: 8 }
    },
    {
      x: [195, 260, 260, 215, 215, 195, 195],
      y: [results.actual.cyclePoints[0].pressure, results.actual.cyclePoints[1].pressure,
          results.actual.cyclePoints[1].pressure, results.actual.cyclePoints[2].pressure,
          results.actual.cyclePoints[2].pressure, results.actual.cyclePoints[3].pressure,
          results.actual.cyclePoints[3].pressure],
      mode: 'lines+markers',
      name: 'Actual Cycle',
      line: { color: 'red' },
      marker: { size: 8 }
    },
    {
      x: [195, 240, 240, 210, 210, 195, 195],
      y: [results.optimized.cyclePoints[0].pressure, results.optimized.cyclePoints[1].pressure,
          results.optimized.cyclePoints[1].pressure, results.optimized.cyclePoints[2].pressure,
          results.optimized.cyclePoints[2].pressure, results.optimized.cyclePoints[3].pressure,
          results.optimized.cyclePoints[3].pressure],
      mode: 'lines+markers',
      name: 'Optimized Cycle',
      line: { color: '#13A913' },
      marker: { size: 8 }
    }
  ];
  
  return traces;
}