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

// Utilities
export { calculateMetrics, formatters, colors, chartHelpers } from './utils/calculations';

// Sample Data
export { sampleChillerData } from './sample-data';
