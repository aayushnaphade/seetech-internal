import { ChillerProposalData } from './types';

/**
 * 📝 Sample Data for Chiller Proposal Template
 */
export const sampleChillerData: ChillerProposalData = {
  // Project Information
  projectName: "High-Efficiency Chiller Optimization Project",
  proposalNumber: "SEE-CHL-2025-001",
  date: "2025-01-15",
  
  // Client Information
  clientName: "Metropolitan Office Complex",
  location: "Downtown Business District, New York",
  contactPerson: "John Mitchell",
  contactEmail: "j.mitchell@metrocomplex.com",
  contactPhone: "+1 (555) 123-4567",
  
  // System Specifications
  systemCapacity: "500 TR",
  currentEfficiency: "0.85 kW/TR",
  proposedEfficiency: "0.62 kW/TR",
  expectedSaving: "27%",
  
  // Financial Details
  investmentCost: "$245,000",
  paybackPeriod: "2.1 years",
  roi: "42%",
  
  // System Details
  operatingHours: "8760 hours/year",
  currentPowerConsumption: "425 kW",
  proposedPowerConsumption: "310 kW",
  
  // P-H Chart Parameters (exactly matching chiller-analyzer tool)
  refrigerant: "R134a",
  evapPressure: "307.7", // kPa (matching chiller-analyzer units)
  condPressure: "1244.0", // kPa (matching chiller-analyzer units)
  evapTemp: "7.0", // evapEWT from chiller-analyzer
  condTemp: "42.0", // calculated from ambient + approach (35 + 7)
  superheat: "8.6", // exactly from chiller-analyzer
  subcooling: "0.0", // exactly from chiller-analyzer
  ambientTemp: "35.0", // ambientDBT from chiller-analyzer
  ambientDBT: "35.0", // ambientDBT from chiller-analyzer
  relativeHumidity: "60.0", // % from chiller-analyzer
  optimizedCondTemp: "32.0", // with adiabatic cooling (ambient - 3°C)
  compressorEfficiency: "0.85", // exactly from chiller-analyzer
  systemEfficiencyFactor: "0.42", // exactly from chiller-analyzer
  
  // Additional chiller analyzer parameters
  oemCOP: "2.87",
  oemCapacity: "897", // kW
  suctionTemp: "15.6", // °C
  dischargeTemp: "65.0", // °C
  evapLWT: "12.0", // °C
  evapEWT: "7.0", // °C
  condApproach: "7.0", // K
  
  // Optional Features
  features: [
    "Variable Speed Drive (VSD) Integration",
    "Smart Control System with IoT Monitoring",
    "Heat Recovery System",
    "Advanced Refrigerant Management",
    "Predictive Maintenance Capabilities",
    "Energy Performance Monitoring Dashboard"
  ],
  
  technicalSpecs: [
    {
      parameter: "Cooling Capacity",
      current: "500 TR",
      proposed: "500 TR",
      improvement: "Maintained"
    },
    {
      parameter: "Energy Efficiency",
      current: "0.85 kW/TR",
      proposed: "0.62 kW/TR",
      improvement: "+27%"
    },
    {
      parameter: "Power Consumption",
      current: "425 kW",
      proposed: "310 kW",
      improvement: "-115 kW"
    },
    {
      parameter: "Operating Cost",
      current: "$447,000/year",
      proposed: "$326,000/year",
      improvement: "-$121,000/year"
    },
    {
      parameter: "CO₂ Emissions",
      current: "1,843 tons/year",
      proposed: "1,345 tons/year",
      improvement: "-498 tons/year"
    }
  ],
  
  implementationPhases: [
    {
      phase: "Phase 1: Assessment & Design",
      duration: "2 weeks",
      description: "Detailed system analysis and optimization design",
      milestone: "Design approval and equipment specification"
    },
    {
      phase: "Phase 2: Equipment Procurement",
      duration: "4 weeks",
      description: "Order and receive chiller optimization equipment",
      milestone: "Equipment delivery and pre-installation checks"
    },
    {
      phase: "Phase 3: Installation",
      duration: "3 weeks",
      description: "Install VSD, control systems, and monitoring equipment",
      milestone: "System integration and initial testing"
    },
    {
      phase: "Phase 4: Commissioning",
      duration: "1 week",
      description: "System optimization, testing, and staff training",
      milestone: "Performance verification and handover"
    }
  ]
};
