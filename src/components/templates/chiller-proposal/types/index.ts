export interface ChillerProposalData {
  // Project Information
  projectName: string;
  proposalNumber: string;
  date: string;
  
  // Client Information
  clientName: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  
  // System Specifications
  systemCapacity: string;          // e.g., "255 TR"
  currentEfficiency: string;       // e.g., "3.2 kW/TR" 
  proposedEfficiency: string;      // e.g., "2.8 kW/TR"
  expectedSaving: string;          // e.g., "15%" 
  
  // Financial Details
  investmentCost: string;          // e.g., "₹1,00,00,000"
  paybackPeriod: string;           // e.g., "2.5 years"
  roi: string;                     // e.g., "35%"
  
  // System Details
  operatingHours: string;          // e.g., "8760 hours/year"
  currentPowerConsumption: string; // e.g., "816 kW"
  proposedPowerConsumption: string;// e.g., "714 kW"
  
  // P-H Chart Parameters
  refrigerant?: string;            // e.g., "R134a"
  evapPressure?: string;           // e.g., "3.2" (bar)
  condPressure?: string;           // e.g., "12.0" (bar)
  evapTemp?: string;               // e.g., "7" (°C)
  condTemp?: string;               // e.g., "45" (°C)
  superheat?: string;              // e.g., "8.6" (K)
  subcooling?: string;             // e.g., "5.0" (K)
  ambientTemp?: string;            // e.g., "35" (°C)
  optimizedCondTemp?: string;      // e.g., "38" (°C) - with adiabatic cooling
  compressorEfficiency?: string;   // e.g., "0.85"
  
  // Adiabatic Cooling Parameters
  ambientDBT?: string;             // e.g., "42" (°C) - Dry Bulb Temperature
  ambientWBT?: string;             // e.g., "32" (°C) - Wet Bulb Temperature
  currentCondenserTemp?: string;   // e.g., "47.7" (°C) - Current condenser inlet temp
  optimizedCondenserTemp?: string; // e.g., "36.0" (°C) - With adiabatic cooling
  
  // Proven Chiller Analyzer Parameters (from Daikin RWAD900CZ-XS analysis)
  // OEM Specifications
  oemCOP?: string;                 // e.g., "2.87" - OEM Coefficient of Performance
  oemCapacity?: string;            // e.g., "897" - OEM Capacity in kW
  
  // Actual Sensor Data
  suctionTemp?: string;            // e.g., "15.6" (°C) - Actual Suction Temperature
  dischargeTemp?: string;          // e.g., "65.0" (°C) - Actual Discharge Temperature
  evapLWT?: string;                // e.g., "12.0" (°C) - Evaporator Leaving Water Temp
  evapEWT?: string;                // e.g., "7.0" (°C) - Evaporator Entering Water Temp
  
  // Environmental Conditions
  relativeHumidity?: string;       // e.g., "60.0" (%) - Relative Humidity
  condApproach?: string;           // e.g., "7.0" (K) - Condenser Approach Temperature
  
  // System Parameters
  systemEfficiencyFactor?: string; // e.g., "0.42" - System Efficiency Factor for real-world losses
  
  // Optional Features
  features?: string[];
  technicalSpecs?: TechnicalSpec[];
  implementationPhases?: ImplementationPhase[];
}

export interface TechnicalSpec {
  parameter: string;
  current: string;
  proposed: string;
  improvement: string;
}

export interface ImplementationPhase {
  phase: string;
  duration: string;
  description: string;
  milestone: string;
}

export interface CalculatedMetrics {
  annualEnergySaving: number;      // kWh
  annualMonetarySaving: number;    // INR
  co2Reduction: number;            // kg CO2
  lifetimeSavings: number;         // INR over 15 years
  efficiencyImprovement: number;   // percentage
}

export interface ChillerProposalTemplateProps {
  data: ChillerProposalData;
}

export interface PHChartData {
  oemCycle: {
    enthalpy: number[];
    pressure: number[];
    labels: string[];
    cop: number;
  };
  actualCycle: {
    enthalpy: number[];
    pressure: number[];
    labels: string[];
    cop: number;
  };
  optimizedCycle: {
    enthalpy: number[];
    pressure: number[];
    labels: string[];
    cop: number;
  };
  saturationDome: {
    liquidEnthalpy: number[];
    vaporEnthalpy: number[];
    pressure: number[];
    temperatures: number[];
  };
}

declare module 'react-plotly.js';
