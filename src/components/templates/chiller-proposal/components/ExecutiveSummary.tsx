"use client";

import React from 'react';
import { ChillerProposalData, CalculatedMetrics } from '../types';
import { MetricCard, Section, HighlightBox, ThreeColumnGrid, ValueDisplay } from './Layout';

interface ExecutiveSummaryProps {
  data: ChillerProposalData;
  metrics: CalculatedMetrics;
}

/**
 * 📋 Executive Summary - Concise Overview with Key Metrics
 * Report-style layout with professional typography
 */
export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data, metrics }) => {
  return (
    <Section title="Executive Summary">
      {/* Key Metrics Row */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <MetricCard
          value={data.expectedSaving}
          label="Energy Savings"
          variant="positive"
          icon={<span>⚡</span>}
        />
        <MetricCard
          value={`$${metrics.annualMonetarySaving.toLocaleString()}`}
          label="Annual Savings"
          variant="positive"
          icon={<span>💰</span>}
        />
        <MetricCard
          value={data.paybackPeriod}
          label="Payback Period"
          variant="default"
          icon={<span>📈</span>}
        />
        <MetricCard
          value={data.roi}
          label="Return on Investment"
          variant="positive"
          icon={<span>🎯</span>}
        />
      </div>

      {/* Project Overview */}
      <div style={{ 
        fontSize: 'var(--chiller-fs-body)', 
        lineHeight: 1.6,
        marginBottom: '24px'
      }}>
        <p style={{ marginBottom: '16px' }}>
          <strong>SeeTech Engineering Solutions</strong> proposes implementing an advanced 
          chiller optimization system for <strong>{data.clientName}</strong> that will deliver 
          <strong> {data.expectedSaving} energy savings</strong> while maintaining optimal 
          cooling performance and system reliability.
        </p>
        
        <p style={{ marginBottom: '16px' }}>
          Our comprehensive analysis of your current <strong>{data.systemCapacity}</strong> cooling 
          system reveals significant opportunities for efficiency improvements through modern 
          chiller technology and intelligent control systems.
        </p>
      </div>

      {/* System Comparison */}
      <HighlightBox title="System Performance Comparison">
        <ThreeColumnGrid>
          <ValueDisplay
            icon={<span>🏭</span>}
            value={data.systemCapacity}
            label="System Capacity"
            description="Current cooling capacity"
          />
          <ValueDisplay
            icon={<span>⚡</span>}
            value={data.currentEfficiency}
            label="Current Efficiency"
            description="Existing system performance"
          />
          <ValueDisplay
            icon={<span>🚀</span>}
            value={data.proposedEfficiency}
            label="Proposed Efficiency"
            description="Optimized performance target"
          />
        </ThreeColumnGrid>
      </HighlightBox>

      {/* Investment Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px',
        marginTop: '24px',
        padding: '16px',
        background: 'var(--chiller-neutral)',
        borderRadius: 'var(--chiller-radius-md)',
        border: '1px solid var(--chiller-border)'
      }}>
        <div>
          <div style={{ 
            fontSize: 'var(--chiller-fs-h3)', 
            fontWeight: 'bold',
            color: 'var(--chiller-primary)',
            marginBottom: '4px'
          }}>
            {data.investmentCost}
          </div>
          <div style={{ 
            fontSize: 'var(--chiller-fs-small)', 
            color: 'var(--chiller-muted)',
            fontWeight: 500
          }}>
            Total Investment
          </div>
        </div>
        <div>
          <div style={{ 
            fontSize: 'var(--chiller-fs-h3)', 
            fontWeight: 'bold',
            color: 'var(--chiller-success)',
            marginBottom: '4px'
          }}>
            {metrics.co2Reduction.toLocaleString()} kg
          </div>
          <div style={{ 
            fontSize: 'var(--chiller-fs-small)', 
            color: 'var(--chiller-muted)',
            fontWeight: 500
          }}>
            Annual CO₂ Reduction
          </div>
        </div>
      </div>
    </Section>
  );
};
