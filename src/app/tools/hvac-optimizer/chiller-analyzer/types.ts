// Types for Chiller Performance Analyzer

export interface ChillerInputs {
  // OEM Specifications (from datasheet)
  oemCOP: number;
  oemCapacity: number; // kW
  refrigerant: string;
  
  // Actual Sensor Data
  evapPressure: number; // kPa
  condPressure: number; // kPa
  suctionTemp: number; // °C
  dischargeTemp: number; // °C
  evapLWT: number; // °C (Leaving Water Temperature)
  evapEWT: number; // °C (Entering Water Temperature)
  condApproach: number; // K
  superheat: number; // K
  subcooling: number; // K
  
  // Environmental Conditions
  ambientDBT: number; // °C (Dry Bulb Temperature)
  relativeHumidity: number; // % (Relative Humidity)
  
  // System Parameters
  compressorEfficiency: number; // Isentropic efficiency
  systemEfficiencyFactor: number; // Real-world losses factor
  
  // Analysis Options
  showIsotherms: boolean;
  showIsobars: boolean;
  showQualityLines: boolean;
  autoScale: boolean;
  forceLogScale: boolean;
}

export interface CyclePoint {
  id: number;
  name: string;
  temperature: number; // °C
  pressure: number; // bar
  enthalpy?: number; // kJ/kg
  entropy?: number; // kJ/kg·K
  density?: number; // kg/m³
  quality?: number; // -
  phase?: string; // vapor, liquid, two-phase
}

export interface CycleResults {
  name: string; // OEM, Actual, Optimized
  cop: number;
  power: number; // kW
  capacity: number; // kW
  evapTemp: number; // °C
  condTemp: number; // °C
  pressureRatio: number;
  energySavings: number; // % vs reference
  points: CyclePoint[];
  performance: {
    coolingCapacity: number; // kW
    heatingCapacity: number; // kW
    compressorPower: number; // kW
    cop_cooling: number;
    cop_heating: number;
    massFlowRate: number; // kg/s
    volumetricFlowRate: number; // m³/s
    pressureRatio: number;
    isentropicEfficiency: number;
    volumetricEfficiency: number;
  };
}

export interface ChillerResults {
  oem: CycleResults;
  actual: CycleResults;
  optimized: CycleResults;
  degradationZone: boolean;
  recommendations: string[];
  phDiagramData: {
    enthalpy: number[];
    pressure: number[];
    saturatedLiquidEnthalpy: number[];
    saturatedVaporEnthalpy: number[];
    saturationPressure: number[];
    cycleEnthalpy: number[];
    cyclePressure: number[];
    oemCycle: {
      enthalpy: number[];
      pressure: number[];
    };
    actualCycle: {
      enthalpy: number[];
      pressure: number[];
    };
    optimizedCycle: {
      enthalpy: number[];
      pressure: number[];
    };
    isotherms?: {
      enthalpy: number[][];
      pressure: number[][];
      temperatures: number[];
    };
    isobars?: {
      enthalpy: number[][];
      pressure: number[][];
      pressures: number[];
    };
    qualityLines?: {
      enthalpy: number[][];
      pressure: number[][];
      qualities: number[];
    };
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CalculationState {
  isCalculating: boolean;
  error: string | null;
  results: ChillerResults | null;
}

export interface PlotData {
  x: number[];
  y: number[];
  mode?: string;
  type?: string;
  name?: string;
  line?: {
    color?: string;
    width?: number;
    dash?: string;
  };
  marker?: {
    color?: string;
    size?: number;
    symbol?: string;
  };
  showlegend?: boolean;
  hovertemplate?: string;
}

export interface PlotLayout {
  title?: string | {
    text?: string;
    font?: {
      size?: number;
      color?: string;
      family?: string;
    };
  };
  xaxis?: {
    title?: string | {
      text?: string;
      font?: {
        size?: number;
        color?: string;
      };
    };
    range?: number[];
    type?: string;
    showgrid?: boolean;
    gridcolor?: string;
    tickfont?: {
      size?: number;
      color?: string;
    };
  };
  yaxis?: {
    title?: string | {
      text?: string;
      font?: {
        size?: number;
        color?: string;
      };
    };
    range?: number[];
    type?: string;
    showgrid?: boolean;
    gridcolor?: string;
    tickfont?: {
      size?: number;
      color?: string;
    };
  };
  showlegend?: boolean;
  hovermode?: string;
  margin?: {
    l?: number;
    r?: number;
    t?: number;
    b?: number;
  };
  font?: {
    family?: string;
    size?: number;
    color?: string;
  };
  plot_bgcolor?: string;
  paper_bgcolor?: string;
}

// Common refrigerants for chillers
export const CHILLER_REFRIGERANTS = [
  { value: 'R134a', label: 'R-134a (Most Common)', common: true },
  { value: 'R410A', label: 'R-410A', common: true },
  { value: 'R32', label: 'R-32', common: true },
  { value: 'R1234yf', label: 'R-1234yf (Low GWP)', common: true },
  { value: 'R1234ze', label: 'R-1234ze (Low GWP)', common: true },
  { value: 'R717', label: 'R-717 (Ammonia)', common: false },
  { value: 'R744', label: 'R-744 (CO2)', common: false },
] as const;

// Default values based on Daikin RWAD900CZ-XS
export const DEFAULT_CHILLER_INPUTS: ChillerInputs = {
  // OEM Specifications
  oemCOP: 2.87,
  oemCapacity: 897, // kW
  refrigerant: 'R134a',
  
  // Actual Sensor Data (sample values)
  evapPressure: 307.7, // kPa
  condPressure: 1244.0, // kPa
  suctionTemp: 15.6, // °C (7°C evap + 8.6K superheat)
  dischargeTemp: 65.0, // °C
  evapLWT: 12.0, // °C
  evapEWT: 7.0, // °C
  condApproach: 7.0, // K
  superheat: 8.6, // K
  subcooling: 0.0, // K
  
  // Environmental Conditions
  ambientDBT: 35.0, // °C
  relativeHumidity: 60.0, // % (typical outdoor humidity)
  
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