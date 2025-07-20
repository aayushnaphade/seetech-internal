"use client";

import React from 'react';
import { AdiabaticCoolingProposalData, CalculatedMetrics } from '../types';
import { Card, ValueDisplay, ResponsiveGrid } from './Layout';
import { formatters } from '../utils/calculations';

interface ExecutiveSummaryProps {
  data: AdiabaticCoolingProposalData;
  calculatedMetrics: CalculatedMetrics;
}

/**
 * 📋 Executive Summary Section
 * High-level overview with key benefits and metrics
 */
export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  data,
  calculatedMetrics
}) => {
  const keyMetrics = [
    {
      value: formatters.percentage(parseFloat(data.expectedSaving)),
      label: 'Energy Savings',
      variant: 'positive' as const
    },
    {
      value: formatters.currency(calculatedMetrics.annualMonetarySaving),
      label: 'Annual Cost Savings',
      variant: 'positive' as const
    },
    {
      value: `${parseFloat(data.paybackPeriod).toFixed(1)} years`,
      label: 'Payback Period',
      variant: 'neutral' as const
    },
    {
      value: formatters.co2(calculatedMetrics.annualEnergySaving * 0.82),
      label: 'CO₂ Reduction',
      variant: 'positive' as const
    }
  ];

  return (
    <section>
      <h2 className="section-header">Executive Summary</h2>
      
      <Card title="Project Overview" className="mb-6">
        <div style={{
          fontSize: 'var(--font-size-body)',
          lineHeight: 1.6,
          color: 'var(--color-text)'
        }}>
          <p style={{ marginBottom: 'var(--spacing-medium)' }}>
            <strong>SeeTech</strong> proposes an advanced <strong>Adiabatic Cooling Solution</strong> for{' '}
            <strong>{data.clientName}</strong> that will deliver significant energy savings and environmental benefits 
            through cutting-edge cooling technology optimization.
          </p>
          
          <p style={{ marginBottom: 'var(--spacing-medium)' }}>
            Our comprehensive analysis of your current {data.systemCapacity} TR cooling system reveals 
            an opportunity to achieve <strong>{data.expectedSaving}% energy savings</strong> while maintaining 
            optimal cooling performance and reliability.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-medium)',
            marginTop: 'var(--spacing-large)',
            padding: 'var(--spacing-medium)',
            backgroundColor: 'var(--color-neutral)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)'
          }}>
            <div>
              <div style={{
                fontSize: 'var(--font-size-h4)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-primary)',
                marginBottom: 'var(--spacing-micro)'
              }}>
                {data.systemCapacity} TR
              </div>
              <div style={{
                fontSize: 'var(--font-size-small)',
                color: 'var(--color-muted-text)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                System Capacity
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--font-size-h4)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-accent)',
                marginBottom: 'var(--spacing-micro)'
              }}>
                {formatters.number(calculatedMetrics.savingKW, 0)} kW
              </div>
              <div style={{
                fontSize: 'var(--font-size-small)',
                color: 'var(--color-muted-text)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Power Reduction
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--font-size-h4)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-secondary)',
                marginBottom: 'var(--spacing-micro)'
              }}>
                {data.chillerType}
              </div>
              <div style={{
                fontSize: 'var(--font-size-small)',
                color: 'var(--color-muted-text)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Technology Type
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Key Performance Indicators" subtitle="Projected benefits and improvements">
        <ResponsiveGrid columns={2}>
          {keyMetrics.map((metric, index) => (
            <ValueDisplay
              key={index}
              value={metric.value}
              label={metric.label}
              variant={metric.variant}
              size="medium"
            />
          ))}
        </ResponsiveGrid>
      </Card>

      <Card title="Strategic Benefits" className="mt-4">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-large)'
        }}>
          <div>
            <h4 style={{
              fontSize: 'var(--font-size-h4)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-accent)',
              marginBottom: 'var(--spacing-small)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-small)'
            }}>
              💰 Financial Impact
            </h4>
            <ul style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-text)',
              lineHeight: 1.5,
              paddingLeft: '20px'
            }}>
              <li>Immediate reduction in energy costs</li>
              <li>Quick payback period of {data.paybackPeriod} years</li>
              <li>Positive ROI of {data.roi}% annually</li>
              <li>Long-term operational savings</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{
              fontSize: 'var(--font-size-h4)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-accent)',
              marginBottom: 'var(--spacing-small)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-small)'
            }}>
              🌱 Environmental Impact
            </h4>
            <ul style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-text)',
              lineHeight: 1.5,
              paddingLeft: '20px'
            }}>
              <li>Significant CO₂ emission reduction</li>
              <li>Lower carbon footprint</li>
              <li>Sustainable cooling solution</li>
              <li>Enhanced corporate ESG profile</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{
              fontSize: 'var(--font-size-h4)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-accent)',
              marginBottom: 'var(--spacing-small)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-small)'
            }}>
              ⚙️ Operational Benefits
            </h4>
            <ul style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-text)',
              lineHeight: 1.5,
              paddingLeft: '20px'
            }}>
              <li>Improved system efficiency</li>
              <li>Enhanced cooling performance</li>
              <li>Reduced maintenance requirements</li>
              <li>Increased equipment lifespan</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Investment Summary" className="mt-4">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-large)',
          textAlign: 'center'
        }}>
          <div style={{
            padding: 'var(--spacing-medium)',
            backgroundColor: 'rgba(178, 58, 72, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(178, 58, 72, 0.2)'
          }}>
            <div style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-warning)',
              marginBottom: 'var(--spacing-small)'
            }}>
              {formatters.currency(parseFloat(data.investmentCost))}
            </div>
            <div style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Total Investment
            </div>
          </div>
          
          <div style={{
            padding: 'var(--spacing-medium)',
            backgroundColor: 'rgba(46, 147, 110, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(46, 147, 110, 0.2)'
          }}>
            <div style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-accent)',
              marginBottom: 'var(--spacing-small)'
            }}>
              {formatters.currency(calculatedMetrics.annualMonetarySaving)}
            </div>
            <div style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Annual Savings
            </div>
          </div>
          
          <div style={{
            padding: 'var(--spacing-medium)',
            backgroundColor: 'rgba(29, 122, 163, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(29, 122, 163, 0.2)'
          }}>
            <div style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-secondary)',
              marginBottom: 'var(--spacing-small)'
            }}>
              {parseFloat(data.paybackPeriod).toFixed(1)} yrs
            </div>
            <div style={{
              fontSize: 'var(--font-size-small)',
              color: 'var(--color-muted-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Payback Period
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default ExecutiveSummary;
