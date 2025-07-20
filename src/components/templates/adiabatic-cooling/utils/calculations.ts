/**
 * 🧮 Adiabatic Cooling Calculations Utility
 * Professional Engineering Calculations for Proposal Generation
 */

import {
  AdiabaticCoolingProposalData,
  CalculatedMetrics,
  PerformanceMetrics,
  FinancialMetrics,
  EnvironmentalMetrics,
  FinancialProjection
} from '../types';

// 🔢 Constants from engineering standards
export const ENGINEERING_CONSTANTS = {
  // Working parameters
  WORKING_HOURS_PER_DAY: 24,
  WORKING_DAYS_PER_YEAR: 320,
  
  // Water usage rates (L/min per TR)
  WATER_USAGE_PER_TR: 2.5,
  MINUTES_PER_HOUR: 60,
  
  // CO2 emission factors
  CO2_PER_KWH: 0.82, // kg CO2 per kWh (India grid average)
  
  // Financial constants
  DISCOUNT_RATE: 0.08, // 8% discount rate
  PROJECT_LIFETIME: 20, // years
  
  // Environmental equivalents
  TREES_PER_TON_CO2: 40, // Trees needed to offset 1 ton CO2/year
  
  // Efficiency standards
  TYPICAL_CHILLER_COP: 3.5,
  HIGH_EFFICIENCY_COP: 5.5
} as const;

/**
 * 📊 Calculate all key metrics from proposal data
 */
export function calculateMetrics(data: AdiabaticCoolingProposalData): CalculatedMetrics {
  const beforePowerKW = parseFloat(data.currentPower);
  const savingPercentage = parseFloat(data.expectedSaving);
  const afterPowerKW = beforePowerKW * (1 - savingPercentage / 100);
  const savingKW = beforePowerKW - afterPowerKW;
  
  const annualHours = ENGINEERING_CONSTANTS.WORKING_HOURS_PER_DAY * 
                     ENGINEERING_CONSTANTS.WORKING_DAYS_PER_YEAR;
  
  const annualEnergySaving = savingKW * annualHours; // kWh/year
  const electricityRate = parseFloat(data.electricityRate);
  const annualMonetarySaving = annualEnergySaving * electricityRate;
  
  // Water calculations
  const systemCapacityTR = parseFloat(data.systemCapacity);
  const waterUsageReduction = ENGINEERING_CONSTANTS.WATER_USAGE_PER_TR * 
                             ENGINEERING_CONSTANTS.MINUTES_PER_HOUR * 
                             systemCapacityTR * (savingPercentage / 100);
  
  const annualWaterSaving = waterUsageReduction * annualHours;
  
  // Efficiency calculations
  const currentCOP = ENGINEERING_CONSTANTS.TYPICAL_CHILLER_COP;
  const proposedCOP = currentCOP * (1 + savingPercentage / 100);
  const efficiencyImprovement = ((proposedCOP - currentCOP) / currentCOP) * 100;
  
  return {
    beforePowerKW,
    afterPowerKW,
    savingKW,
    annualEnergySaving,
    annualMonetarySaving,
    waterUsageReduction,
    annualWaterSaving,
    currentCOP,
    proposedCOP,
    efficiencyImprovement
  };
}

/**
 * ⚡ Calculate performance metrics
 */
export function calculatePerformanceMetrics(data: AdiabaticCoolingProposalData): PerformanceMetrics {
  const coolingCapacity = parseFloat(data.systemCapacity);
  const proposedEfficiency = parseFloat(data.proposedEfficiency);
  const ambientTemp = parseFloat(data.ambientTemperature);
  const wetBulbTemp = parseFloat(data.wetBulbTemperature);
  const chillWaterTemp = parseFloat(data.chillWaterTemperature);
  
  // Calculate COP from efficiency improvement
  const baseCOP = ENGINEERING_CONSTANTS.TYPICAL_CHILLER_COP;
  const coefficientOfPerformance = baseCOP * (proposedEfficiency / 100);
  
  // Energy Efficiency Ratio (EER) calculation
  const energyEfficiencyRatio = coefficientOfPerformance * 3.412; // Convert COP to EER
  
  // Part load performance estimation
  const loadFactor = parseFloat(data.loadFactor) / 100;
  const partLoadPerformance = coefficientOfPerformance * (0.8 + 0.2 * loadFactor);
  
  // Temperature approaches
  const temperatureApproach = chillWaterTemp - wetBulbTemp;
  const wetBulbApproach = ambientTemp - wetBulbTemp;
  
  return {
    coolingCapacity,
    energyEfficiencyRatio,
    coefficientOfPerformance,
    partLoadPerformance,
    temperatureApproach,
    wetBulbApproach
  };
}

/**
 * 💰 Calculate financial metrics
 */
export function calculateFinancialMetrics(
  data: AdiabaticCoolingProposalData,
  calculatedMetrics: CalculatedMetrics
): FinancialMetrics {
  const totalInvestment = parseFloat(data.investmentCost);
  const annualSavings = calculatedMetrics.annualMonetarySaving;
  
  // Simple payback period
  const paybackPeriod = totalInvestment / annualSavings;
  
  // NPV calculation
  const discountRate = ENGINEERING_CONSTANTS.DISCOUNT_RATE;
  const projectLife = ENGINEERING_CONSTANTS.PROJECT_LIFETIME;
  
  let npv = -totalInvestment; // Initial investment
  for (let year = 1; year <= projectLife; year++) {
    npv += annualSavings / Math.pow(1 + discountRate, year);
  }
  
  // IRR approximation (simplified)
  const irr = (annualSavings / totalInvestment) * 100;
  
  // Cost per ton saved
  const costPerTonSaved = totalInvestment / parseFloat(data.systemCapacity);
  
  return {
    totalInvestment,
    annualSavings,
    paybackPeriod,
    netPresentValue: npv,
    internalRateOfReturn: irr,
    costPerTonSaved
  };
}

/**
 * 🌍 Calculate environmental impact metrics
 */
export function calculateEnvironmentalMetrics(
  calculatedMetrics: CalculatedMetrics
): EnvironmentalMetrics {
  const annualEnergySaving = calculatedMetrics.annualEnergySaving;
  const annualWaterSaving = calculatedMetrics.annualWaterSaving;
  
  // CO2 calculations
  const co2ReductionAnnual = annualEnergySaving * ENGINEERING_CONSTANTS.CO2_PER_KWH;
  const co2ReductionLifetime = co2ReductionAnnual * ENGINEERING_CONSTANTS.PROJECT_LIFETIME;
  
  // Water calculations
  const waterSavingAnnual = annualWaterSaving;
  const waterSavingLifetime = waterSavingAnnual * ENGINEERING_CONSTANTS.PROJECT_LIFETIME;
  
  // Tree equivalent calculation
  const co2ReductionTons = co2ReductionAnnual / 1000;
  const equivalentTreesPlanted = co2ReductionTons * ENGINEERING_CONSTANTS.TREES_PER_TON_CO2;
  
  // Carbon footprint reduction percentage (compared to typical facility)
  const carbonFootprintReduction = (co2ReductionAnnual / (annualEnergySaving + co2ReductionAnnual)) * 100;
  
  return {
    co2ReductionAnnual,
    co2ReductionLifetime,
    waterSavingAnnual,
    waterSavingLifetime,
    equivalentTreesPlanted,
    carbonFootprintReduction
  };
}

/**
 * 📈 Generate financial projections
 */
export function generateFinancialProjections(
  financialMetrics: FinancialMetrics,
  years: number = 10
): FinancialProjection[] {
  const projections: FinancialProjection[] = [];
  let cumulativeSavings = 0;
  
  for (let year = 1; year <= years; year++) {
    const annualSavings = financialMetrics.annualSavings;
    cumulativeSavings += annualSavings;
    
    const netBenefit = cumulativeSavings - financialMetrics.totalInvestment;
    
    projections.push({
      year,
      savings: annualSavings,
      cumulativeSavings,
      investment: year === 1 ? financialMetrics.totalInvestment : 0,
      netBenefit
    });
  }
  
  return projections;
}

/**
 * 🎯 Format numbers for display
 */
export const formatters = {
  currency: (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  },
  
  number: (value: number, decimals: number = 1): string => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    }).format(value);
  },
  
  percentage: (value: number, decimals: number = 1): string => {
    return `${formatters.number(value, decimals)}%`;
  },
  
  energy: (value: number): string => {
    if (value >= 1000000) {
      return `${formatters.number(value / 1000000, 1)} GWh`;
    } else if (value >= 1000) {
      return `${formatters.number(value / 1000, 1)} MWh`;
    } else {
      return `${formatters.number(value, 0)} kWh`;
    }
  },
  
  water: (value: number): string => {
    if (value >= 1000000) {
      return `${formatters.number(value / 1000000, 1)} ML`;
    } else if (value >= 1000) {
      return `${formatters.number(value / 1000, 1)} KL`;
    } else {
      return `${formatters.number(value, 0)} L`;
    }
  },
  
  co2: (value: number): string => {
    if (value >= 1000) {
      return `${formatters.number(value / 1000, 1)} tons`;
    } else {
      return `${formatters.number(value, 0)} kg`;
    }
  }
};

/**
 * 🔍 Validate proposal data
 */
export function validateProposalData(data: AdiabaticCoolingProposalData): string[] {
  const errors: string[] = [];
  
  // Required fields validation
  if (!data.projectName.trim()) errors.push('Project name is required');
  if (!data.clientName.trim()) errors.push('Client name is required');
  if (!data.currentPower || parseFloat(data.currentPower) <= 0) {
    errors.push('Current power must be greater than 0');
  }
  if (!data.expectedSaving || parseFloat(data.expectedSaving) <= 0 || parseFloat(data.expectedSaving) > 100) {
    errors.push('Expected saving must be between 0-100%');
  }
  if (!data.electricityRate || parseFloat(data.electricityRate) <= 0) {
    errors.push('Electricity rate must be greater than 0');
  }
  if (!data.systemCapacity || parseFloat(data.systemCapacity) <= 0) {
    errors.push('System capacity must be greater than 0');
  }
  if (!data.investmentCost || parseFloat(data.investmentCost) <= 0) {
    errors.push('Investment cost must be greater than 0');
  }
  
  return errors;
}

/**
 * 📊 Generate chart data for visualizations
 */
export function generateChartData(
  calculatedMetrics: CalculatedMetrics,
  financialMetrics: FinancialMetrics,
  environmentalMetrics: EnvironmentalMetrics
) {
  return {
    powerComparison: [
      { name: 'Current', value: calculatedMetrics.beforePowerKW, color: '#B23A48' },
      { name: 'Proposed', value: calculatedMetrics.afterPowerKW, color: '#2E936E' },
      { name: 'Savings', value: calculatedMetrics.savingKW, color: '#1D7AA3' }
    ],
    
    efficiencyComparison: [
      { name: 'Current COP', value: calculatedMetrics.currentCOP, color: '#B23A48' },
      { name: 'Proposed COP', value: calculatedMetrics.proposedCOP, color: '#2E936E' }
    ],
    
    financialBreakdown: [
      { name: 'Investment', value: financialMetrics.totalInvestment, color: '#B23A48' },
      { name: 'Annual Savings', value: financialMetrics.annualSavings, color: '#2E936E' },
      { name: 'NPV', value: financialMetrics.netPresentValue, color: '#1D7AA3' }
    ],
    
    environmentalImpact: [
      { name: 'CO₂ Reduction', value: environmentalMetrics.co2ReductionAnnual, color: '#2E936E' },
      { name: 'Water Savings', value: environmentalMetrics.waterSavingAnnual / 1000, color: '#7CDBD5' }
    ]
  };
}
