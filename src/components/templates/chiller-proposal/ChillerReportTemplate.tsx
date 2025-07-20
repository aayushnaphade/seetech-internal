"use client";

import React from 'react';
import { ChillerProposalTemplateProps } from './types';
import { calculateMetrics } from './utils/calculations';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { Charts } from './components/Charts';
import { Section, MetricCard, HighlightBox, ProList, TwoColumnGrid } from './components/Layout';
import './styles/design-tokens.css';
import './styles/layout.css';

/**
 * 🏢 Professional Chiller Proposal Report Template
 * Compact, beautiful, report-style design with colors and icons
 * Perfect for PDF generation and professional presentations
 */
export default function ChillerReportTemplate({ data }: ChillerProposalTemplateProps) {
  const metrics = calculateMetrics(data);

  return (
    <div className="chiller-report-container">
      {/* 📋 Header Section */}
      <header style={{
        background: 'var(--chiller-gradient-header)',
        color: 'white',
        padding: 'var(--chiller-space-xl)',
        borderRadius: 'var(--chiller-radius-lg)',
        marginBottom: 'var(--chiller-space-xl)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: 'var(--chiller-font-heading)',
          fontSize: 'var(--chiller-fs-title)',
          fontWeight: 700,
          margin: '0 0 8px 0'
        }}>
          {data.projectName}
        </h1>
        <p style={{ fontSize: 'var(--chiller-fs-body)', opacity: 0.9, margin: '0' }}>
          Chiller Optimization Proposal • {data.proposalNumber} • {new Date(data.date).toLocaleDateString()}
        </p>
      </header>

      {/* 🏢 Client Information */}
      <Section title="Project Overview">
        <TwoColumnGrid>
          <div>
            <h4 style={{ color: 'var(--chiller-primary)', marginBottom: '8px' }}>Client Details</h4>
            <div style={{ fontSize: 'var(--chiller-fs-body)', lineHeight: 1.5 }}>
              <strong>{data.clientName}</strong><br />
              📍 {data.location}<br />
              👤 {data.contactPerson}<br />
              📧 {data.contactEmail}<br />
              📞 {data.contactPhone}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--chiller-primary)', marginBottom: '8px' }}>System Details</h4>
            <div style={{ fontSize: 'var(--chiller-fs-body)', lineHeight: 1.5 }}>
              <strong>Capacity:</strong> {data.systemCapacity}<br />
              <strong>Operating Hours:</strong> {data.operatingHours}<br />
              <strong>Current Efficiency:</strong> {data.currentEfficiency}<br />
              <strong>Target Efficiency:</strong> {data.proposedEfficiency}
            </div>
          </div>
        </TwoColumnGrid>
      </Section>

      {/* 📊 Executive Summary */}
      <ExecutiveSummary data={data} metrics={metrics} />

      {/* 📈 Technical Analysis */}
      <Charts data={data} metrics={metrics} />

      {/* 💰 Financial Analysis */}
      <Section title="Financial Analysis">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--chiller-space-md)',
          marginBottom: 'var(--chiller-space-lg)'
        }}>
          <MetricCard
            value={data.investmentCost}
            label="Total Investment"
            variant="default"
            icon={<span>💰</span>}
          />
          <MetricCard
            value={`$${metrics.annualMonetarySaving.toLocaleString()}`}
            label="Annual Savings"
            variant="positive"
            icon={<span>📈</span>}
          />
          <MetricCard
            value={data.paybackPeriod}
            label="Payback Period"
            variant="default"
            icon={<span>⏱️</span>}
          />
          <MetricCard
            value={data.roi}
            label="Return on Investment"
            variant="positive"
            icon={<span>🎯</span>}
          />
        </div>

        <HighlightBox title="15-Year Financial Impact">
          <TwoColumnGrid>
            <div>
              <div style={{ fontSize: 'var(--chiller-fs-h3)', fontWeight: 'bold', color: 'var(--chiller-success)' }}>
                ${metrics.lifetimeSavings.toLocaleString()}
              </div>
              <div style={{ fontSize: 'var(--chiller-fs-small)', color: 'var(--chiller-muted)' }}>
                Total Lifetime Savings
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--chiller-fs-h3)', fontWeight: 'bold', color: 'var(--chiller-success)' }}>
                {(metrics.lifetimeSavings / parseFloat(data.investmentCost.replace(/[^\d.-]/g, ''))).toFixed(1)}x
              </div>
              <div style={{ fontSize: 'var(--chiller-fs-small)', color: 'var(--chiller-muted)' }}>
                Return Multiple
              </div>
            </div>
          </TwoColumnGrid>
        </HighlightBox>
      </Section>

      {/* 🛠️ Technical Specifications */}
      {data.technicalSpecs && (
        <Section title="Technical Specifications">
          <div style={{
            background: 'var(--chiller-neutral)',
            borderRadius: 'var(--chiller-radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--chiller-border)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--chiller-primary)', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: 'var(--chiller-fs-small)', fontWeight: 600 }}>
                    Parameter
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: 'var(--chiller-fs-small)', fontWeight: 600 }}>
                    Current
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: 'var(--chiller-fs-small)', fontWeight: 600 }}>
                    Proposed
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: 'var(--chiller-fs-small)', fontWeight: 600 }}>
                    Improvement
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.technicalSpecs.map((spec, index) => (
                  <tr key={index} style={{ 
                    background: index % 2 === 0 ? 'white' : 'var(--chiller-neutral)',
                    borderBottom: '1px solid var(--chiller-border)'
                  }}>
                    <td style={{ padding: '10px', fontSize: 'var(--chiller-fs-small)', fontWeight: 500 }}>
                      {spec.parameter}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', fontSize: 'var(--chiller-fs-small)' }}>
                      {spec.current}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', fontSize: 'var(--chiller-fs-small)' }}>
                      {spec.proposed}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      fontSize: 'var(--chiller-fs-small)',
                      fontWeight: 600,
                      color: spec.improvement.includes('+') || spec.improvement.includes('-') && !spec.improvement.includes('Maintained') 
                        ? 'var(--chiller-success)' 
                        : 'var(--chiller-muted)'
                    }}>
                      {spec.improvement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* 🚀 Implementation Timeline */}
      {data.implementationPhases && (
        <Section title="Implementation Timeline">
          <div style={{ display: 'grid', gap: 'var(--chiller-space-md)' }}>
            {data.implementationPhases.map((phase, index) => (
              <div key={index} style={{
                background: 'var(--chiller-neutral)',
                border: '1px solid var(--chiller-border)',
                borderRadius: 'var(--chiller-radius-md)',
                padding: 'var(--chiller-space-md)',
                borderLeft: `4px solid var(--chiller-accent)`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ color: 'var(--chiller-primary)', margin: 0, fontSize: 'var(--chiller-fs-h4)' }}>
                    {phase.phase}
                  </h4>
                  <span style={{
                    background: 'var(--chiller-accent)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 'var(--chiller-radius-sm)',
                    fontSize: 'var(--chiller-fs-micro)',
                    fontWeight: 600
                  }}>
                    {phase.duration}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--chiller-fs-small)', margin: '0 0 8px 0', color: 'var(--chiller-text)' }}>
                  {phase.description}
                </p>
                <div style={{ fontSize: 'var(--chiller-fs-micro)', color: 'var(--chiller-muted)' }}>
                  <strong>Milestone:</strong> {phase.milestone}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ✨ Key Features */}
      {data.features && (
        <Section title="Solution Features">
          <ProList items={data.features} />
        </Section>
      )}

      {/* 🌍 Environmental Impact */}
      <Section title="Environmental Impact">
        <div style={{
          background: 'var(--chiller-gradient-success)',
          color: 'white',
          padding: 'var(--chiller-space-lg)',
          borderRadius: 'var(--chiller-radius-lg)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--chiller-space-md)' }}>
            <div>
              <div style={{ fontSize: 'var(--chiller-fs-subtitle)', fontWeight: 'bold', marginBottom: '4px' }}>
                {metrics.co2Reduction.toLocaleString()}
              </div>
              <div style={{ fontSize: 'var(--chiller-fs-small)', opacity: 0.9 }}>
                kg CO₂ Reduced Annually
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--chiller-fs-subtitle)', fontWeight: 'bold', marginBottom: '4px' }}>
                {(metrics.annualEnergySaving / 1000).toFixed(0)}
              </div>
              <div style={{ fontSize: 'var(--chiller-fs-small)', opacity: 0.9 }}>
                MWh Energy Saved Annually
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 📞 Next Steps */}
      <Section title="Next Steps">
        <HighlightBox title="Ready to Move Forward?">
          <p style={{ marginBottom: '16px', fontSize: 'var(--chiller-fs-body)' }}>
            Contact our team to schedule a detailed site assessment and begin your 
            energy optimization journey. We're ready to help you achieve significant 
            cost savings while reducing your environmental footprint.
          </p>
          <div style={{ fontSize: 'var(--chiller-fs-small)', color: 'var(--chiller-muted)' }}>
            <strong>SeeTech Engineering Solutions</strong><br />
            📧 proposals@seetechengineering.com<br />
            📞 +1 (555) 123-TECH<br />
            🌐 www.seetechengineering.com
          </div>
        </HighlightBox>
      </Section>
    </div>
  );
}
