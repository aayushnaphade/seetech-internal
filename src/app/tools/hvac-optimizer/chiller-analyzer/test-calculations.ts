// Test file for chiller calculations
// Run this in browser console to test calculations

import { ChillerInputs } from './types';
import { calculateChillerComparison, saturationTemperature, saturationPressure } from './calculations';

// Test CoolProp integration
export function testCoolPropIntegration() {
  console.log('🧪 Testing CoolProp Integration...');
  
  if (!window.Module || typeof window.Module.PropsSI !== 'function') {
    console.error('❌ CoolProp not loaded!');
    return false;
  }
  
  try {
    // Test basic CoolProp call
    const testTemp = window.Module.PropsSI('T', 'P', 307700, 'Q', 0, 'R134a'); // Pa
    console.log('Direct CoolProp test (307.7 kPa R134a):', {
      tempK: testTemp.toFixed(2),
      tempC: (testTemp - 273.15).toFixed(2)
    });
    
    // Test our wrapper functions
    const satTemp = saturationTemperature(307.7, 'R134a'); // kPa
    const satPress = saturationPressure(7.0, 'R134a'); // °C
    
    console.log('Wrapper function tests:', {
      satTemp: satTemp.toFixed(2) + '°C',
      satPress: satPress.toFixed(2) + ' bar'
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ CoolProp Integration Error:', error);
    return false;
  }
}

// Test function to verify calculations
export function testChillerCalculations() {
  console.log('🧪 Testing Chiller Calculations...');
  
  // Test inputs based on Daikin RWAD900CZ-XS
  const testInputs: ChillerInputs = {
    // OEM Specifications
    oemCOP: 2.87,
    oemCapacity: 897, // kW
    refrigerant: 'R134a',
    
    // Actual Sensor Data (sample values)
    evapPressure: 307.7, // kPa
    condPressure: 1244.0, // kPa
    suctionTemp: 15.6, // °C
    dischargeTemp: 65.0, // °C
    evapLWT: 12.0, // °C
    evapEWT: 7.0, // °C
    condApproach: 7.0, // K
    superheat: 8.6, // K
    subcooling: 0.0, // K
    
    // Environmental Conditions
    ambientDBT: 35.0, // °C
    relativeHumidity: 60.0, // %
    
    // System Parameters
    compressorEfficiency: 0.85,
    systemEfficiencyFactor: 0.42, // Accounts for real-world losses
    
    // Analysis Options
    showIsotherms: false,
    showIsobars: false,
    showQualityLines: false,
    autoScale: true,
    forceLogScale: false
  };

  try {
    const results = calculateChillerComparison(testInputs);
    
    console.log('✅ Calculation Results:');
    console.log('OEM Cycle:', {
      COP: results.oem.cop.toFixed(2),
      Power: results.oem.power.toFixed(1) + ' kW',
      EvapTemp: results.oem.evapTemp.toFixed(1) + '°C',
      CondTemp: results.oem.condTemp.toFixed(1) + '°C'
    });
    
    console.log('Actual Cycle:', {
      COP: results.actual.cop.toFixed(2),
      Power: results.actual.power.toFixed(1) + ' kW',
      EvapTemp: results.actual.evapTemp.toFixed(1) + '°C',
      CondTemp: results.actual.condTemp.toFixed(1) + '°C',
      EnergySavings: results.actual.energySavings.toFixed(1) + '%'
    });
    
    console.log('Optimized Cycle:', {
      COP: results.optimized.cop.toFixed(2),
      Power: results.optimized.power.toFixed(1) + ' kW',
      EvapTemp: results.optimized.evapTemp.toFixed(1) + '°C',
      CondTemp: results.optimized.condTemp.toFixed(1) + '°C',
      EnergySavings: results.optimized.energySavings.toFixed(1) + '%'
    });
    
    console.log('Degradation Zone:', results.degradationZone);
    console.log('Recommendations:', results.recommendations);
    
    return results;
    
  } catch (error) {
    console.error('❌ Calculation Error:', error);
    throw error;
  }
}

// Test individual cycle calculation
export function testSingleCycle() {
  console.log('🧪 Testing Single Cycle Calculation...');
  
  // Test with simple values
  const evapTemp = 7.0; // °C
  const condTemp = 45.0; // °C
  const superheat = 5.0; // K
  const subcooling = 5.0; // K
  const compressorEff = 0.85;
  const capacity = 100; // kW
  const refrigerant = 'R134a';
  
  try {
    // This would need to be imported from calculations.ts
    // const result = calculateSingleCycle(evapTemp, condTemp, superheat, subcooling, compressorEff, capacity, refrigerant, 'Test');
    console.log('Single cycle test would go here...');
    
  } catch (error) {
    console.error('❌ Single Cycle Error:', error);
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testChillerCalculations = testChillerCalculations;
  (window as any).testSingleCycle = testSingleCycle;
  (window as any).testCoolPropIntegration = testCoolPropIntegration;
}