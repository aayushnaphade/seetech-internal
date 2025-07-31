// 🏢 Chiller Proposal Template Module
// Professional report-style templates for chiller optimization proposals

export { default as ChillerReportTemplate } from './ChillerReportTemplate';

// Types
export type {
  ChillerProposalData,
  ChillerProposalTemplateProps,
  TechnicalSpec,
  ImplementationPhase,
  CalculatedMetrics
} from './types';

// Components
export {
  MetricCard,
  Section,
  HighlightBox,
  TwoColumnGrid,
  ThreeColumnGrid,
  ProList,
  ValueDisplay
} from './components/Layout';

export { ExecutiveSummary } from './components/ExecutiveSummary';
export { Charts } from './components/Charts';

// New Modular Components
export { default as CoverPage } from './components/CoverPage';
export { PHChart, PHChartSummary } from './components/PHChart';
export { default as ExecutiveSummaryPage } from './components/ExecutiveSummaryPage';
export { MetricsTable } from './components/MetricsTable';
export { default as ProposalForm } from './components/ProposalForm';

// Utilities
export { calculateMetrics, formatters, colors, chartHelpers } from './utils/calculations';

// Sample Data
export { sampleChillerData } from './sample-data';
