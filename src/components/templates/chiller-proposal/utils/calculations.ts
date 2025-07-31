import { ChillerProposalData, CalculatedMetrics } from '../types';

/**
 * 🧮 Calculation Utilities for Chiller Proposals
 */

export const calculateMetrics = (data: ChillerProposalData): CalculatedMetrics => {
  // Parse numeric values from strings
  const currentPower = parseFloat(data.currentPowerConsumption) || 0;
  const proposedPower = parseFloat(data.proposedPowerConsumption) || 0;
  const operatingHours = parseFloat(data.operatingHours) || 8760;
  const investmentCost = parseFloat(data.investmentCost.replace(/[^\d.-]/g, '')) || 0;

  // Calculate annual energy saving (kWh)
  const powerSaving = currentPower - proposedPower;
  const annualEnergySaving = powerSaving * operatingHours;

  // Calculate monetary savings (assuming ₹8.5/kWh average commercial rate)
  const energyRate = 8.5;
  const annualMonetarySaving = annualEnergySaving * energyRate;

  // Calculate CO2 reduction (kg CO2) - 0.82 kg CO2 per kWh average
  const co2Reduction = annualEnergySaving * 0.82;

  // Calculate lifetime savings (15 years)
  const lifetimeSavings = annualMonetarySaving * 15;

  // Calculate efficiency improvement percentage
  const currentEfficiency = parseFloat(data.currentEfficiency) || 0;
  const proposedEfficiency = parseFloat(data.proposedEfficiency) || 0;
  const efficiencyImprovement = ((currentEfficiency - proposedEfficiency) / currentEfficiency) * 100;

  return {
    annualEnergySaving,
    annualMonetarySaving,
    co2Reduction,
    lifetimeSavings,
    efficiencyImprovement
  };
};

/**
 * 💰 Formatting Utilities
 */
export const formatters = {
  currency: (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },

  percentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
  },

  energy: (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} GWh`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} MWh`;
    } else {
      return `${value.toFixed(0)} kWh`;
    }
  },

  co2: (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} tons`;
    } else {
      return `${value.toFixed(0)} kg`;
    }
  },

  power: (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} MW`;
    } else {
      return `${value.toFixed(0)} kW`;
    }
  }
};

/**
 * 🎨 Color Utilities for Data Visualization
 */
export const colors = {
  primary: '#0F4C75',
  secondary: '#3282B8',
  accent: '#0E86D4',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  neutral: '#6B7280',

  // Gradient definitions
  gradients: {
    efficiency: ['#22C55E', '#16A34A'],
    savings: ['#0E86D4', '#3282B8'],
    cost: ['#EF4444', '#DC2626'],
    neutral: ['#6B7280', '#4B5563']
  }
};

/**
 * 📊 Chart Data Helpers
 */
export const chartHelpers = {
  formatChartValue: (value: number, type: 'currency' | 'percentage' | 'energy' | 'power'): string => {
    switch (type) {
      case 'currency':
        return formatters.currency(value);
      case 'percentage':
        return formatters.percentage(value);
      case 'energy':
        return formatters.energy(value);
      case 'power':
        return formatters.power(value);
      default:
        return value.toString();
    }
  },

  getColorByValue: (value: number, threshold: { good: number; warning: number }): string => {
    if (value >= threshold.good) return colors.success;
    if (value >= threshold.warning) return colors.warning;
    return colors.danger;
  }
};


