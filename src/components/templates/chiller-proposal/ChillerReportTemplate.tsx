"use client";

import React from 'react';
import CoverPage from './components/CoverPage';
import { PHChart, PHChartSummary } from './components/PHChart';
import ExecutiveSummaryPage from './components/ExecutiveSummaryPage';
import { ChillerProposalData } from './types';
import { buildDerivedMetrics, getSystemLabel } from './utils/derived-calculations';
import { Layers, Droplets, Settings, FlaskConical, Leaf, TreePine, Globe, Award, CheckCircle, Wrench, Clock, Users, UserCheck, HardHat, ClipboardCheck, CalendarCheck, User2, Search, BarChart2, Zap, IndianRupee, Activity, Headphones, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
const Plot: any = dynamic(() => import('react-plotly.js'), { ssr: false });
import { Chrono } from 'react-chrono';
import { LucideProps } from 'lucide-react';

// Standardized color scheme for the entire template (updated to match sample)
const colors = {
  primaryBlue: '#09425d', // Deep blue from sample
  secondaryGreen: '#1db56c', // Green from sample
  yellow: '#f7b500', // Yellow from sample
  red: '#e74c3c', // Red from sample
  blueLight: '#eaf3f7', // Light blue background (adjusted for contrast)
  greenLight: '#e6f9f2', // Light green for backgrounds (can be used for highlights)
  text: '#18344a', // Main text
  textMuted: '#444',
  border: '#e3e8ee',
  white: '#fff',
};

// Shared typography system for the report
const typography = {
  fontFamily: 'Inter, Arial, sans-serif',
  title: { fontSize: 22, fontWeight: 700, color: colors.primaryBlue, marginBottom: 28, marginTop: 0, textAlign: 'left' as const },
  section: { fontSize: 15, fontWeight: 700, color: colors.text, marginBottom: 8, marginTop: 0, textAlign: 'left' as const },
  subsection: { fontSize: 14, fontWeight: 400, color: colors.text, marginBottom: 4, marginTop: 0, textAlign: 'left' as const },
  page: { minHeight: '100vh', background: colors.white, padding: '48px 0 0 0', display: 'block', fontFamily: 'Inter, Arial, sans-serif' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  sublist: { listStyle: 'none', paddingLeft: 28, marginTop: 2 },
};

function TableOfContents() {
  return (
    <div style={{...typography.page, paddingTop: 80}}>
      <h2 style={typography.title}>Table of Contents</h2>
      <div style={{ maxWidth: 700, margin: '0 auto', color: colors.text }}>
        <ol style={typography.list}>
          <li style={{ marginBottom: 14 }}>
            <span style={typography.section}>1. Executive Summary</span>
          </li>
          <li style={{ marginBottom: 14 }}>
            <span style={typography.section}>2. Adiabatic Cooling Technology</span>
            <ol style={typography.sublist}>
              <li style={typography.subsection}>2.1 Adiabatic Cooling Technology</li>
              <li style={typography.subsection}>2.2 System Components</li>
              <li style={typography.subsection}>2.3 Expected Operating Parameters</li>
            </ol>
          </li>
          <li style={{ marginBottom: 14 }}>
            <span style={typography.section}>3. Technical Analysis</span>
            <ol style={typography.sublist}>
              <li style={typography.subsection}>3.1 P-H Chart Visualization</li>
              <li style={typography.subsection}>3.2 Energy Savings Analysis</li>
            </ol>
          </li>
          <li style={{ marginBottom: 14 }}>
            <span style={typography.section}>4. Financial Analysis</span>
            <ol style={typography.sublist}>
              <li style={typography.subsection}>4.1 Cost Benefit Summary</li>
              <li style={typography.subsection}>4.2 Life Cycle Cost Analysis</li>
              <li style={typography.subsection}>4.3 Return on Investment Analysis</li>
            </ol>
          </li>
          <li style={{ marginBottom: 14 }}>
            <span style={typography.section}>5. Environmental Impact</span>
            <ol style={typography.sublist}>
              <li style={typography.subsection}>5.1 Carbon Footprint Reduction</li>
              <li style={typography.subsection}>5.2 Sustainability Benefits</li>
            </ol>
          </li>
          <li style={{ marginBottom: 14 }}>
            <span style={typography.section}>6. Implementation</span>
            <ol style={typography.sublist}>
              <li style={typography.subsection}>6.1 Project Timeline</li>
              <li style={typography.subsection}>6.2 Installation Process</li>
              <li style={typography.subsection}>6.3 Your Project Team</li>
            </ol>
          </li>
          <li style={{ marginBottom: 14 }}>
            <span style={typography.section}>7. Maintenance Service & Conclusion</span>
            <ol style={typography.sublist}>
              <li style={typography.subsection}>7.1 SEE-Tech Professional Maintenance Program</li>
              <li style={typography.subsection}>7.2 Conclusion</li>
            </ol>
          </li>
        </ol>
            </div>
          </div>
  );
}

// ExecutiveSummaryPage is now imported as a modular component

function SystemDescriptionPage() {
  // Static content for now
  const iconStyle = { color: colors.primaryBlue, width: 36, height: 36, marginBottom: 2 };
  const components = [
    {
      icon: <Layers style={iconStyle} />,
      title: 'Media Pads',
      description: 'High-efficiency cellulose pads with cross-fluted design for optimal water distribution and air contact',
      bullets: [
        'Cross-fluted design',
        'Long lifespan material',
        'Maximum cooling efficiency',
      ],
    },
    {
      icon: <Droplets style={{ ...iconStyle, color: colors.secondaryGreen }} />,
      title: 'Water Distribution System',
      description: 'Precision-engineered water delivery with efficient distribution headers and flow control mechanisms',
      bullets: [
        'Uniform water distribution',
        'Stainless steel construction',
        'Low-pressure operation',
      ],
    },
    {
      icon: <Settings style={iconStyle} />,
      title: 'Control System',
      description: 'Advanced IoT-enabled controls for intelligent operation based on ambient conditions and system demand',
      bullets: [
        'Remote monitoring capability',
        'Adaptive control algorithms',
        'Predictive maintenance alerts',
      ],
    },
    {
      icon: <FlaskConical style={{ ...iconStyle, color: colors.secondaryGreen }} />,
      title: 'Water Treatment',
      description: 'Integrated water conditioning system to maintain optimal TDS levels (<200 ppm) and prevent scaling',
      bullets: [
        'Automatic bleed-off system',
        'Anti-scaling technology',
        'Water quality monitoring',
      ],
    },
  ];
  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      <h2 style={{ ...typography.title, fontSize: 20, display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: colors.primaryBlue, fontWeight: 700, fontSize: 20, marginRight: 8 }}>2. System Description</span>
        <span style={{ flex: 1, height: 3, background: colors.primaryBlue, borderRadius: 2, marginLeft: 8, marginTop: 8 }} />
      </h2>
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 24, marginBottom: 8, color: colors.primaryBlue }}>2.1 Adiabatic Cooling Technology</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        Adiabatic cooling is an energy-efficient method that leverages evaporative cooling principles to reduce the temperature of air entering the condenser. This technology works on the principle that when water evaporates, it absorbs heat from the surrounding air, effectively lowering its temperature.
        </div>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 18, lineHeight: 1.7 }}>
        For refrigeration systems, this means:
        <ul style={{ marginTop: 8, marginBottom: 8, marginLeft: 24, fontSize: 15 }}>
          <li>Lower condenser inlet air temperature</li>
          <li>Reduced condensing pressure</li>
          <li>Decreased compressor work</li>
          <li>Improved system Coefficient of Performance (COP)</li>
          <li>Significant energy savings</li>
        </ul>
              </div>
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 32, marginBottom: 8, color: colors.primaryBlue }}>2.2 System Components</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        Our adiabatic cooling system consists of the following high-quality components designed for maximum efficiency and durability:
              </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16, marginBottom: 16 }}>
        {components.map((comp) => (
          <div key={comp.title} style={{ background: colors.white, borderRadius: 12, boxShadow: '0 2px 12px 0 rgba(24,52,74,0.08)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 220, border: `1px solid ${colors.blueLight}` }}>
            <div style={{ marginBottom: 10 }}>{comp.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: colors.primaryBlue, marginBottom: 4 }}>{comp.title}</div>
            <div style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>{comp.description}</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: colors.text }}>
              {comp.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            </div>
        ))}
              </div>
            </div>
  );
}

function OperatingParametersAndTechnicalAnalysisPage({ data }: { data: ChillerProposalData }) {
  const derived = buildDerivedMetrics(data);
  const { capital } = getSystemLabel(data.systemType);
  const beforeAfterRows = [
    {
      label: derived.tempLabel,
      before: `${derived.beforeTempC.toFixed(1)}°C`,
      after: `${derived.afterTempC.toFixed(1)}°C`,
      change: <span style={{ color: colors.secondaryGreen, fontWeight: 600 }}>-{derived.tempReductionC.toFixed(1)}°C</span>,
    },
    {
      label: `${capital} COP`,
      before: derived.beforeCOP.toFixed(2),
      after: derived.afterCOP.toFixed(2),
      change: <span style={{ color: colors.secondaryGreen, fontWeight: 600 }}>+{derived.copImprovement.toFixed(2)}</span>,
    },
    {
      label: `${capital} Power Consumption`,
      before: `${derived.currentPowerKW.toFixed(1)} kW`,
      after: `${derived.proposedPowerKW.toFixed(1)} kW`,
      change: <span style={{ color: colors.secondaryGreen, fontWeight: 600 }}>-{derived.savingPct.toFixed(1)}%</span>,
    },
  ];

  // Cycle comparison table
  const cycleRows = [
    {
      type: <span style={{ color: colors.primaryBlue, fontWeight: 700 }}>OEM Cycle</span>,
      desc: "Original equipment manufacturer's design cycle under ideal conditions",
      signif: 'Represents baseline performance as per design specifications; optimal operating parameters established by manufacturer',
      rowColor: colors.blueLight,
    },
    {
      type: <span style={{ color: colors.yellow, fontWeight: 700 }}>Actual Cycle</span>,
      desc: 'Current system performance under existing environmental conditions',
      signif: 'Shows real-world performance deviation from design specifications; identifies efficiency losses and opportunities for improvement',
      rowColor: colors.white,
    },
    {
      type: <span style={{ color: colors.secondaryGreen, fontWeight: 700 }}>Optimized Cycle</span>,
      desc: 'Projected performance with adiabatic cooling implementation',
      signif: 'Demonstrates expected performance gains through condenser temperature reduction; quantifies energy savings potential',
      rowColor: colors.greenLight,
    },
  ];

  // Plotly gauge config (static, print-friendly)
  const gaugeLayout = {
    width: 260,
    height: 200,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, Arial, sans-serif', size: 16 },
  };
  const gaugeConfig = { displayModeBar: false };

  function TemperatureGauge({ value, reference, isAfter }: { value: number; reference?: number; isAfter?: boolean }) {
    return (
      <Plot
        data={[
          {
            type: 'indicator',
            mode: isAfter ? 'gauge+number+delta' : 'gauge+number',
            value,
            number: { suffix: '°C', font: { size: 30 } },
            ...(isAfter
              ? {
                  delta: {
                    reference,
                    valueformat: '.1f',
                    suffix: '°C',
                    font: { size: 16, color: '#e74c3c' },
                    position: 'bottom',
                    decreasing: { color: '#e74c3c' },
                    increasing: { color: '#1db56c' },
                  },
                }
              : {}),
            gauge: {
              axis: {
                range: [0, 60],
                tickvals: [0, 20, 40, 60],
                ticksuffix: '°C',
                tickcolor: '#09425d',
                tickwidth: 2,
                tickfont: { color: '#09425d', size: 14 },
              },
              bar: { color: isAfter ? '#1db56c' : '#e74c3c', thickness: 0.18 },
              bgcolor: 'white',
              borderwidth: 2,
              bordercolor: 'gray',
              steps: [
                { range: [0, 30], color: '#c7e9b4' },
                { range: [30, 40], color: '#7fcdbb' },
                { range: [40, 50], color: '#fdae61' },
                { range: [50, 60], color: '#d73027' },
              ],
              threshold: {
                line: { color: 'red', width: 4 },
                thickness: 0.75,
                value: isAfter && reference !== undefined ? reference : value,
              },
            },
          },
        ]}
        layout={{
          width: 260,
          height: 200,
          margin: { l: 20, r: 20, t: 20, b: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { family: 'Inter, Arial, sans-serif', size: 16 },
        }}
        config={{ displayModeBar: false }}
      />
    );
  }

  // Before gauge
  const beforeGauge = (
    <TemperatureGauge value={derived.beforeTempC} />
  );
  // After gauge
  const afterGauge = (
    <TemperatureGauge value={derived.afterTempC} reference={derived.beforeTempC} isAfter />
  );

  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      {/* 2.3 Expected Operating Parameters */}
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: colors.primaryBlue }}>2.3 Expected Operating Parameters</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        The following table outlines the key system parameters before and after adiabatic cooling implementation, highlighting the significant improvements in operating conditions:
      </div>
      <div style={{ margin: '0 0 24px 0', boxShadow: '0 2px 12px 0 rgba(24,52,74,0.08)', borderRadius: 10, overflow: 'hidden', background: colors.white }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <thead>
            <tr style={{ background: colors.primaryBlue }}>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>PARAMETER</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>BEFORE</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>AFTER</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>CHANGE</th>
                </tr>
              </thead>
              <tbody>
            {beforeAfterRows.map((row, i) => (
              <tr key={row.label} style={{ background: i % 2 === 0 ? colors.blueLight : colors.white }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.label}</td>
                <td style={{ padding: '10px 16px', color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.before}</td>
                <td style={{ padding: '10px 16px', color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.after}</td>
                <td style={{ padding: '10px 16px', borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      {/* Gauges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: colors.text, marginBottom: 8 }}>
            Before Adiabatic Cooling
            <br />
            <span style={{ fontSize: 12, color: colors.textMuted }}>
              {(data.ambientDBT && data.ambientWBT) ? 'Ambient DBT' : 'Condenser Inlet'}
            </span>
          </div>
          {beforeGauge}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: colors.text, marginBottom: 8 }}>
            After Adiabatic Cooling
            <br />
            <span style={{ fontSize: 12, color: colors.textMuted }}>
              {(data.ambientDBT && data.ambientWBT) ? 'Ambient WBT' : 'Optimized Inlet'}
            </span>
          </div>
          {afterGauge}
        </div>
      </div>
      {/* 3. Technical Analysis */}
      <h2 style={{ ...typography.title, fontSize: 20, display: 'flex', alignItems: 'center', marginBottom: 12, marginTop: 32 }}>
        <span style={{ color: colors.primaryBlue, fontWeight: 700, fontSize: 20, marginRight: 8 }}>3. Technical Analysis</span>
        <span style={{ flex: 1, height: 3, background: colors.primaryBlue, borderRadius: 2, marginLeft: 8, marginTop: 8 }} />
      </h2>
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: colors.primaryBlue }}>P-H Chart Analysis</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        The pressure-enthalpy (P-H) diagram below illustrates the refrigeration cycles under different operating conditions and demonstrates the impact of our proposed adiabatic cooling system:
      </div>
      <div style={{ fontWeight: 700, color: colors.primaryBlue, fontSize: 15, marginBottom: 8 }}>Refrigeration Cycle Comparison</div>
      <div style={{ margin: '0 0 24px 0', boxShadow: '0 2px 12px 0 rgba(24,52,74,0.08)', borderRadius: 10, overflow: 'hidden', background: colors.white }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: colors.primaryBlue }}>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>CYCLE TYPE</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>DESCRIPTION</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>SIGNIFICANCE</th>
            </tr>
          </thead>
          <tbody>
            {cycleRows.map((row, i) => (
              <tr key={i} style={{ background: row.rowColor }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.type}</td>
                <td style={{ padding: '10px 16px', color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.desc}</td>
                <td style={{ padding: '10px 16px', color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.signif}</td>
              </tr>
            ))}
          </tbody>
        </table>
              </div>
          </div>
  );
}

function PHChartVisualizationPage({ data }: { data: ChillerProposalData }) {
  const { capital, powerLabel } = getSystemLabel(data.systemType);
  // Degradation zone table
  const degradationRows = [
    {
      parameter: 'High Condenser Temperature',
      impact: 'Increases condensing pressure, requiring higher compression ratios. Each 1°C temperature reduction typically yields 2-3% energy savings.',
    },
    {
      parameter: 'Increased Compressor Work',
      impact: 'Greater pressure differential between evaporator and condenser requires more electrical input power, reducing the Coefficient of Performance (COP).',
    },
    {
      parameter: 'System Reliability Impact',
      impact: 'Higher discharge temperatures and pressures increase mechanical stress on compressors and system components, leading to increased maintenance costs and reduced equipment lifespan.',
    },
    {
      parameter: 'Cooling Capacity Reduction',
      impact: 'Elevated condensing temperatures reduce mass flow rate of refrigerant, decreasing the system\'s ability to remove heat effectively from the process.',
    },
  ];

  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: colors.primaryBlue }}>3.1 P-H Chart Visualization</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        The pressure-enthalpy (P-H) diagram below shows the thermodynamic analysis of your {capital.toLowerCase()} system using R134a refrigerant properties. 
        This analysis compares three operational scenarios to quantify the performance improvement potential.
      </div>
      
      <PHChartSummary data={data} />
      
      <PHChart data={data} colors={colors} shouldCalculate={true} />
      <h4 style={{ ...typography.section, fontSize: 15, color: colors.primaryBlue, marginTop: 24, marginBottom: 8 }}>Degradation Zone Significance</h4>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        The degradation zone represents the operational inefficiency due to suboptimal conditions:
              </div>
      <div style={{ margin: '0 0 24px 0', boxShadow: '0 2px 12px 0 rgba(24,52,74,0.08)', borderRadius: 10, overflow: 'hidden', background: colors.white }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: colors.primaryBlue }}>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>PARAMETER</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '12px 16px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>TECHNICAL IMPACT</th>
            </tr>
          </thead>
          <tbody>
            {degradationRows.map((row, i) => (
              <tr key={row.parameter} style={{ background: i % 2 === 0 ? colors.blueLight : colors.white }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.parameter}</td>
                <td style={{ padding: '10px 16px', color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.impact}</td>
              </tr>
            ))}
          </tbody>
        </table>
              </div>
            </div>
  );
}

function EnergySavingsAndFinancialAnalysisPage({ data }: { data: ChillerProposalData }) {
  const derived = buildDerivedMetrics(data);
  const { capital, powerLabel } = getSystemLabel(data.systemType);
  const before_kw = derived.currentPowerKW || 0;
  const after_kw = derived.proposedPowerKW || 0;
  const saving_kw = derived.powerSavingKW;
  const power_saving_pct = derived.savingPct;
  const barColors = ['#e74c3c', '#1db56c', '#09425d'];

  const powerBarData = [
    {
      x: ['Before Adiabatic Cooling', 'After Adiabatic Cooling', 'Power Savings'],
      y: [before_kw, after_kw, saving_kw],
      text: [`${before_kw.toFixed(1)} kW`, `${after_kw.toFixed(1)} kW`, `${saving_kw.toFixed(1)} kW`],
      textposition: 'auto',
      marker: {
        color: barColors,
        line: { width: 1, color: '#333' },
        opacity: 0.9,
      },
      width: [0.65, 0.65, 0.65],
      name: 'Power Consumption',
      type: 'bar',
    },
  ];
  const powerBarLayout = {
    title: {
      text: 'Power Consumption Comparison With Adiabatic Cooling',
      font: { size: 18, family: 'Inter, Arial, sans-serif' },
      y: 0.95,
    },
    yaxis: {
      title: { text: 'Power Consumption (kW)', font: { size: 14 } },
      tickformat: '.1f',
      tickfont: { size: 12 },
      gridcolor: 'rgba(0,0,0,0.1)',
    },
    xaxis: {
      categoryorder: 'array',
      categoryarray: ['Before Adiabatic Cooling', 'After Adiabatic Cooling', 'Power Savings'],
      tickfont: { size: 12 },
    },
    height: 340,
    margin: { l: 50, r: 50, t: 70, b: 50 },
    plot_bgcolor: 'rgba(250,250,250,0.9)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    uniformtext_minsize: 12,
    uniformtext_mode: 'hide',
    showlegend: false,
    shapes: [
      {
        type: 'line',
        x0: -0.5, y0: before_kw, x1: 1.5, y1: before_kw,
        line: { dash: 'dot', color: '#e74c3c', width: 2 },
      },
    ],
    annotations: [
      {
        x: 0.5, y: (before_kw + after_kw) / 2,
        text: `${power_saving_pct.toFixed(1)}% Reduction`,
        font: { size: 14, color: '#333', family: 'Inter, Arial, sans-serif' },
        showarrow: true,
        arrowhead: 2,
        arrowcolor: '#09425d',
        arrowsize: 1.5,
        arrowwidth: 2,
        bgcolor: 'rgba(255,255,255,0.8)',
        bordercolor: '#333',
        borderwidth: 1,
        borderpad: 4,
        opacity: 0.9,
      },
    ],
  };

  // Cost benefit summary table
  const fmtINR = (v: number) => `₹${Math.round(v).toLocaleString('en-IN')}`;
  const costRows = [
    { item: 'Project Cost', value: fmtINR(derived.investmentCost), color: colors.text },
    { item: 'Annual Electricity Savings', value: fmtINR(derived.annualElectricitySavings), color: colors.secondaryGreen },
    { item: 'Annual Water Cost', value: fmtINR(derived.annualWaterCost), color: '#e74c3c' },
    { item: 'Annual Maintenance Cost', value: fmtINR(derived.annualMaintenanceCost), color: '#e74c3c' },
    { item: 'Net Annual Savings', value: fmtINR(derived.netAnnualSavings), color: colors.secondaryGreen },
    { item: 'Simple Payback Period', value: derived.simplePaybackMonths ? `${derived.simplePaybackMonths.toFixed(1)} months` : '—', color: colors.text },
  ];

  // Pie/donut chart for financial impact (compact, percent only, with custom legend)
  const pieLabels = ['Elec. Savings', 'Water Costs', 'Maint. Costs', 'Net Savings'];
  const pieValues = [
    Math.max(0, derived.annualElectricitySavings),
    Math.max(0, derived.annualWaterCost),
    Math.max(0, derived.annualMaintenanceCost),
    Math.max(0, derived.netAnnualSavings)
  ];
  const pieColors = ['#2E936E', '#B23A48', '#B23A48', '#1D7AA3'];
  const piePull = [0, 0, 0, 0.1]; // Pull out Net Savings
  const pieData = [
    {
      labels: pieLabels,
      values: pieValues.map(Math.abs),
      marker: { colors: pieColors },
      type: 'pie',
      hole: 0.4,
      textinfo: 'percent',
      textposition: 'inside',
      pull: piePull,
      showlegend: false,
      automargin: true,
      textfont: { size: 11 },
    },
  ];
  const pieLayout = {
    height: 140,
    width: 140,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    showlegend: false,
  };

  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      {/* 3.2 Energy Savings Analysis */}
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: colors.primaryBlue }}>3.2 Energy Savings Analysis</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        Our analysis shows that by implementing the adiabatic cooling system, we can achieve a significant reduction in power consumption:
              </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <Plot
          data={powerBarData}
          layout={powerBarLayout}
          config={{ displayModeBar: false }}
        />
              </div>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 24, lineHeight: 1.7 }}>
        The {power_saving_pct.toFixed(1)}% reduction in {powerLabel} consumption translates to annual energy savings of {derived.annualEnergySavingKWh.toLocaleString('en-IN')} kWh, resulting in monetary savings of {fmtINR(derived.annualElectricitySavings)}/year.
            </div>
      {/* 4. Financial Analysis */}
      <h2 style={{ ...typography.title, fontSize: 20, display: 'flex', alignItems: 'center', marginBottom: 12, marginTop: 32 }}>
        <span style={{ color: colors.primaryBlue, fontWeight: 700, fontSize: 20, marginRight: 8 }}>4. Financial Analysis</span>
        <span style={{ flex: 1, height: 3, background: colors.primaryBlue, borderRadius: 2, marginLeft: 8, marginTop: 8 }} />
      </h2>
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: colors.primaryBlue }}>4.1 Cost Benefit Summary</h3>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ flex: 'none', width: 290 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, boxShadow: '0 2px 12px 0 rgba(24,52,74,0.08)', borderRadius: 10, overflow: 'hidden', background: colors.white }}>
            <thead>
              <tr style={{ background: colors.primaryBlue }}>
                <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>ITEM</th>
                <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}></th>
              </tr>
            </thead>
            <tbody>
              {costRows.map((row, i) => (
                <tr key={row.item} style={{ background: i % 2 === 0 ? colors.blueLight : colors.white }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600, color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.item}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 600, color: row.color, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
              </div>
        {/* Only a single container for the pie chart, with overflow visible */}
        <div style={{ minWidth: 220, overflow: 'visible', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Plot
            data={pieData}
            layout={pieLayout}
            config={{ displayModeBar: false }}
          />
          {/* Custom legend below the chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8, fontSize: 12 }}>
            {pieLabels.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: pieColors[i], marginRight: 4 }}></span>
                <span>{label}</span>
              </div>
            ))}
            </div>
        </div>
      </div>
          </div>
  );
}

function LifeCycleCostAndROIPage() {
  // Life cycle cost table data
  const lccRows = [
    { year: 0, cash: '-1,150,000', dcf: '-1,150,000', cdf: '-1,150,000', cdfColor: '#e74c3c' },
    { year: 1, cash: '1,926,554', dcf: '1,783,847', cdf: '633,847', cdfColor: '#1db56c' },
    { year: 2, cash: '2,003,616', dcf: '1,717,778', cdf: '2,351,625', cdfColor: '#1db56c' },
    { year: 3, cash: '2,083,761', dcf: '1,654,157', cdf: '4,005,781', cdfColor: '#1db56c' },
    { year: 5, cash: '2,253,796', dcf: '1,533,896', cdf: '7,132,569', cdfColor: '#1db56c' },
    { year: 10, cash: '2,742,087', dcf: '1,270,117', cdf: '13,990,813', cdfColor: '#1db56c' },
    { year: 15, cash: '3,336,169', dcf: '1,051,699', cdf: '19,669,670', cdfColor: '#1db56c' },
  ];

  // ROI line chart data
  const roiYears = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const roiCDF = [0, 633847, 2351625, 4005781, 5710000, 7132569, 9000000, 12000000, 19669670];
  const breakEvenYear = 0.64;
  const breakEvenValue = 0;
  const roiData = [
    {
      x: roiYears,
      y: roiCDF,
      mode: 'lines+markers',
      name: 'Cumulative Discounted Cash Flow',
      line: { color: '#1D7AA3', width: 3 },
      marker: { color: '#1D7AA3', size: 7 },
    },
    {
      x: [breakEvenYear],
      y: [breakEvenValue],
      mode: 'markers+text',
      name: 'Break-even: 0.64 Years',
      marker: { color: '#1db56c', size: 16, symbol: 'star' },
      text: ['Break-even: 0.64 Years'],
      textposition: 'top right',
      textfont: { size: 13, color: '#1db56c' },
      showlegend: false,
    },
  ];
  const roiLayout = {
    title: {
      text: 'Return on Investment Timeline',
      font: { size: 16, color: colors.primaryBlue },
      y: 0.98,
    },
    xaxis: {
      title: 'Year',
      tickfont: { size: 12 },
      titlefont: { size: 13 },
      zeroline: false,
      showgrid: true,
      gridcolor: '#eaf3f7',
    },
    yaxis: {
      title: 'Cumulative Discounted Cash Flow (₹)',
      tickfont: { size: 12 },
      titlefont: { size: 13 },
      zeroline: true,
      showgrid: true,
      gridcolor: '#eaf3f7',
    },
    height: 260,
    width: 520,
    margin: { l: 60, r: 30, t: 50, b: 50 },
    plot_bgcolor: colors.white,
    paper_bgcolor: colors.white,
    font: { family: 'Inter, Arial, sans-serif', size: 13, color: colors.text },
    showlegend: true,
    legend: { orientation: 'h', x: 0.01, y: 1.15, font: { size: 12 } },
  };

  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      {/* 4.2 Life Cycle Cost Analysis */}
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: colors.primaryBlue }}>4.2 Life Cycle Cost Analysis (15 Years)</h3>
      <div style={{ width: 540, maxWidth: '100%', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, boxShadow: '0 2px 12px 0 rgba(24,52,74,0.08)', borderRadius: 10, overflow: 'hidden', background: colors.white }}>
              <thead>
            <tr style={{ background: colors.primaryBlue }}>
              <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>YEAR</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>CASH FLOW (₹)</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>DISCOUNTED CF (₹)</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>CUMULATIVE DCF (₹)</th>
                </tr>
              </thead>
              <tbody>
            {lccRows.map((row, i) => (
              <tr key={row.year} style={{ background: i % 2 === 0 ? colors.blueLight : colors.white }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.year}</td>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.cash}</td>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.dcf}</td>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: row.cdfColor, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.cdf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 24, lineHeight: 1.7 }}>
        The Net Present Value (NPV) of this project over 15 years is <b style={{ color: colors.primaryBlue }}>₹1,96,69,669.56 (1.97 Cr)</b>, with a discount rate of 8% and inflation rate of 4%.
      </div>
      {/* 4.3 Return on Investment Analysis */}
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 32, marginBottom: 8, color: colors.primaryBlue }}>4.3 Return on Investment Analysis</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        The chart below illustrates the cumulative cash flow over time, showing the break-even point and long-term financial benefits of the adiabatic cooling system investment.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <Plot
          data={roiData}
          layout={roiLayout}
          config={{ displayModeBar: false }}
        />
      </div>
    </div>
  );
}

function EnvironmentalImpactPage() {
  // Color palette
  const darkGreen = '#2f936f';
  const forestGreen = '#3b7a40';
  const gold = '#bd8b2f';
  const yellow = '#fac310';
  const sdgColors = ['#fac310', '#bd8b2f', '#3b7a40', '#2f936f'];

  // Impact table data
  const impactRows = [
    { impact: 'Annual Energy Savings', value: '322,560 kWh/year' },
    { impact: 'Grid Emission Factor', value: '0.82 kg CO2e/kWh' },
    { impact: 'Annual CO2e Reduction', value: '264.5 tonnes CO2e/year' },
    { impact: 'Equivalent to Trees Planted', value: '4,364 trees' },
  ];

  // SDG badges
  const sdgs = [
    { label: 'SDG 7', color: yellow },
    { label: 'SDG 9', color: gold },
    { label: 'SDG 12', color: forestGreen },
    { label: 'SDG 13', color: darkGreen },
  ];

  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      {/* 5. Environmental Impact */}
      <h2 style={{ ...typography.title, fontSize: 20, display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: colors.primaryBlue, fontWeight: 700, fontSize: 20, marginRight: 8 }}>5. Environmental Impact</span>
        <span style={{ flex: 1, height: 3, background: colors.primaryBlue, borderRadius: 2, marginLeft: 8, marginTop: 8 }} />
      </h2>
      {/* 5.1 Carbon Footprint Reduction */}
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: colors.primaryBlue }}>5.1 Carbon Footprint Reduction</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 1.7 }}>
        Implementation of the adiabatic cooling system will significantly reduce the facility's carbon footprint through reduced electricity consumption.
                </div>
      <div style={{ width: 480, maxWidth: '100%', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, boxShadow: '0 2px 12px 0 rgba(47,147,111,0.12)', borderRadius: 10, overflow: 'hidden', background: colors.white }}>
          <thead>
            <tr style={{ background: colors.primaryBlue }}>
              <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>IMPACT</th>
              <th style={{ color: colors.white, fontWeight: 700, padding: '10px 10px', textAlign: 'left', fontSize: 14, letterSpacing: 1 }}>VALUE</th>
            </tr>
          </thead>
          <tbody>
            {impactRows.map((row, i) => (
              <tr key={row.impact} style={{ background: i % 2 === 0 ? colors.blueLight : colors.white }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: colors.text, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.impact}</td>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: colors.primaryBlue, borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
                </div>
      {/* 5.2 Sustainability Benefits */}
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 24, marginBottom: 8, color: colors.primaryBlue }}>5.2 Sustainability Benefits</h3>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 16, lineHeight: 1.7 }}>
        By implementing the adiabatic cooling system, your organization will contribute to multiple UN Sustainable Development Goals and strengthen your sustainability profile:
              </div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
        {/* Direct Environmental Impact Card */}
        <div style={{ flex: 1, background: '#f6fcf9', borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(47,147,111,0.13)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: `1.5px solid ${darkGreen}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Leaf size={28} color={forestGreen} />
            <span style={{ fontWeight: 700, fontSize: 16, color: forestGreen }}>Direct Environmental Impact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: darkGreen }}>264.5 <span style={{ fontSize: 13, fontWeight: 500 }}>tonnes<br />CO₂</span></div>
            <div style={{ fontWeight: 700, fontSize: 22, color: gold }}>4,364 <span style={{ fontSize: 13, fontWeight: 500 }}>trees</span></div>
            <div style={{ fontWeight: 700, fontSize: 22, color: '#e74c3c' }}>322.6 <span style={{ fontSize: 13, fontWeight: 500 }}>MWh</span></div>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: colors.text, marginBottom: 8 }}>
            <li>Reduced peak electricity demand</li>
            <li>Decreased strain on power infrastructure</li>
            <li>Efficient water use: 4,915 L/year</li>
          </ul>
        </div>
        {/* Strategic Benefits Card */}
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 14, boxShadow: '0 4px 18px 0 rgba(189,139,47,0.13)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', border: `1.5px solid ${gold}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Award size={28} color={gold} />
            <span style={{ fontWeight: 700, fontSize: 16, color: gold }}>Strategic Benefits</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {sdgs.map((sdg) => (
              <span key={sdg.label} style={{ background: sdg.color, color: '#fff', fontWeight: 700, borderRadius: 6, padding: '2px 10px', fontSize: 13, marginRight: 2 }}>{sdg.label}</span>
            ))}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: colors.text, marginBottom: 8 }}>
            <li>Enhanced ESG ratings and reporting</li>
            <li>Compliance with efficiency regulations</li>
            <li>Support for carbon reduction goals</li>
          </ul>
        </div>
      </div>
      {/* 15-Year Impact Bar */}
      <div style={{ marginTop: 18, background: '#eaf3f7', borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(47,147,111,0.10)', padding: 0, overflow: 'hidden', border: `1.5px solid ${darkGreen}` }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 36 }}>
          <div style={{ background: darkGreen, color: '#fff', fontWeight: 700, fontSize: 15, padding: '0 18px', height: '100%', display: 'flex', alignItems: 'center', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
            <Globe size={18} style={{ marginRight: 8 }} />
            15-Year Impact:
          </div>
          <div style={{ flex: 1, background: darkGreen, height: 12, borderRadius: 6, margin: '0 12px' }} />
          <div style={{ fontWeight: 700, color: darkGreen, fontSize: 15, paddingRight: 18 }}>
            3967.5 tonnes CO₂ avoided
          </div>
        </div>
      </div>
    </div>
  );
}

function ImplementationPlanPage() {
  const themeBlue = '#09425d';
  const accentGreen = '#1db56c';
  const accentGold = '#fac310';
  const accentRed = '#e74c3c';
  const accentYellow = '#f7b500';
  const timelineSteps = [
    {
      title: 'Site Assessment',
      week: 'Week 1',
      details: ['Site evaluation', 'Data collection'],
      icon: CalendarCheck,
      color: themeBlue,
    },
    {
      title: 'Engineering',
      week: 'Weeks 2-3',
      details: ['System design', 'Integration planning'],
      icon: Wrench,
      color: accentGreen,
    },
    {
      title: 'Procurement',
      week: 'Weeks 4-5',
      details: ['Equipment ordering', 'Quality validation'],
      icon: ClipboardCheck,
      color: accentGold,
    },
    {
      title: 'Installation',
      week: 'Weeks 6-7',
      details: ['System assembly', 'IoT integration'],
      icon: Settings,
      color: accentRed,
    },
    {
      title: 'Commissioning',
      week: 'Week 8',
      details: ['Testing & validation', 'Training & handover'],
      icon: CheckCircle,
      color: themeBlue,
    },
  ];
  const processCards = [
    {
      title: 'Pre-Installation Planning',
      desc: 'Comprehensive site survey and installation planning to identify optimal locations and connection points.',
      icon: ClipboardCheck,
      color: accentGreen,
      bg: '#e6f9f2',
      align: 'left',
    },
    {
      title: 'Off-Hours Installation',
      desc: 'Critical connections performed during scheduled downtime to minimize operational impact.',
      icon: Clock,
      color: accentGold,
      bg: '#fffbe6',
      align: 'right',
    },
    {
      title: 'Modular Implementation',
      desc: 'System installed in modules, allowing for phased implementation if required.',
      icon: Wrench,
      color: themeBlue,
      bg: '#eaf3f7',
      align: 'left',
    },
    {
      title: 'Testing & Commissioning',
      desc: 'Thorough system testing, performance validation, and operator training.',
      icon: CheckCircle,
      color: accentGreen,
      bg: '#e6f9f2',
      align: 'right',
    },
  ];
  const teamCards = [
    {
      title: 'Professional Engineers',
      desc: 'HVAC specialists with expert knowledge of evaporative cooling',
      icon: HardHat,
      color: accentGreen,
      bg: '#e6f9f2',
    },
    {
      title: 'Project Manager',
      desc: 'Dedicated point of contact for timely, on-budget delivery',
      icon: User2,
      color: themeBlue,
      bg: '#eaf3f7',
    },
    {
      title: 'Installation Technicians',
      desc: 'Specialized experts in adiabatic system installation',
      icon: Wrench,
      color: accentGold,
      bg: '#fffbe6',
    },
    {
      title: 'Support Team',
      desc: 'IoT specialists and technical support for system optimization',
      icon: Users,
      color: accentRed,
      bg: '#fdeeee',
    },
  ];
  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      <h2 style={{ ...typography.title, fontSize: 20, display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ color: themeBlue, fontWeight: 700, fontSize: 20, marginRight: 8 }}>6. Implementation Plan</span>
        <span style={{ flex: 1, height: 3, background: themeBlue, borderRadius: 2, marginLeft: 8, marginTop: 8 }} />
      </h2>
      {/* 6.1 Project Timeline - Horizontal Milestone Timeline */}
      <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 18, color: themeBlue }}>6.1 Project Timeline</h3>
      <div style={{ position: 'relative', marginBottom: 48, padding: '32px 0 0 0' }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: 60, right: 60, top: 44, height: 3, background: '#e3e8ee', zIndex: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          {timelineSteps.map((step, i) => (
            <div key={step.title} style={{ flex: 1, minWidth: 120, maxWidth: 180, textAlign: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <span style={{ background: step.color, color: '#fff', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, boxShadow: '0 2px 8px 0 rgba(9,66,93,0.10)', border: `3px solid #fff`, zIndex: 2 }}>
                  <step.icon size={22} color="#fff" />
                </span>
                <span style={{ fontWeight: 700, fontSize: 15, color: themeBlue, marginTop: 10 }}>{step.title}</span>
                <span style={{ fontSize: 13, color: step.color, fontWeight: 600, marginTop: 2 }}>{step.week}</span>
                <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none', fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                  {step.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
              </div>
          ))}
            </div>
      </div>
      {/* 6.2 & 6.3 Compact Side-by-Side Layout */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          marginBottom: 24,
          alignItems: 'flex-start',
        }}
      >
        {/* 6.2 Installation Process - Horizontal Process Bar */}
        <div
          style={{
            flex: 1,
            minWidth: 340,
            maxWidth: '100%',
            marginBottom: 0,
          }}
        >
          <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 18, color: themeBlue }}>
            6.2 Installation Process
          </h3>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'space-between' }}>
            {processCards.map((card) => (
              <div
                key={card.title}
                style={{
                  background: card.bg,
                  borderRadius: 12,
                  boxShadow: '0 2px 8px 0 rgba(9,66,93,0.08)',
                  padding: '16px 12px',
                  minWidth: 140,
                  maxWidth: 180,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    background: card.color,
                    color: '#fff',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                >
                  <card.icon size={16} color="#fff" />
                </span>
                <div style={{ fontWeight: 700, fontSize: 14, color: themeBlue, marginBottom: 4 }}>{card.title}</div>
                <div style={{ fontSize: 12, color: '#222', lineHeight: 1.5 }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 6.3 Your Project Team - Compact Grid */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            maxWidth: '100%',
            marginBottom: 0,
          }}
        >
          <h3 style={{ ...typography.section, fontSize: 16, marginTop: 0, marginBottom: 8, color: themeBlue }}>
            6.3 Your Project Team
          </h3>
          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
            Meet your dedicated implementation team.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {teamCards.map((card) => (
              <div
                key={card.title}
                style={{
                  background: card.bg,
                  borderRadius: 10,
                  boxShadow: '0 2px 8px 0 rgba(9,66,93,0.08)',
                  padding: '14px 10px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    background: card.color,
                    color: '#fff',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  <card.icon size={14} color="#fff" />
                </span>
            <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: themeBlue, marginBottom: 2 }}>{card.title}</div>
                  <div style={{ fontSize: 11, color: '#222' }}>{card.desc}</div>
              </div>
              </div>
            ))}
            </div>
          </div>
        {/* Responsive fix: stack on small screens */}
        <style>{`
          @media (max-width: 900px) {
            .chiller-report-container [data-impl-row] {
              flex-direction: column !important;
            }
            .chiller-report-container [data-impl-row] > div {
              min-width: 0 !important;
              max-width: 100% !important;
              margin-bottom: 24px !important;
            }
          }
        `}</style>
        </div>
    </div>
  );
}

function MaintenanceAndConclusionPage({ data }: { data: ChillerProposalData }) {
  const themeBlue = '#09425d';
  const accentGreen = '#1db56c';
  const accentGold = '#fac310';
  const accentRed = '#e74c3c';
  const accentGray = '#e3e8ee';
  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px 0 rgba(9,66,93,0.08)',
    padding: '28px 24px',
    flex: 1,
    minWidth: 260,
    maxWidth: 400,
    margin: 0,
  };
  const benefitItems: { icon: React.ElementType; color: string; text: string }[] = [
    { icon: CheckCircle, color: accentGreen, text: 'Regular system inspection and monitoring' },
    { icon: CheckCircle, color: accentGreen, text: 'Preventive maintenance to avoid breakdowns' },
    { icon: CheckCircle, color: accentGreen, text: 'Continuous optimization of system efficiency' },
    { icon: CheckCircle, color: accentGreen, text: 'Early detection of potential issues' },
    { icon: CheckCircle, color: accentGreen, text: 'Extended equipment lifespan' },
    { icon: CheckCircle, color: accentGreen, text: 'Guaranteed energy savings' },
  ];
  const componentItems: { icon: React.ElementType; color: string; text: string }[] = [
    { icon: Search, color: themeBlue, text: 'Visual inspection of all components' },
    { icon: BarChart2, color: themeBlue, text: 'Performance data analysis via IoT sensors' },
    { icon: Droplets, color: themeBlue, text: 'Water quality testing (TDS < 200 ppm)' },
    { icon: Layers, color: themeBlue, text: 'Media condition assessment' },
    { icon: Settings, color: themeBlue, text: 'Control system verification' },
    { icon: Zap, color: themeBlue, text: 'Energy efficiency validation' },
  ];
  const labels = getSystemLabel(data.systemType);
  const summaryBenefits: { icon: React.ElementType; color: string; text: string }[] = [
    { icon: Zap, color: accentGreen, text: `Energy savings of 20.0% on ${labels.powerLabel}` },
    { icon: IndianRupee, color: themeBlue, text: 'Annual savings of 2,096,640 rupees' },
    { icon: Activity, color: accentGold, text: 'ROI period of only 7 months' },
    { icon: Leaf, color: accentGreen, text: 'Carbon footprint reduction of 264.5 tonnes CO₂ annually' },
    { icon: Clock, color: themeBlue, text: 'Extended equipment lifetime and improved reliability' },
    { icon: Headphones, color: accentGold, text: 'Ongoing technical support and optimization' },
  ];
  // Icon mapping for Lucide
  type LucideIconType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  const LucideIcons: Record<string, LucideIconType> = {
    check: CheckCircle,
    search: Search,
    'bar-chart': BarChart2,
    droplet: Droplets,
    layers: Layers,
    settings: Settings,
    zap: Zap,
    rupee: IndianRupee,
    activity: Activity,
    leaf: Leaf,
    clock: Clock,
    headphones: Headphones,
  };
  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      {/* Section Title */}
      <h2 style={{ ...typography.title, fontSize: 22, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: themeBlue, fontWeight: 700, fontSize: 22, marginRight: 8 }}>7. Monthly Maintenance Service & Conclusion</span>
      </h2>
      <div style={{ height: 3, background: themeBlue, borderRadius: 2, width: 60, marginBottom: 18 }} />
      {/* Intro Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: colors.text, marginBottom: 18 }}>
        <Wrench size={22} color={themeBlue} />
        <span>Our commitment to your system's performance extends beyond installation with our comprehensive service program.</span>
          </div>
      {/* 7.1 Maintenance Program */}
      <h3 style={{ ...typography.section, fontSize: 17, color: themeBlue, marginTop: 18, marginBottom: 18 }}>7.1 SEE-Tech Professional Maintenance Program</h3>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
        {/* Service Benefits Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Star size={24} color={accentGold} />
            <span style={{ fontWeight: 700, fontSize: 16, color: themeBlue }}>Service Benefits</span>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 15, color: colors.text }}>
            {benefitItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Icon size={16} color={item.color} />
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Service Components Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Settings size={24} color={themeBlue} />
            <span style={{ fontWeight: 700, fontSize: 16, color: themeBlue }}>Service Components</span>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 15, color: colors.text }}>
            {componentItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Icon size={16} color={item.color} />
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* 7.2 Conclusion */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, marginTop: 8 }}>
        <Award size={20} color={accentGold} />
        <span style={{ fontWeight: 700, fontSize: 16, color: themeBlue }}>7.2 Conclusion</span>
      </div>
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 16 }}>
  SEE-Tech Solutions' adiabatic cooling system offers a proven, cost-effective approach to optimize your {labels.base}'s performance and achieve significant energy savings. By implementing our solution, <b>{data.clientName || 'Your Facility'}</b> will benefit from:
      </div>
      {/* Benefits Grid */}
      <div style={{ background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(9,66,93,0.06)', padding: '18px 18px', marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {summaryBenefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} color={item.color} />
                <span style={{ fontSize: 14, color: colors.text }}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 1.7 }}>
        Our digital twin technology has validated these projections through detailed simulation of your specific system, and our IoT-enabled monitoring will ensure continuous optimization and verification of savings. We are confident that this solution will deliver exceptional value and look forward to partnering with you on this project.
      </div>
    </div>
  );
}

interface ChillerReportTemplateProps {
  data: ChillerProposalData;
}

export default function ChillerReportTemplate({ data }: ChillerReportTemplateProps) {
  const { capital, base, possessive, powerLabel } = getSystemLabel(data.systemType);
  // Default technology highlights for the cover page
  const techHighlights = [
    {
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#E0F2FE"/><path d="M10 22V10h12v12H10zm2-2h8V12h-8v8z" fill="#0369A1"/></svg>
      ),
      title: 'Digital Twin Technology',
      description: 'Our solution leverages digital twin technology to simulate and optimize system performance before implementation, ensuring maximum efficiency.',
      tags: ['Real-time', 'Predictive'],
    },
    {
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#D1FAE5"/><path d="M16 10a6 6 0 016 6c0 3.314-6 10-6 10s-6-6.686-6-10a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" fill="#059669"/></svg>
      ),
      title: 'IoT-Enabled Monitoring',
      description: 'Real-time data collection and analysis through IoT sensors for performance optimization and predictive maintenance.',
      tags: ['Smart Control', 'Cloud Connected'],
    },
  ];

  return (
    <div className="chiller-report-container">
      {/** Adjust project name based on selected system type (replace existing type keyword or append) */}
      {(() => {
        const typeKeywords = ['Chiller', 'DX', 'VRF'];
        let adjusted = data.projectName || '';
        if (adjusted) {
          const found = typeKeywords.find(k => adjusted.toLowerCase().includes(k.toLowerCase()));
          if (found) {
            adjusted = adjusted.replace(new RegExp(found, 'gi'), capital);
          } else {
            adjusted = `${adjusted} - ${capital}`;
          }
        }
        (data as any)._adjustedProjectName = adjusted; // transient for passing below
        return null;
      })()}
      <CoverPage
        logoUrl="/seetech_logo.jpeg"
        companyName="SeeTech"
        tagline="Delivering Profits & Sustainability Together"
        title={`${capital} Optimization Proposal`}
        capacity={data.systemCapacity ? `for ${data.systemCapacity}` : ''}
        clientName={data.clientName}
        clientLocation={data.location}
        badgeText="INTELLIGENT SOLUTION"
  projectName={(data as any)._adjustedProjectName || data.projectName}
        date={new Date(data.date).toLocaleDateString()}
        techHighlights={techHighlights}
        footerNote={
          'Note: This proposal is generated by the system with detailed energy calculations and technical analysis.'
        }
  systemTypeLabel={capital}
      />
      <div className="page-break"></div>
      <TableOfContents />
      <div className="page-break"></div>
      <ExecutiveSummaryPage data={data} />
      <div className="page-break"></div>
      <SystemDescriptionPage />
      <div className="page-break"></div>
      <OperatingParametersAndTechnicalAnalysisPage data={data} />
      <div className="page-break"></div>
      <PHChartVisualizationPage data={data} />
      <div className="page-break"></div>
  <EnergySavingsAndFinancialAnalysisPage data={data} />
      <div className="page-break"></div>
      <LifeCycleCostAndROIPage />
      <div className="page-break"></div>
      <EnvironmentalImpactPage />
      <div className="page-break"></div>
      <ImplementationPlanPage />
      <div className="page-break"></div>
  <MaintenanceAndConclusionPage data={data} />
      <div className="page-break"></div>
    </div>
  );
}
