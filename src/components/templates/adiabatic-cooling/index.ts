/**
 * 🎨 Adiabatic Cooling Proposal Template - Main Export
 * Professional B2B Engineering Proposal System
 * 
 * A complete modular proposal template system designed for maximum
 * professionalism, print compatibility, and business credibility.
 */

// Main Template Components
export { default as AdiabaticCoolingTemplate } from './AdiabaticCoolingTemplate';
export { default as ReportTemplate } from './ReportTemplate';

// Layout Components
export {
  A4PageContainer,
  ProposalHeader,
  SectionHeader,
  ResponsiveGrid,
  Badge,
  Card,
  ValueDisplay,
  PrintButton
} from './components/Layout';

// Chart Components
export {
  ChartContainer,
  GaugeChart,
  ProfessionalBarChart,
  ProfessionalPieChart,
  ComparisonChart,
  MetricGauges
} from './components/Charts';

// Table Components
export {
  ProfessionalTable,
  ComparisonTable,
  FinancialTable,
  SpecificationTable
} from './components/ProfessionalTable';

// Timeline Components
export {
  ImplementationTimeline,
  ProjectMilestones
} from './components/Timeline';

// Section Components
export { default as ExecutiveSummary } from './components/ExecutiveSummary';

// Utilities
export {
  calculateMetrics,
  calculatePerformanceMetrics,
  calculateFinancialMetrics,
  calculateEnvironmentalMetrics,
  generateFinancialProjections,
  generateChartData,
  formatters,
  validateProposalData,
  ENGINEERING_CONSTANTS
} from './utils/calculations';

// Types
export type {
  AdiabaticCoolingProposalData,
  AdiabaticCoolingTemplateProps,
  ChartDataPoint,
  ComparisonData,
  TimelinePhase,
  FinancialProjection,
  GaugeChartConfig,
  BarChartConfig,
  PieChartConfig,
  CalculatedMetrics,
  PerformanceMetrics,
  FinancialMetrics,
  EnvironmentalMetrics,
  ProfessionalTableProps,
  TableColumn,
  TableRow,
  StatusType,
  ChartType,
  ViewMode,
  ResponsiveConfig
} from './types';

// Constants
export { CHART_COLORS, SEMANTIC_COLORS } from './types';

/**
 * 📋 Usage Example:
 * 
 * ```tsx
 * import { AdiabaticCoolingTemplate } from './adiabatic-cooling';
 * 
 * const proposalData = {
 *   projectName: "Office Complex Cooling Upgrade",
 *   clientName: "ABC Corporation",
 *   currentPower: "150",
 *   expectedSaving: "25",
 *   // ... other required fields
 * };
 * 
 * function MyProposal() {
 *   return (
 *     <AdiabaticCoolingTemplate 
 *       data={proposalData}
 *       viewMode="screen"
 *     />
 *   );
 * }
 * ```
 */

/**
 * 🎯 Key Features:
 * 
 * ✅ Modular component architecture
 * ✅ Professional B2B design language
 * ✅ Print/PDF optimized layouts
 * ✅ Responsive design system
 * ✅ Semantic color coding
 * ✅ Advanced chart visualizations
 * ✅ Comprehensive calculations
 * ✅ TypeScript type safety
 * ✅ Accessibility compliant
 * ✅ Cross-browser compatibility
 */

/**
 * 🏗️ Architecture:
 * 
 * /adiabatic-cooling/
 * ├── AdiabaticCoolingTemplate.tsx     # Main template component
 * ├── components/
 * │   ├── Layout.tsx                   # Base layout components
 * │   ├── Charts.tsx                   # Chart components
 * │   ├── ProfessionalTable.tsx        # Table components
 * │   ├── Timeline.tsx                 # Timeline components
 * │   └── ExecutiveSummary.tsx         # Section components
 * ├── styles/
 * │   ├── design-tokens.css            # Design system variables
 * │   ├── layout.css                   # Layout and grid styles
 * │   └── components.css               # Component-specific styles
 * ├── types/
 * │   └── index.ts                     # TypeScript definitions
 * ├── utils/
 * │   └── calculations.ts              # Business logic and calculations
 * └── index.ts                         # Main export file
 */
