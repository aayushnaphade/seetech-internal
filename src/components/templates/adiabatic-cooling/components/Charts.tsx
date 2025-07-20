"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { GaugeChartConfig, BarChartConfig, PieChartConfig, ChartDataPoint } from '../types';

// @ts-ignore - react-plotly.js types
// Dynamic import for Plotly (SSR-safe)
const Plot: any = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ChartContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * 📊 Chart Container Component
 * Consistent wrapper for all chart types with professional styling
 */
export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`chart-container ${className}`}>
      <h4 className="chart-title">{title}</h4>
      {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  );
};

/**
 * 🎯 Professional Gauge Chart
 * High-quality gauge using Plotly with professional color schemes
 */
export const GaugeChart: React.FC<GaugeChartConfig> = ({
  value,
  maxValue,
  title,
  unit,
  colorScheme = 'efficiency',
  reference,
  changeValue
}) => {
  // Color schemes based on context
  const colorSchemes = {
    efficiency: {
      steps: [
        { range: [0, maxValue * 0.3], color: '#ffcccc' },
        { range: [maxValue * 0.3, maxValue * 0.6], color: '#ffeb9c' },
        { range: [maxValue * 0.6, maxValue * 0.8], color: '#b8e6b8' },
        { range: [maxValue * 0.8, maxValue], color: '#2E936E' }
      ],
      bar: { color: '#1D7AA3' }
    },
    savings: {
      steps: [
        { range: [0, maxValue * 0.25], color: '#ffcccc' },
        { range: [maxValue * 0.25, maxValue * 0.5], color: '#ffeb9c' },
        { range: [maxValue * 0.5, maxValue * 0.75], color: '#b8e6b8' },
        { range: [maxValue * 0.75, maxValue], color: '#2E936E' }
      ],
      bar: { color: '#2E936E' }
    },
    performance: {
      steps: [
        { range: [0, maxValue * 0.4], color: '#ffcccc' },
        { range: [maxValue * 0.4, maxValue * 0.7], color: '#ffeb9c' },
        { range: [maxValue * 0.7, maxValue * 0.9], color: '#b8e6b8' },
        { range: [maxValue * 0.9, maxValue], color: '#2E936E' }
      ],
      bar: { color: '#0A435C' }
    }
  };

  const scheme = colorSchemes[colorScheme];

  const gaugeData = [{
    type: 'indicator',
    mode: 'gauge+number+delta',
    value: value,
    domain: { x: [0, 1], y: [0, 1] },
    title: { 
      text: title,
      font: { 
        family: 'Montserrat, sans-serif',
        size: 16,
        color: '#0A435C'
      }
    },
    delta: reference ? { 
      reference: reference,
      increasing: { color: '#2E936E' },
      decreasing: { color: '#B23A48' },
      font: { size: 14 }
    } : undefined,
    gauge: {
      axis: { 
        range: [null, maxValue],
        tickfont: { size: 12, color: '#64748B' }
      },
      bar: scheme.bar,
      steps: scheme.steps,
      threshold: {
        line: { color: '#B23A48', width: 3 },
        thickness: 0.75,
        value: maxValue * 0.9
      }
    },
    number: {
      font: { 
        family: 'Montserrat, sans-serif',
        size: 24,
        color: '#0A435C'
      },
      suffix: ` ${unit}`
    }
  }];

  const layout = {
    width: 300,
    height: 250,
    margin: { t: 40, r: 40, l: 40, b: 20 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      family: 'Inter, sans-serif',
      size: 12,
      color: '#2D3B45'
    }
  };

  const config = {
    displayModeBar: false,
    responsive: true,
    staticPlot: true  // Prevents interaction issues in PDFs
  };

  return (
    <div className="gauge-container">
      <Plot
        data={gaugeData as any}
        layout={layout}
        config={config}
      />
    </div>
  );
};

/**
 * 📊 Professional Bar Chart
 * Clean bar chart with semantic color coding
 */
export const ProfessionalBarChart: React.FC<BarChartConfig> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  colorMapping
}) => {
  const getBarColor = (dataPoint: ChartDataPoint): string => {
    if (dataPoint.color) return dataPoint.color;
    
    // Semantic color assignment
    if (dataPoint.name.toLowerCase().includes('saving') || 
        dataPoint.name.toLowerCase().includes('proposed') ||
        dataPoint.name.toLowerCase().includes('improvement')) {
      return colorMapping.positive;
    }
    if (dataPoint.name.toLowerCase().includes('current') || 
        dataPoint.name.toLowerCase().includes('cost')) {
      return colorMapping.negative;
    }
    return colorMapping.neutral;
  };

  return (
    <ChartContainer title={title}>
      <BarChart
        width={400}
        height={250}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#D9E2EC' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#64748B' }}
          axisLine={{ stroke: '#D9E2EC' }}
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #D9E2EC',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(10, 67, 92, 0.15)',
            fontFamily: 'Inter, sans-serif'
          }}
        />
        <Bar 
          dataKey="value" 
          fill="#1D7AA3"
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

/**
 * 🥧 Professional Pie Chart
 * Clean pie chart with professional color palette
 */
export const ProfessionalPieChart: React.FC<PieChartConfig> = ({
  data,
  title,
  showLegend = true,
  colors = ['#2E936E', '#1D7AA3', '#F68D60', '#B23A48', '#7CDBD5']
}) => {
  return (
    <ChartContainer title={title}>
      <PieChart width={350} height={250}>
        <Pie
          data={data}
          cx={175}
          cy={125}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          labelLine={false}
          fontSize={11}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors[index % colors.length]} 
            />
          ))}
        </Pie>
        {showLegend && (
          <Legend 
            wrapperStyle={{
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }}
          />
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #D9E2EC',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(10, 67, 92, 0.15)',
            fontFamily: 'Inter, sans-serif'
          }}
        />
      </PieChart>
    </ChartContainer>
  );
};

interface ComparisonChartProps {
  currentValue: number;
  proposedValue: number;
  title: string;
  unit: string;
  improvementPercentage: number;
}

/**
 * 📈 Before/After Comparison Chart
 * Specialized chart for showing improvements
 */
export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  currentValue,
  proposedValue,
  title,
  unit,
  improvementPercentage
}) => {
  const data = [
    { name: 'Current', value: currentValue, color: '#B23A48' },
    { name: 'Proposed', value: proposedValue, color: '#2E936E' }
  ];

  return (
    <div className="comparison-chart-container">
      <ChartContainer 
        title={title}
        subtitle={`${improvementPercentage > 0 ? '+' : ''}${improvementPercentage.toFixed(1)}% improvement`}
      >
        <BarChart
          width={300}
          height={200}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#D9E2EC' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={{ stroke: '#D9E2EC' }}
            label={{ value: unit, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #D9E2EC',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(10, 67, 92, 0.15)',
              fontFamily: 'Inter, sans-serif'
            }}
            formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, '']}
          />
          <Bar 
            dataKey="value" 
            fill="#1D7AA3"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#1D7AA3'} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      
      {/* Improvement indicator */}
      <div style={{
        textAlign: 'center',
        marginTop: 'var(--spacing-small)',
        padding: 'var(--spacing-small)',
        backgroundColor: improvementPercentage > 0 ? 'rgba(46, 147, 110, 0.1)' : 'rgba(178, 58, 72, 0.1)',
        borderRadius: '6px',
        border: `1px solid ${improvementPercentage > 0 ? '#2E936E' : '#B23A48'}`
      }}>
        <span style={{
          color: improvementPercentage > 0 ? '#2E936E' : '#B23A48',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-small)'
        }}>
          {improvementPercentage > 0 ? '↗' : '↘'} {Math.abs(improvementPercentage).toFixed(1)}% 
          {improvementPercentage > 0 ? ' improvement' : ' reduction'}
        </span>
      </div>
    </div>
  );
};

interface MetricGaugesProps {
  metrics: {
    value: number;
    maxValue: number;
    title: string;
    unit: string;
    target?: number;
  }[];
}

/**
 * 🎯 Multiple Metric Gauges
 * Grid of small gauges for dashboard-style overview
 */
export const MetricGauges: React.FC<MetricGaugesProps> = ({ metrics }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--spacing-medium)',
      marginTop: 'var(--spacing-medium)'
    }}>
      {metrics.map((metric, index) => (
        <GaugeChart
          key={index}
          value={metric.value}
          maxValue={metric.maxValue}
          title={metric.title}
          unit={metric.unit}
          colorScheme="performance"
          reference={metric.target}
        />
      ))}
    </div>
  );
};

export default ChartContainer;
