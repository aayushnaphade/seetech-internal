"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ChillerProposalData, CalculatedMetrics } from '../types';
import { Section } from './Layout';

interface ChartsProps {
  data: ChillerProposalData;
  metrics: CalculatedMetrics;
}

/**
 * 📊 Compact Charts for Reports - Clean, Professional Data Visualization
 */
export const Charts: React.FC<ChartsProps> = ({ data, metrics }) => {
  // Efficiency Comparison Data
  const efficiencyData = [
    {
      name: 'Current System',
      efficiency: parseFloat(data.currentEfficiency),
      power: parseFloat(data.currentPowerConsumption),
      fill: '#EF4444'
    },
    {
      name: 'Proposed System',
      efficiency: parseFloat(data.proposedEfficiency),
      power: parseFloat(data.proposedPowerConsumption),
      fill: '#22C55E'
    }
  ];

  // Financial Projection Data
  const financialData = [
    { year: 'Year 1', savings: metrics.annualMonetarySaving, cumulative: metrics.annualMonetarySaving },
    { year: 'Year 2', savings: metrics.annualMonetarySaving, cumulative: metrics.annualMonetarySaving * 2 },
    { year: 'Year 3', savings: metrics.annualMonetarySaving, cumulative: metrics.annualMonetarySaving * 3 },
    { year: 'Year 4', savings: metrics.annualMonetarySaving, cumulative: metrics.annualMonetarySaving * 4 },
    { year: 'Year 5', savings: metrics.annualMonetarySaving, cumulative: metrics.annualMonetarySaving * 5 }
  ];

  // Cost Breakdown Data
  const costBreakdown = [
    { name: 'Equipment', value: 65, fill: '#3282B8' },
    { name: 'Installation', value: 20, fill: '#0E86D4' },
    { name: 'Engineering', value: 10, fill: '#0F4C75' },
    { name: 'Commissioning', value: 5, fill: '#22C55E' }
  ];

  const COLORS = ['#0F4C75', '#3282B8', '#0E86D4', '#22C55E'];

  return (
    <Section title="Technical & Financial Analysis">
      {/* Efficiency Comparison */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          fontSize: 'var(--chiller-fs-h3)', 
          color: 'var(--chiller-primary)',
          marginBottom: '16px',
          fontWeight: 600
        }}>
          System Efficiency Comparison
        </h3>
        <div style={{ height: '200px', width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                fontSize={11}
                stroke="#64748B"
              />
              <YAxis 
                fontSize={11}
                stroke="#64748B"
                label={{ value: 'kW/TR', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value, name) => [
                  `${value} kW/TR`,
                  name === 'efficiency' ? 'Efficiency' : 'Power'
                ]}
              />
              <Bar dataKey="efficiency" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Projections */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div>
          <h3 style={{ 
            fontSize: 'var(--chiller-fs-h3)', 
            color: 'var(--chiller-primary)',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            5-Year Savings Projection
          </h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer>
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="year" 
                  fontSize={10}
                  stroke="#64748B"
                />
                <YAxis 
                  fontSize={10}
                  stroke="#64748B"
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#22C55E" 
                  strokeWidth={3}
                  dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 style={{ 
            fontSize: 'var(--chiller-fs-h3)', 
            color: 'var(--chiller-primary)',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            Investment Breakdown
          </h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '11px',
            marginTop: '8px'
          }}>
            {costBreakdown.map((item, index) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: COLORS[index],
                  marginRight: '6px',
                  borderRadius: '2px'
                }} />
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
