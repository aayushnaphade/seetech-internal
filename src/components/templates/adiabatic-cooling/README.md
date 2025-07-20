# 🎨 Adiabatic Cooling Proposal Template

A **professional, modular, and print-ready** proposal template system designed specifically for B2B engineering proposals. Built with Next.js, TypeScript, and following a comprehensive design language for maximum business credibility.

## ✨ Key Features

### 🏗️ **Modular Architecture**
- **Component-based design** - Each section is a reusable component
- **Separation of concerns** - Layout, styling, logic, and data are properly separated
- **Easy maintenance** - Update individual components without affecting the whole system
- **Scalable structure** - Add new sections or modify existing ones effortlessly

### 🎯 **Professional Design Language**
- **Corporate color palette** - Deep blues for authority, teal-green for sustainability
- **Typography hierarchy** - Professional font system with Inter and Montserrat
- **Semantic color coding** - Green for positive values, red for costs, blue for neutral data
- **Consistent spacing** - 8px base grid system for visual harmony

### 📄 **Print & PDF Optimized**
- **A4 page layout** - Exact dimensions for professional document printing
- **Print media queries** - Optimized styles for PDF generation
- **Cross-platform compatibility** - Works on Windows, macOS, and Linux
- **Shadow fallbacks** - Border-based styling for print compatibility

### 📊 **Advanced Data Visualization**
- **Professional charts** - Gauge charts, bar charts, comparison charts
- **Semantic coloring** - Automatic color assignment based on data context
- **Responsive design** - Charts adapt to different screen sizes
- **Print-safe rendering** - Charts work in PDF exports

### 🧮 **Comprehensive Calculations**
- **Engineering formulas** - Industry-standard calculations for cooling systems
- **Financial analysis** - ROI, payback period, NPV calculations
- **Environmental impact** - CO₂ reduction and water savings calculations
- **Performance metrics** - COP, EER, efficiency improvements

## 📁 Project Structure

```
adiabatic-cooling/
├── 📄 AdiabaticCoolingTemplate.tsx    # Main template component
├── 🎨 styles/
│   ├── design-tokens.css              # Design system variables
│   ├── layout.css                     # Layout and grid styles
│   └── components.css                 # Component-specific styles
├── 🧩 components/
│   ├── Layout.tsx                     # Base layout components
│   ├── Charts.tsx                     # Chart components
│   ├── ProfessionalTable.tsx          # Table components
│   ├── Timeline.tsx                   # Timeline components
│   └── ExecutiveSummary.tsx           # Section components
├── 🔧 utils/
│   └── calculations.ts                # Business logic and calculations
├── 📝 types/
│   └── index.ts                       # TypeScript definitions
├── 🧪 sample-data.ts                  # Sample data for testing
├── 🖥️ Demo.tsx                        # Interactive demo component
├── 📚 index.ts                        # Main export file
└── 📖 README.md                       # This file
```

## 🚀 Quick Start

### 1. **Import the Template**

```tsx
import { AdiabaticCoolingTemplate } from '@/components/templates/adiabatic-cooling';
```

### 2. **Prepare Your Data**

```tsx
const proposalData = {
  // Project Information
  projectName: "Office Complex Cooling Upgrade",
  clientName: "ABC Corporation",
  location: "Mumbai, Maharashtra",
  date: "2025-01-20",
  proposalNumber: "ST-AC-2025-001",
  engineerName: "Rajesh Kumar, P.E.",
  
  // System Data
  currentPower: "180",           // kW
  expectedSaving: "25",          // %
  systemCapacity: "150",         // TR
  electricityRate: "8.50",       // Rs/kWh
  investmentCost: "3500000",     // Rs
  paybackPeriod: "2.8",          // years
  
  // ... other required fields
};
```

### 3. **Render the Template**

```tsx
function MyProposal() {
  return (
    <AdiabaticCoolingTemplate 
      data={proposalData}
      viewMode="screen"
    />
  );
}
```

### 4. **Generate PDF**

The template includes a built-in print button that triggers the browser's print dialog, which can save as PDF.

## 🎨 Design System

### **Color Palette**

```css
/* Primary Colors */
--color-primary: #0A435C;      /* Deep blue - authority, trust */
--color-secondary: #1D7AA3;    /* Medium blue - highlights */
--color-accent: #2E936E;       /* Teal-green - positive values */
--color-warning: #B23A48;      /* Burgundy-red - negatives */

/* Supporting Colors */
--color-neutral: #F8FAFC;      /* Light backgrounds */
--color-text: #2D3B45;         /* Main text */
--color-muted-text: #64748B;   /* Secondary text */
```

### **Typography**

```css
/* Font Families */
--font-body: 'Inter', sans-serif;       /* Body text */
--font-heading: 'Montserrat', sans-serif; /* Headings */

/* Font Sizes */
--font-size-main-title: 34px;   /* Main proposal title */
--font-size-h2: 22px;           /* Section headers */
--font-size-body: 15px;         /* Body text */
--font-size-small: 13px;        /* Small details */
```

### **Spacing System**

```css
/* 8px Base Grid */
--spacing-small: 8px;
--spacing-medium: 16px;
--spacing-large: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

## 📊 Component Reference

### **Layout Components**

```tsx
// A4 page container
<A4PageContainer viewMode="screen">
  {/* content */}
</A4PageContainer>

// Professional header
<ProposalHeader
  projectName="Project Name"
  clientName="Client Name"
  date="2025-01-20"
  proposalNumber="ST-001"
  engineerName="Engineer Name"
/>

// Section headers with icons
<SectionHeader 
  title="Section Title"
  subtitle="Section description"
  icon="⚡"
/>

// Responsive grid system
<ResponsiveGrid columns={2}>
  <Card title="Card 1">Content 1</Card>
  <Card title="Card 2">Content 2</Card>
</ResponsiveGrid>
```

### **Chart Components**

```tsx
// Gauge chart for performance metrics
<GaugeChart
  value={75}
  maxValue={100}
  title="Efficiency"
  unit="%"
  colorScheme="efficiency"
/>

// Before/after comparison
<ComparisonChart
  currentValue={180}
  proposedValue={130}
  title="Power Consumption"
  unit="kW"
  improvementPercentage={28}
/>

// Professional bar chart
<ProfessionalBarChart
  data={chartData}
  title="Energy Consumption"
  xAxisLabel="Month"
  yAxisLabel="kWh"
  colorMapping={{
    positive: '#2E936E',
    negative: '#B23A48',
    neutral: '#1D7AA3'
  }}
/>
```

### **Table Components**

```tsx
// Professional data table
<ProfessionalTable
  columns={[
    { header: 'Parameter', key: 'param', type: 'text' },
    { header: 'Value', key: 'value', type: 'number' },
    { header: 'Cost', key: 'cost', type: 'currency' }
  ]}
  data={tableData}
  title="System Specifications"
/>

// Before/after comparison table
<ComparisonTable
  data={[
    {
      metric: "Power Consumption",
      current: 180,
      proposed: 130,
      improvement: 28,
      unit: "kW"
    }
  ]}
/>

// Financial projections
<FinancialTable
  data={projectionData}
  title="10-Year Financial Impact"
/>
```

### **Timeline Components**

```tsx
// Implementation timeline
<ImplementationTimeline
  phases={[
    {
      phase: 1,
      title: "Site Assessment",
      description: "Detailed site survey and analysis",
      duration: "2-3 weeks",
      status: "upcoming"
    }
  ]}
  totalDuration="8-10 weeks"
/>

// Project milestones
<ProjectMilestones
  milestones={[
    {
      title: "Design Approval",
      date: "Week 3",
      status: "upcoming",
      description: "Final design approval and sign-off"
    }
  ]}
/>
```

## 🧮 Calculations & Utilities

### **Engineering Calculations**

```tsx
import { 
  calculateMetrics,
  calculateFinancialMetrics,
  calculateEnvironmentalMetrics,
  formatters
} from '@/components/templates/adiabatic-cooling';

// Calculate all system metrics
const metrics = calculateMetrics(proposalData);
console.log(metrics.annualEnergySaving); // kWh/year
console.log(metrics.annualMonetarySaving); // Rs/year

// Format values for display
const formattedCost = formatters.currency(1500000); // "₹15,00,000"
const formattedEnergy = formatters.energy(15000); // "15.0 MWh"
const formattedCO2 = formatters.co2(2500); // "2.5 tons"
```

### **Data Validation**

```tsx
import { validateProposalData } from '@/components/templates/adiabatic-cooling';

const errors = validateProposalData(proposalData);
if (errors.length > 0) {
  console.log('Validation errors:', errors);
}
```

## 🎯 Business Benefits

### **For Sales Teams**
- **Professional presentation** - Builds client confidence and trust
- **Consistent branding** - Every proposal follows the same high standards
- **Quick generation** - Create proposals in minutes, not hours
- **Print-ready output** - Perfect for client meetings and presentations

### **For Engineers**
- **Accurate calculations** - Industry-standard formulas and constants
- **Comprehensive analysis** - Financial, technical, and environmental metrics
- **Easy customization** - Modify calculations without touching UI code
- **Type safety** - TypeScript prevents calculation errors

### **For Management**
- **Scalable system** - Add new proposal types easily
- **Maintainable code** - Modular architecture for long-term sustainability
- **Quality assurance** - Consistent output across all proposals
- **Cost effective** - Reduces proposal preparation time significantly

## 🔧 Customization

### **Adding New Sections**

1. Create a new component in `components/`
2. Add required types to `types/index.ts`
3. Import and use in `AdiabaticCoolingTemplate.tsx`

```tsx
// components/NewSection.tsx
export const NewSection: React.FC<NewSectionProps> = ({ data }) => {
  return (
    <section>
      <SectionHeader title="New Section" />
      {/* section content */}
    </section>
  );
};
```

### **Modifying Calculations**

Update `utils/calculations.ts` to add new formulas:

```tsx
export function calculateNewMetric(data: ProposalData): number {
  // Your calculation logic
  return result;
}
```

### **Styling Changes**

Modify design tokens in `styles/design-tokens.css`:

```css
:root {
  --color-primary: #your-new-color;
  --font-size-h1: your-new-size;
}
```

## 🧪 Testing

### **Demo Component**

Use the included demo component for testing:

```tsx
import { AdiabaticCoolingDemo } from '@/components/templates/adiabatic-cooling/Demo';

// Renders interactive demo with sample data
<AdiabaticCoolingDemo />
```

### **Sample Data**

Three sample datasets are provided:

```tsx
import { 
  sampleProposalData,     // Office complex
  sampleProposalData2,    // Manufacturing facility  
  sampleProposalData3     // Hospital HVAC
} from '@/components/templates/adiabatic-cooling/sample-data';
```

## 📱 Browser Support

- **Chrome/Edge** - Full support with all features
- **Firefox** - Full support with all features
- **Safari** - Full support with some shadow limitations
- **Mobile browsers** - Responsive design works on all devices
- **Print/PDF** - Optimized for all major PDF generators

## 🚀 Performance

- **Bundle size** - Optimized with dynamic imports
- **Render speed** - Efficient React components
- **Print speed** - Fast PDF generation
- **Memory usage** - Minimal memory footprint

## 📈 Future Enhancements

- **More chart types** - Additional visualization options
- **Template variants** - Different proposal layouts
- **Data export** - Excel/CSV export capabilities
- **Email integration** - Direct email sending
- **Cloud storage** - Save and retrieve proposals

## 🤝 Contributing

1. Follow the established component structure
2. Add TypeScript types for all new features
3. Include print/PDF optimizations
4. Test on multiple browsers
5. Update documentation

## 📄 License

This template system is proprietary to SeeTech Engineering Solutions.

---

**Built with ❤️ by the SeeTech Engineering Team**

*Professional B2B proposals that win business and build trust.*
