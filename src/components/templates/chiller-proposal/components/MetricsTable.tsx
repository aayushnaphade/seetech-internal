import React from 'react';
import { ChillerProposalData } from '../types';
import { calculateMetrics } from '../utils/calculations';

// Standardized color scheme
const colors = {
  primaryBlue: '#09425d',
  blueLight: '#eaf3f7',
  text: '#18344a',
  border: '#e3e8ee',
  white: '#fff',
};

export interface MetricRow {
  label: string;
  value: string;
  highlight?: boolean;
}

interface MetricsTableProps {
  metrics?: MetricRow[];
  data?: ChillerProposalData;
  title?: string;
  className?: string;
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ 
  metrics: customMetrics, 
  data, 
  title = "System Metrics",
  className = ""
}) => {
  // Generate metrics from data if not provided
  const generatedMetrics = data ? generateMetricsFromData(data) : [];
  const metricsToDisplay = customMetrics || generatedMetrics;

  return (
    <div className={className}>
      {title && (
        <h3 style={{ 
          fontSize: 16, 
          fontWeight: 600, 
          color: colors.primaryBlue, 
          marginBottom: 12,
          marginTop: 0 
        }}>
          {title}
        </h3>
      )}
      <div style={{ 
        margin: '0 0 24px 0', 
        boxShadow: '0 2px 16px 0 rgba(24,52,74,0.08)', 
        borderRadius: 10, 
        overflow: 'hidden', 
        background: colors.white 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: colors.primaryBlue }}>
              <th style={{ 
                color: colors.white, 
                fontWeight: 700, 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontSize: 14, 
                letterSpacing: 1 
              }}>
                METRIC
              </th>
              <th style={{ 
                color: colors.white, 
                fontWeight: 700, 
                padding: '12px 16px', 
                textAlign: 'left', 
                fontSize: 14, 
                letterSpacing: 1 
              }}>
                VALUE
              </th>
            </tr>
          </thead>
          <tbody>
            {metricsToDisplay.map((row, i) => (
              <tr 
                key={row.label} 
                style={{ 
                  background: row.highlight 
                    ? '#e6f9f2' 
                    : i % 2 === 0 
                      ? colors.blueLight 
                      : colors.white 
                }}
              >
                <td style={{ 
                  padding: '10px 16px', 
                  fontWeight: row.highlight ? 600 : 500, 
                  color: colors.text, 
                  borderBottom: `1px solid ${colors.border}`, 
                  fontSize: 14 
                }}>
                  {row.label}
                </td>
                <td style={{ 
                  padding: '10px 16px', 
                  color: colors.text, 
                  borderBottom: `1px solid ${colors.border}`, 
                  fontSize: 14,
                  fontWeight: row.highlight ? 600 : 400
                }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to generate metrics from ChillerProposalData
const generateMetricsFromData = (data: ChillerProposalData): MetricRow[] => {
  const calculatedMetrics = calculateMetrics(data);
  
  // Parse input values
  const currentPower = parseFloat(data.currentPowerConsumption) || 210;
  const proposedPower = parseFloat(data.proposedPowerConsumption) || 168;
  const systemCapacity = data.systemCapacity || '255 TR';
  const operatingHours = parseFloat(data.operatingHours) || 8760;
  const workingDays = Math.round(operatingHours / 24) || 320;
  const dailyHours = operatingHours / workingDays || 24;
  const powerReduction = ((currentPower - proposedPower) / currentPower * 100) || 20;
  
  // Calculate additional metrics
  const annualEnergyKWh = calculatedMetrics.annualEnergySaving;
  const annualCostSavings = calculatedMetrics.annualMonetarySaving;
  const waterConsumption = (systemCapacity.includes('TR') ? parseFloat(systemCapacity) * 19.3 : 4915.2);
  const investmentCost = parseFloat(data.investmentCost.replace(/[^\d.-]/g, '')) || 1150000;
  const paybackMonths = Math.round((investmentCost / annualCostSavings) * 12) || 7;
  const npv15Years = calculatedMetrics.lifetimeSavings - investmentCost;
  
  // Format currency values
  const formatCurrency = (value: number): string => {
    if (value >= 10000000) { // 1 Crore
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) { // 1 Lakh
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString('en-IN')}`;
    }
  };

  return [
    { label: 'Chiller Capacity', value: systemCapacity },
    { label: 'Working Days', value: `${workingDays} days` },
    { label: 'Working Hours', value: `${dailyHours} hours` },
    { label: 'Initial Power Consumption', value: `${currentPower.toFixed(1)} kW/hr` },
    { label: 'Actual Power Consumption', value: `${proposedPower.toFixed(1)} kW/hr` },
    { label: 'Expected Power Reduction', value: `${powerReduction.toFixed(1)}%`, highlight: true },
    { label: 'Annual Energy Savings', value: `${annualEnergyKWh.toLocaleString()} kWh/year`, highlight: true },
    { label: 'Annual Cost Savings', value: `${formatCurrency(annualCostSavings)}/year`, highlight: true },
    { label: 'Annual Water Consumption', value: `${waterConsumption.toFixed(1)} m³/year` },
    { label: 'Project Cost', value: formatCurrency(investmentCost) },
    { label: 'Simple Payback Period', value: `${paybackMonths} months`, highlight: true },
    { label: 'NPV (15 Years)', value: formatCurrency(npv15Years), highlight: true },
  ];
};

export default MetricsTable;