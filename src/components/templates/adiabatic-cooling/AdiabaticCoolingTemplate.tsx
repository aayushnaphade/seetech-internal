"use client";

import React from 'react';
import { AdiabaticCoolingTemplateProps, TimelinePhase } from './types';
import { 
  calculateMetrics, 
  calculatePerformanceMetrics, 
  calculateFinancialMetrics, 
  calculateEnvironmentalMetrics,
  generateFinancialProjections,
  generateChartData,
  formatters
} from './utils/calculations';

// Layout Components
import { 
  A4PageContainer, 
  ProposalHeader, 
  SectionHeader, 
  PrintButton 
} from './components/Layout';

// Section Components
import ExecutiveSummary from './components/ExecutiveSummary';

// Chart Components
import { 
  GaugeChart, 
  ComparisonChart, 
  ProfessionalBarChart, 
  MetricGauges 
} from './components/Charts';

// Table Components
import { 
  ComparisonTable, 
  FinancialTable, 
  SpecificationTable 
} from './components/ProfessionalTable';

// Timeline Components
import { 
  ImplementationTimeline, 
  ProjectMilestones 
} from './components/Timeline';

/**
 * 🎨 Adiabatic Cooling Proposal Template
 * Professional B2B Engineering Proposal System
 * Modular, Print-Ready, Responsive Design
 */
export const AdiabaticCoolingTemplate: React.FC<AdiabaticCoolingTemplateProps> = ({
  data,
  viewMode = 'screen',
  className = '',
  onDataChange
}) => {
  // Calculate all metrics
  const calculatedMetrics = calculateMetrics(data);
  const performanceMetrics = calculatePerformanceMetrics(data);
  const financialMetrics = calculateFinancialMetrics(data, calculatedMetrics);
  const environmentalMetrics = calculateEnvironmentalMetrics(calculatedMetrics);
  const projections = generateFinancialProjections(financialMetrics, 10);
  const chartData = generateChartData(calculatedMetrics, financialMetrics, environmentalMetrics);

  // Sample timeline data
  const timelinePhases: TimelinePhase[] = [
    {
      phase: 1,
      title: "Site Assessment & Engineering",
      description: "Detailed site survey, load analysis, and engineering design",
      duration: "2-3 weeks",
      status: "upcoming"
    },
    {
      phase: 2,
      title: "System Procurement",
      description: "Equipment procurement and pre-installation preparation",
      duration: "3-4 weeks",
      status: "upcoming"
    },
    {
      phase: 3,
      title: "Installation & Integration",
      description: "System installation, integration, and initial testing",
      duration: "1-2 weeks",
      status: "upcoming"
    },
    {
      phase: 4,
      title: "Commissioning & Training",
      description: "System commissioning, performance validation, and operator training",
      duration: "1 week",
      status: "upcoming"
    }
  ];

  const projectMilestones = [
    {
      title: "Project Kick-off",
      date: "Week 1",
      status: "upcoming" as const,
      description: "Initial project meeting and site assessment scheduling"
    },
    {
      title: "Design Approval",
      date: "Week 3",
      status: "upcoming" as const,
      description: "Final engineering design approval and procurement authorization"
    },
    {
      title: "Installation Complete",
      date: "Week 8",
      status: "upcoming" as const,
      description: "Physical installation and integration completed"
    },
    {
      title: "System Go-Live",
      date: "Week 10",
      status: "upcoming" as const,
      description: "Full system commissioning and performance validation"
    }
  ];

  return (
    <>
      {viewMode === 'screen' && <PrintButton />}
      
      <A4PageContainer viewMode={viewMode} className={className}>
        {/* Header Section */}
        <ProposalHeader
          projectName={data.projectName}
          clientName={data.clientName}
          date={data.date}
          proposalNumber={data.proposalNumber}
          engineerName={data.engineerName}
        />

        {/* Executive Summary */}
        <ExecutiveSummary
          data={data}
          calculatedMetrics={calculatedMetrics}
        />

        {/* Current System Analysis */}
        <section style={{ marginTop: 'var(--spacing-xxl)' }}>
          <SectionHeader 
            title="Current System Analysis"
            subtitle="Comprehensive assessment of existing cooling infrastructure"
            icon="🔍"
          />
          
          <div className="responsive-grid">
            <div className="grid-item">
              <GaugeChart
                value={parseFloat(data.currentEfficiency)}
                maxValue={100}
                title="Current Efficiency"
                unit="%"
                colorScheme="efficiency"
              />
            </div>
            <div className="grid-item">
              <ComparisonChart
                currentValue={calculatedMetrics.beforePowerKW}
                proposedValue={calculatedMetrics.afterPowerKW}
                title="Power Consumption"
                unit="kW"
                improvementPercentage={parseFloat(data.expectedSaving)}
              />
            </div>
          </div>

          <SpecificationTable
            specifications={[
              {
                parameter: "System Capacity",
                current: data.systemCapacity,
                proposed: data.systemCapacity,
                unit: "TR"
              },
              {
                parameter: "Power Consumption",
                current: calculatedMetrics.beforePowerKW.toFixed(1),
                proposed: calculatedMetrics.afterPowerKW.toFixed(1),
                unit: "kW",
                improvement: true
              },
              {
                parameter: "Coefficient of Performance",
                current: calculatedMetrics.currentCOP.toFixed(1),
                proposed: calculatedMetrics.proposedCOP.toFixed(1),
                improvement: true
              },
              {
                parameter: "Operating Hours",
                current: data.operatingHours,
                proposed: data.operatingHours,
                unit: "hrs/day"
              },
              {
                parameter: "Load Factor",
                current: data.loadFactor,
                proposed: data.loadFactor,
                unit: "%"
              }
            ]}
            title="System Specifications Comparison"
          />
        </section>

        {/* Proposed Solution */}
        <section style={{ marginTop: 'var(--spacing-xxl)' }}>
          <SectionHeader 
            title="Proposed Adiabatic Cooling Solution"
            subtitle="Advanced cooling technology for optimal performance"
            icon="⚡"
          />
          
          <div style={{
            padding: 'var(--spacing-large)',
            backgroundColor: 'var(--color-neutral)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            marginBottom: 'var(--spacing-large)'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-medium)'
            }}>
              Technology Overview
            </h3>
            <p style={{
              fontSize: 'var(--font-size-body)',
              lineHeight: 1.6,
              color: 'var(--color-text)',
              marginBottom: 'var(--spacing-medium)'
            }}>
              Our proposed <strong>{data.chillerType}</strong> system utilizes advanced adiabatic cooling 
              technology to achieve superior energy efficiency while maintaining optimal cooling performance. 
              The system is designed to operate efficiently across varying load conditions and ambient temperatures.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-large)',
              marginTop: 'var(--spacing-large)'
            }}>
              <div>
                <h4 style={{
                  fontSize: 'var(--font-size-h4)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-accent)',
                  marginBottom: 'var(--spacing-small)'
                }}>
                  Key Features
                </h4>
                <ul style={{
                  fontSize: 'var(--font-size-small)',
                  lineHeight: 1.5,
                  paddingLeft: '20px'
                }}>
                  <li>Advanced adiabatic cooling process</li>
                  <li>Variable speed drive technology</li>
                  <li>Intelligent control systems</li>
                  <li>High-efficiency heat exchangers</li>
                </ul>
              </div>
              <div>
                <h4 style={{
                  fontSize: 'var(--font-size-h4)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-accent)',
                  marginBottom: 'var(--spacing-small)'
                }}>
                  Benefits
                </h4>
                <ul style={{
                  fontSize: 'var(--font-size-small)',
                  lineHeight: 1.5,
                  paddingLeft: '20px'
                }}>
                  <li>Reduced energy consumption</li>
                  <li>Lower operating costs</li>
                  <li>Improved reliability</li>
                  <li>Environmental sustainability</li>
                </ul>
              </div>
            </div>
          </div>

          <ComparisonTable
            data={[
              {
                metric: "Energy Efficiency",
                current: `${data.currentEfficiency}%`,
                proposed: `${data.proposedEfficiency}%`,
                improvement: parseFloat(data.expectedSaving)
              },
              {
                metric: "Power Consumption",
                current: calculatedMetrics.beforePowerKW,
                proposed: calculatedMetrics.afterPowerKW,
                improvement: parseFloat(data.expectedSaving),
                unit: "kW"
              },
              {
                metric: "COP",
                current: calculatedMetrics.currentCOP,
                proposed: calculatedMetrics.proposedCOP,
                improvement: ((calculatedMetrics.proposedCOP - calculatedMetrics.currentCOP) / calculatedMetrics.currentCOP) * 100,
                unit: ""
              }
            ]}
          />
        </section>

        {/* Financial Analysis */}
        <section style={{ marginTop: 'var(--spacing-xxl)' }}>
          <SectionHeader 
            title="Financial Analysis"
            subtitle="Investment returns and cost-benefit analysis"
            icon="💰"
          />

          <div className="responsive-grid">
            <div className="grid-item">
              <GaugeChart
                value={parseFloat(data.roi)}
                maxValue={50}
                title="Return on Investment"
                unit="%"
                colorScheme="savings"
              />
            </div>
            <div className="grid-item">
              <GaugeChart
                value={parseFloat(data.paybackPeriod)}
                maxValue={10}
                title="Payback Period"
                unit="years"
                colorScheme="performance"
              />
            </div>
          </div>

          <FinancialTable
            data={projections.slice(0, 5).map(p => ({
              year: p.year,
              savings: p.savings,
              cumulative: p.cumulativeSavings,
              investment: p.investment,
              netBenefit: p.netBenefit
            }))}
            title="5-Year Financial Projection"
          />
        </section>

        {/* Environmental Impact */}
        <section style={{ marginTop: 'var(--spacing-xxl)' }}>
          <SectionHeader 
            title="Environmental Impact"
            subtitle="Sustainability benefits and carbon footprint reduction"
            icon="🌱"
          />
          
          <div className="responsive-grid">
            <div className="grid-item">
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-large)',
                backgroundColor: 'rgba(46, 147, 110, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(46, 147, 110, 0.2)'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-main-title)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-accent)',
                  marginBottom: 'var(--spacing-small)'
                }}>
                  {(environmentalMetrics.co2ReductionAnnual / 1000).toFixed(1)}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--color-muted-text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Tons CO₂ Saved Annually
                </div>
              </div>
            </div>
            <div className="grid-item">
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-large)',
                backgroundColor: 'rgba(124, 219, 213, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(124, 219, 213, 0.2)'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-main-title)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-light-accent)',
                  marginBottom: 'var(--spacing-small)'
                }}>
                  {Math.round(environmentalMetrics.equivalentTreesPlanted)}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-small)',
                  color: 'var(--color-muted-text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Trees Equivalent Impact
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section style={{ marginTop: 'var(--spacing-xxl)' }}>
          <SectionHeader 
            title="Implementation Plan"
            subtitle="Project timeline and key milestones"
            icon="📅"
          />
          
          <ImplementationTimeline
            phases={timelinePhases}
            totalDuration="8-10 weeks"
            title="Implementation Timeline"
          />
          
          <ProjectMilestones milestones={projectMilestones} />
        </section>

        {/* Conclusion */}
        <section style={{ marginTop: 'var(--spacing-xxl)' }}>
          <SectionHeader 
            title="Next Steps"
            subtitle="Moving forward with your energy efficiency project"
            icon="🚀"
          />
          
          <div style={{
            padding: 'var(--spacing-xl)',
            background: 'var(--gradient-primary)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: 'var(--font-size-h2)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--spacing-medium)',
              color: 'white'
            }}>
              Ready to Start Saving Energy?
            </h3>
            <p style={{
              fontSize: 'var(--font-size-body-large)',
              marginBottom: 'var(--spacing-large)',
              opacity: 0.95,
              lineHeight: 1.6
            }}>
              Contact our engineering team to schedule a detailed site assessment 
              and begin your journey towards energy efficiency and cost savings.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-medium)',
              marginTop: 'var(--spacing-large)'
            }}>
              <div>
                <strong>Contact:</strong><br />
                {data.engineerName}<br />
                SeeTech Engineering Solutions
              </div>
              <div>
                <strong>Project Timeline:</strong><br />
                8-10 weeks from approval<br />
                Immediate energy savings
              </div>
              <div>
                <strong>Investment:</strong><br />
                {formatters.currency(parseFloat(data.investmentCost))}<br />
                {data.paybackPeriod} year payback
              </div>
            </div>
          </div>
        </section>
      </A4PageContainer>
    </>
  );
};

export default AdiabaticCoolingTemplate;
