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

declare module 'react-plotly.js';
