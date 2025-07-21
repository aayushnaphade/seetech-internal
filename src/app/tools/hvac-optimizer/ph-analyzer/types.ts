// Types for P-H Analyzer Tool

export interface CyclePoint {
  id: number;
  name: string;
  temperature: number;  // °C
  pressure: number;     // bar
  enthalpy?: number;    // kJ/kg
  entropy?: number;     // kJ/kg·K
  density?: number;     // kg/m³
  quality?: number;     // -
  phase?: string;       // vapor, liquid, two-phase
}

export interface RefrigerationCycle {
  refrigerant: string;
  points: CyclePoint[];
  massFlowRate: number;  // kg/s
  compressorEfficiency: number; // -
}

export interface CycleResults {
  points: CyclePoint[];
  performance: {
    coolingCapacity: number;      // kW
    heatingCapacity: number;      // kW
    compressorPower: number;      // kW
    cop_cooling: number;          // -
    cop_heating: number;          // -
    eer: number;                  // BTU/Wh
    seer: number;                 // Seasonal EER
    massFlowRate: number;         // kg/s
    volumetricFlowRate: number;   // m³/s at compressor inlet
    compressorDisplacement: number; // m³/s
    refrigerantCharge: number;    // kg (estimated)
    pressureRatio: number;        // -
    isentropicEfficiency: number; // -
    volumetricEfficiency: number; // -
  };
  phDiagramData: {
    enthalpy: number[];
    pressure: number[];
    cycleEnthalpy: number[];
    cyclePressure: number[];
    saturatedLiquidEnthalpy: number[];
    saturatedVaporEnthalpy: number[];
    saturationPressure: number[];
    isotherms: {
      enthalpy: number[][];
      pressure: number[][];
      temperatures: number[];
    };
    isobars: {
      enthalpy: number[][];
      pressure: number[][];
      pressures: number[];
    };
    qualityLines: {
      enthalpy: number[][];
      pressure: number[][];
      qualities: number[];
    };
  };
  processAnalysis: {
    compression: {
      workInput: number;          // kJ/kg
      temperatureRise: number;    // K
      pressureRatio: number;      // -
      process: string;            // "Isentropic" or "Polytropic"
    };
    condensation: {
      heatRejected: number;       // kJ/kg
      subcooling: number;         // K
      approach: number;           // K
      process: string;            // "Constant pressure"
    };
    expansion: {
      pressureDrop: number;       // bar
      throttlingLoss: number;     // kJ/kg
      qualityAfter: number;       // -
      process: string;            // "Isenthalpic"
    };
    evaporation: {
      coolingEffect: number;      // kJ/kg
      superheating: number;       // K
      approach: number;           // K
      process: string;            // "Constant pressure"
    };
  };
}

export interface PHAnalyzerInputs {
  refrigerant: string;
  systemType: 'cooling' | 'heat_pump' | 'refrigeration';
  
  // Cycle points (basic 4-point cycle)
  evaporatorTemp: number;        // °C
  condenserTemp: number;         // °C
  subcooling: number;            // K
  superheating: number;          // K
  
  // System parameters
  coolingCapacity: number;       // kW (for sizing)
  compressorEfficiency: number;  // isentropic efficiency
  volumetricEfficiency: number;  // volumetric efficiency
  
  // Environmental conditions
  ambientTemp: number;           // °C
  indoorTemp: number;            // °C
  
  // Advanced options
  intermediateP?: number;        // bar (for advanced cycles)
  enableSubcooling: boolean;
  enableSuperheating: boolean;
  enableOptimization: boolean;   // Auto-optimize cycle
  
  // Analysis options
  showIsotherms: boolean;
  showIsobars: boolean;
  showQualityLines: boolean;
  detailedAnalysis: boolean;
  
  // Diagram scaling options
  autoScale: boolean;            // Auto-scale axes to cycle data
  forceLogScale: boolean;        // Force logarithmic pressure scale
  customPressureRange?: {        // Manual pressure axis range
    min: number;
    max: number;
  };
  customEnthalpyRange?: {        // Manual enthalpy axis range
    min: number;
    max: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CalculationState {
  isCalculating: boolean;
  error: string | null;
  results: CycleResults | null;
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

// Common refrigerants with properties
export const REFRIGERANTS = [
  { value: 'R134a', label: 'R-134a (Tetrafluoroethane)', common: true },
  { value: 'R410A', label: 'R-410A (AZ-20)', common: true },
  { value: 'R22', label: 'R-22 (Chlorodifluoromethane)', common: false },
  { value: 'R32', label: 'R-32 (Difluoromethane)', common: true },
  { value: 'R290', label: 'R-290 (Propane)', common: true },
  { value: 'R600a', label: 'R-600a (Isobutane)', common: true },
  { value: 'R717', label: 'R-717 (Ammonia)', common: true },
  { value: 'R744', label: 'R-744 (Carbon Dioxide)', common: true },
  { value: 'R1234yf', label: 'R-1234yf (HFO)', common: true },
  { value: 'R1234ze', label: 'R-1234ze (HFO)', common: true },
] as const;

export const SYSTEM_TYPES = [
  { value: 'cooling', label: 'Air Conditioning / Cooling' },
  { value: 'heat_pump', label: 'Heat Pump' },
  { value: 'refrigeration', label: 'Refrigeration' },
] as const;
