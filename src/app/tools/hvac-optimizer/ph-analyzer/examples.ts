// Example data and presets for P-H Analyzer

import { PHAnalyzerInputs } from './types';

// Example refrigeration cycle configurations
export const exampleCycles: Record<string, PHAnalyzerInputs> = {
  // Typical air conditioning system
  airConditioning: {
    refrigerant: 'R410A',
    systemType: 'cooling',
    evaporatorTemp: 7,     // °C (typical evaporator temp for AC)
    condenserTemp: 45,     // °C (typical condenser temp for AC)
    subcooling: 5,         // K
    superheating: 5,       // K
    coolingCapacity: 10.5, // kW (3 TR)
    compressorEfficiency: 0.85,
    enableSubcooling: true,
    enableSuperheating: true,
  },

  // Domestic heat pump
  heatPump: {
    refrigerant: 'R134a',
    systemType: 'heat_pump',
    evaporatorTemp: 2,     // °C (outdoor coil in winter)
    condenserTemp: 50,     // °C (indoor coil)
    subcooling: 3,         // K
    superheating: 7,       // K
    coolingCapacity: 8,    // kW
    compressorEfficiency: 0.80,
    enableSubcooling: true,
    enableSuperheating: true,
  },

  // Commercial refrigeration
  refrigeration: {
    refrigerant: 'R134a',
    systemType: 'refrigeration',
    evaporatorTemp: -10,   // °C (typical freezer temp)
    condenserTemp: 40,     // °C
    subcooling: 4,         // K
    superheating: 6,       // K
    coolingCapacity: 25,   // kW
    compressorEfficiency: 0.82,
    enableSubcooling: true,
    enableSuperheating: true,
  },

  // Industrial chiller
  industrialChiller: {
    refrigerant: 'R134a',
    systemType: 'cooling',
    evaporatorTemp: 5,     // °C
    condenserTemp: 35,     // °C (optimized condenser temp)
    subcooling: 6,         // K
    superheating: 4,       // K
    coolingCapacity: 350,  // kW (100 TR)
    compressorEfficiency: 0.88,
    enableSubcooling: true,
    enableSuperheating: true,
  },

  // CO2 transcritical system
  co2System: {
    refrigerant: 'R744',
    systemType: 'refrigeration',
    evaporatorTemp: -5,    // °C
    condenserTemp: 35,     // °C (gas cooler for transcritical)
    subcooling: 0,         // K (not applicable for transcritical)
    superheating: 10,      // K
    coolingCapacity: 50,   // kW
    compressorEfficiency: 0.75,
    enableSubcooling: false,
    enableSuperheating: true,
  },

  // Low temperature refrigeration
  lowTempRefrig: {
    refrigerant: 'R290',
    systemType: 'refrigeration',
    evaporatorTemp: -25,   // °C (deep freeze)
    condenserTemp: 45,     // °C
    subcooling: 5,         // K
    superheating: 8,       // K
    coolingCapacity: 15,   // kW
    compressorEfficiency: 0.78,
    enableSubcooling: true,
    enableSuperheating: true,
  }
};

// Typical operating ranges for different refrigerants
export const refrigerantRanges = {
  'R134a': {
    minEvapTemp: -40,   // °C
    maxEvapTemp: 15,    // °C
    minCondTemp: 20,    // °C
    maxCondTemp: 60,    // °C
    typicalSubcooling: 5,
    typicalSuperheating: 5,
    typicalEfficiency: 0.85
  },
  'R410A': {
    minEvapTemp: -35,
    maxEvapTemp: 20,
    minCondTemp: 25,
    maxCondTemp: 65,
    typicalSubcooling: 4,
    typicalSuperheating: 6,
    typicalEfficiency: 0.87
  },
  'R22': {
    minEvapTemp: -40,
    maxEvapTemp: 15,
    minCondTemp: 20,
    maxCondTemp: 55,
    typicalSubcooling: 6,
    typicalSuperheating: 7,
    typicalEfficiency: 0.83
  },
  'R290': {
    minEvapTemp: -45,
    maxEvapTemp: 10,
    minCondTemp: 20,
    maxCondTemp: 50,
    typicalSubcooling: 4,
    typicalSuperheating: 8,
    typicalEfficiency: 0.88
  },
  'R744': {
    minEvapTemp: -50,
    maxEvapTemp: 5,
    minCondTemp: 25,
    maxCondTemp: 40,  // Transcritical above ~31°C
    typicalSubcooling: 0,   // Not applicable for transcritical
    typicalSuperheating: 10,
    typicalEfficiency: 0.75
  }
};

// Performance benchmarks
export const performanceBenchmarks = {
  cop: {
    excellent: { cooling: 5.0, heating: 4.5 },
    good: { cooling: 4.0, heating: 3.5 },
    average: { cooling: 3.0, heating: 2.8 },
    poor: { cooling: 2.0, heating: 2.0 }
  },
  eer: {
    excellent: 17.1,  // EER > 17
    good: 13.7,       // EER 13-17
    average: 10.3,    // EER 10-13
    poor: 6.8         // EER < 10
  },
  efficiency: {
    centrifugal: { min: 0.80, typical: 0.85, max: 0.92 },
    screw: { min: 0.75, typical: 0.82, max: 0.88 },
    reciprocating: { min: 0.70, typical: 0.78, max: 0.85 },
    scroll: { min: 0.75, typical: 0.82, max: 0.88 }
  }
};

// Common calculation validation ranges
export const validationRanges = {
  temperature: {
    min: -60,    // °C
    max: 80      // °C
  },
  pressure: {
    min: 0.1,    // bar
    max: 100     // bar
  },
  efficiency: {
    min: 0.3,    // 30%
    max: 1.0     // 100%
  },
  capacity: {
    min: 0.5,    // kW
    max: 10000   // kW
  }
};

// Application-specific recommendations
export const applicationGuide = {
  'Air Conditioning': {
    recommendedRefrigerants: ['R410A', 'R32', 'R134a'],
    typicalEvapTemp: '7-12°C',
    typicalCondTemp: '35-50°C',
    expectedCOP: '3.5-5.0',
    notes: 'Focus on energy efficiency and comfort. Consider part-load performance.'
  },
  'Heat Pump': {
    recommendedRefrigerants: ['R134a', 'R410A', 'R32'],
    typicalEvapTemp: '-5-10°C',
    typicalCondTemp: '45-60°C',
    expectedCOP: '2.8-4.5',
    notes: 'Performance varies with outdoor temperature. Consider defrost cycle impact.'
  },
  'Commercial Refrigeration': {
    recommendedRefrigerants: ['R134a', 'R404A', 'R290'],
    typicalEvapTemp: '-15-5°C',
    typicalCondTemp: '35-45°C',
    expectedCOP: '2.5-4.0',
    notes: 'Consider food safety temperatures and energy consumption.'
  },
  'Industrial Process': {
    recommendedRefrigerants: ['R134a', 'R290', 'R717'],
    typicalEvapTemp: '-30-15°C',
    typicalCondTemp: '30-55°C',
    expectedCOP: '2.0-4.5',
    notes: 'Application-specific requirements. Consider safety and environmental impact.'
  }
};
