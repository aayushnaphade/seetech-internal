/**
 * 🎯 Adiabatic Cooling Proposal Template Type Definitions
 * Professional B2B Engineering Proposal System
 */

export interface AdiabaticCoolingProposalData {
  // 🏢 Project Information
  projectName: string;
  clientName: string;
  location: string;
  date: string;
  proposalNumber: string;
  engineerName: string;
  
  // 👤 Contact Information
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  
  // ⚡ Current System Data
  currentPower: string;              // kW
  currentEfficiency: string;         // %
  currentOperatingCost: string;      // Annual cost
  electricityRate: string;           // Rs/kWh
  
  // 🎯 Proposed System Data
  expectedSaving: string;            // % improvement
  proposedEfficiency: string;        // %
  systemCapacity: string;            // TR (Tons of Refrigeration)
  chillerType: string;               // Type of chiller system
  
  // 💰 Financial Data
  investmentCost: string;            // Total investment
  paybackPeriod: string;             // Years
  roi: string;                       // %
  
  // 🌍 Environmental Data
  co2Reduction: string;              // kg CO2/year
  waterSaving: string;               // Liters/year
  
  // 📋 Technical Specifications
  ambientTemperature: string;        // °C
  chillWaterTemperature: string;     // °C
  wetBulbTemperature: string;        // °C
  humidity: string;                  // %
  
  // 📊 Operational Parameters
  operatingHours: string;            // Hours/day
  operatingDays: string;             // Days/year
  loadFactor: string;                // %
}

// 📈 Chart Data Interfaces
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  unit?: string;
}

export interface ComparisonData {
  current: number;
  proposed: number;
  improvement: number;
  unit: string;
  label: string;
}

export interface TimelinePhase {
  phase: number;
  title: string;
  description: string;
  duration: string;
  status?: 'upcoming' | 'in-progress' | 'completed';
}

export interface FinancialProjection {
  year: number;
  savings: number;
  cumulativeSavings: number;
  investment: number;
  netBenefit: number;
}

// 🎨 Chart Configuration Types
export interface GaugeChartConfig {
  value: number;
  maxValue: number;
  title: string;
  unit: string;
  colorScheme: 'efficiency' | 'savings' | 'performance';
  reference?: number;
  changeValue?: number;
}

export interface BarChartConfig {
  data: ChartDataPoint[];
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  colorMapping: {
    positive: string;
    negative: string;
    neutral: string;
  };
}

export interface PieChartConfig {
  data: ChartDataPoint[];
  title: string;
  showLegend: boolean;
  colors: string[];
}

// 🏗️ Component Props Interfaces
export interface ProposalHeaderProps {
  projectName: string;
  clientName: string;
  date: string;
  proposalNumber: string;
  engineerName: string;
}

export interface ExecutiveSummaryProps {
  data: AdiabaticCoolingProposalData;
  calculations: CalculatedMetrics;
}

export interface TechnicalAnalysisProps {
  data: AdiabaticCoolingProposalData;
  performanceMetrics: PerformanceMetrics;
}

export interface FinancialAnalysisProps {
  data: AdiabaticCoolingProposalData;
  financialMetrics: FinancialMetrics;
  projections: FinancialProjection[];
}

export interface EnvironmentalImpactProps {
  data: AdiabaticCoolingProposalData;
  environmentalMetrics: EnvironmentalMetrics;
}

export interface ImplementationTimelineProps {
  phases: TimelinePhase[];
  totalDuration: string;
}

// 📊 Calculated Metrics Interfaces
export interface CalculatedMetrics {
  // Power calculations
  beforePowerKW: number;
  afterPowerKW: number;
  savingKW: number;
  
  // Energy calculations
  annualEnergySaving: number;        // kWh/year
  annualMonetarySaving: number;      // Rs/year
  
  // Water calculations
  waterUsageReduction: number;       // L/hour
  annualWaterSaving: number;         // L/year
  
  // Efficiency metrics
  currentCOP: number;
  proposedCOP: number;
  efficiencyImprovement: number;     // %
}

export interface PerformanceMetrics {
  coolingCapacity: number;           // TR
  energyEfficiencyRatio: number;     // EER
  coefficientOfPerformance: number;  // COP
  partLoadPerformance: number;       // %
  temperatureApproach: number;       // °C
  wetBulbApproach: number;          // °C
}

export interface FinancialMetrics {
  totalInvestment: number;           // Rs
  annualSavings: number;            // Rs/year
  paybackPeriod: number;            // Years
  netPresentValue: number;          // Rs
  internalRateOfReturn: number;     // %
  costPerTonSaved: number;          // Rs/TR
}

export interface EnvironmentalMetrics {
  co2ReductionAnnual: number;       // kg CO2/year
  co2ReductionLifetime: number;     // kg CO2 over 20 years
  waterSavingAnnual: number;        // L/year
  waterSavingLifetime: number;      // L over 20 years
  equivalentTreesPlanted: number;   // Number of trees
  carbonFootprintReduction: number; // %
}

// 🎨 Styling and Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  warning: string;
  neutral: string;
  text: string;
  mutedText: string;
}

export interface ComponentStyle {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

// 📋 Table Data Types
export interface TableColumn {
  header: string;
  key: string;
  type: 'text' | 'number' | 'currency' | 'percentage';
  align?: 'left' | 'center' | 'right';
  format?: string;
}

export interface TableRow {
  [key: string]: string | number;
}

export interface ProfessionalTableProps {
  columns: TableColumn[];
  data: TableRow[];
  title?: string;
  subtitle?: string;
  className?: string;
}

// 🔧 Utility Types
export type StatusType = 'positive' | 'negative' | 'neutral' | 'warning';
export type ChartType = 'gauge' | 'bar' | 'pie' | 'line' | 'comparison';
export type ViewMode = 'screen' | 'print' | 'pdf';

// 📱 Responsive Types
export interface ResponsiveConfig {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  print: boolean;
}

// 🎯 Main Template Props
export interface AdiabaticCoolingTemplateProps {
  data: AdiabaticCoolingProposalData;
  viewMode?: ViewMode;
  className?: string;
  onDataChange?: (data: AdiabaticCoolingProposalData) => void;
}

// 📊 Chart Color Mapping
export const CHART_COLORS = {
  savings_positive: '#2E936E',
  costs_negative: '#B23A48',
  technical_data: '#1D7AA3',
  attention: '#F68D60',
  neutral_bg: '#F8FAFC',
  light_accent: '#7CDBD5',
  primary: '#0A435C',
  secondary: '#1D7AA3'
} as const;

// 🎨 Semantic Color Mapping
export const SEMANTIC_COLORS = {
  positive: CHART_COLORS.savings_positive,
  negative: CHART_COLORS.costs_negative,
  neutral: CHART_COLORS.technical_data,
  highlight: CHART_COLORS.attention
} as const;
