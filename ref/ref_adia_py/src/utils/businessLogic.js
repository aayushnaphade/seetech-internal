/**
 * Business logic and calculations for the adiabatic cooling proposal system.
 * React version - converted from Python business logic
 */

import {
  ACTUAL_POWER_KW,
  OPERATING_HOURS,
  WORKING_DAYS,
  ELECTRICITY_TARIFF,
  TOTAL_CFM,
  WATER_CONSUMPTION,
  WATER_COST,
  PROJECT_COST,
  MAINTENANCE_PCT,
  INFLATION_RATE,
  DISCOUNT_RATE,
  PROJECT_LIFE,
  GRID_EMISSION_FACTOR,
  EXPECTED_POWER_REDUCTION_PCT,
  TEMP_REDUCTION_C,
  THERMODYNAMIC_DATA,
  CLIENT_NAME,
} from './constants.js';

/**
 * Format number with Indian notation (e.g., 10,00,000 instead of 1,000,000)
 */
export function formatIndianNumber(number, withWords = false) {
  // Convert to Indian format
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
  
  if (withWords) {
    let words = "";
    if (number >= 10000000) { // 1 crore or more
      const crValue = number / 10000000;
      words = ` (${crValue.toFixed(2)} Cr)`;
    } else if (number >= 100000) { // 1 lakh or more
      const lakhValue = number / 100000;
      words = ` (${lakhValue.toFixed(2)} L)`;
    }
    return `${formatted}${words}`;
  }
  
  return formatted;
}

/**
 * Calculate power savings from condenser temperature reduction
 */
export function calculatePowerSavings() {
  return EXPECTED_POWER_REDUCTION_PCT;
}

/**
 * Calculate annual energy and cost savings
 */
export function calculateEnergySavings(powerSavingPct) {
  // Calculate annual energy consumption based on actual power consumption
  const annualEnergyKwh = ACTUAL_POWER_KW * OPERATING_HOURS * WORKING_DAYS;
  
  // Calculate energy savings
  const annualEnergySavingKwh = annualEnergyKwh * (powerSavingPct / 100);
  
  // Calculate annual monetary savings
  const annualMonetarySaving = annualEnergySavingKwh * ELECTRICITY_TARIFF;
  
  return {
    initialPowerKw: ACTUAL_POWER_KW,
    annualEnergySavingKwh,
    annualMonetarySaving
  };
}

/**
 * Calculate water and maintenance costs
 */
export function calculateOperatingCosts() {
  // Water consumption calculation: 4 liters per 1000 CFM
  const hourlyWaterConsumption = (TOTAL_CFM / 1000) * WATER_CONSUMPTION;
  const annualWaterConsumption = hourlyWaterConsumption * OPERATING_HOURS * WORKING_DAYS;
  const annualWaterConsumptionM3 = annualWaterConsumption / 1000;
  const annualWaterCost = annualWaterConsumptionM3 * WATER_COST;
  
  // Maintenance cost
  const annualMaintenanceCost = PROJECT_COST * (MAINTENANCE_PCT / 100);
  
  // Total operating cost
  const totalAnnualOperatingCost = annualWaterCost + annualMaintenanceCost;
  
  return {
    annualWaterConsumption: annualWaterConsumptionM3,
    annualWaterCost,
    annualMaintenanceCost,
    totalAnnualOperatingCost
  };
}

/**
 * Calculate simple payback period in months
 */
export function calculateROI(netAnnualSavings) {
  const years = PROJECT_COST / netAnnualSavings;
  const months = Math.round(years * 12);
  return months;
}

/**
 * Perform life cycle cost analysis
 */
export function calculateLCC(annualMonetarySaving, totalAnnualOperatingCost) {
  const lccTable = [];
  let cumulativeDcf = -PROJECT_COST;
  
  // Year 0 (initial investment)
  lccTable.push({
    year: 0,
    initialInvestment: -PROJECT_COST,
    annualSavingsNominal: 0,
    annualOMCostNominal: 0,
    netAnnualCashFlowNominal: -PROJECT_COST,
    netAnnualCashFlowDiscounted: -PROJECT_COST,
    cumulativeDiscountedCashFlow: cumulativeDcf
  });
  
  // Calculate for each year
  for (let year = 1; year <= PROJECT_LIFE; year++) {
    const inflationFactor = Math.pow(1 + INFLATION_RATE / 100, year);
    const discountFactor = 1 / Math.pow(1 + DISCOUNT_RATE / 100, year);
    
    const nominalSavings = annualMonetarySaving * inflationFactor;
    const nominalOMCost = totalAnnualOperatingCost * inflationFactor;
    const nominalCashFlow = nominalSavings - nominalOMCost;
    const discountedCashFlow = nominalCashFlow * discountFactor;
    
    cumulativeDcf += discountedCashFlow;
    
    lccTable.push({
      year,
      initialInvestment: 0,
      annualSavingsNominal: Math.round(nominalSavings),
      annualOMCostNominal: Math.round(nominalOMCost),
      netAnnualCashFlowNominal: Math.round(nominalCashFlow),
      netAnnualCashFlowDiscounted: Math.round(discountedCashFlow),
      cumulativeDiscountedCashFlow: Math.round(cumulativeDcf)
    });
  }
  
  const npv = cumulativeDcf;
  
  return { lccTable, npv };
}

/**
 * Calculate greenhouse gas emission savings
 */
export function calculateGHGSavings(annualEnergySavingKwh) {
  const annualGhgSavingKg = annualEnergySavingKwh * GRID_EMISSION_FACTOR;
  const annualGhgSavingTonnes = annualGhgSavingKg / 1000;
  
  return {
    annualGhgSavingKg,
    annualGhgSavingTonnes
  };
}

/**
 * Calculate all results for the proposal
 */
export function calculateResults() {
  // Calculate key metrics
  const powerSavingPct = calculatePowerSavings();
  const energySavings = calculateEnergySavings(powerSavingPct);
  const operatingCosts = calculateOperatingCosts();
  const netAnnualSavings = energySavings.annualMonetarySaving - operatingCosts.totalAnnualOperatingCost;
  const roiPeriod = calculateROI(netAnnualSavings);
  const lccAnalysis = calculateLCC(energySavings.annualMonetarySaving, operatingCosts.totalAnnualOperatingCost);
  const ghgSavings = calculateGHGSavings(energySavings.annualEnergySavingKwh);
  
  // Format temperature reduction text
  const tempReductionText = `${TEMP_REDUCTION_C.toFixed(1)}°C (from ${(THERMODYNAMIC_DATA.Tcond_act - 273.15).toFixed(1)}°C to ${(THERMODYNAMIC_DATA.Tcond_practical - 273.15).toFixed(1)}°C)`;
  
  // Create summary data
  const summaryData = [
    { label: 'Power Saving', value: `${powerSavingPct.toFixed(1)}%`, icon: 'fa-bolt' },
    { label: 'Annual Energy Saving', value: `${(energySavings.annualEnergySavingKwh / 1000).toFixed(0)} MWh`, icon: 'fa-leaf' },
    { label: 'Annual Cost Saving', value: formatIndianNumber(energySavings.annualMonetarySaving), icon: 'fa-coins' },
    { label: 'Simple Payback Period', value: `${Math.floor(roiPeriod / 12)}y ${roiPeriod % 12}m`, icon: 'fa-clock' },
    { label: 'Net Present Value', value: formatIndianNumber(lccAnalysis.npv), icon: 'fa-chart-line' },
    { label: 'CO₂ Emission Reduction', value: `${ghgSavings.annualGhgSavingTonnes.toFixed(1)} tonnes/year`, icon: 'fa-tree' }
  ];
  
  // Create environmental data
  const environmentalData = [
    { label: 'Temperature Reduction', value: tempReductionText, icon: 'fa-thermometer-half' },
    { label: 'Water Consumption', value: `${operatingCosts.annualWaterConsumption.toFixed(0)} m³/year`, icon: 'fa-tint' },
    { label: 'Annual Water Cost', value: formatIndianNumber(operatingCosts.annualWaterCost), icon: 'fa-hand-holding-water' },
    { label: 'Maintenance Cost', value: formatIndianNumber(operatingCosts.annualMaintenanceCost), icon: 'fa-tools' }
  ];
  
  return {
    powerSavingPct,
    annualEnergySavingKwh: energySavings.annualEnergySavingKwh,
    annualMonetarySaving: energySavings.annualMonetarySaving,
    annualWaterConsumption: operatingCosts.annualWaterConsumption,
    annualWaterCost: operatingCosts.annualWaterCost,
    annualMaintenanceCost: operatingCosts.annualMaintenanceCost,
    totalAnnualOperatingCost: operatingCosts.totalAnnualOperatingCost,
    netAnnualSavings,
    roiPeriod,
    lccTable: lccAnalysis.lccTable,
    lccSummary: lccAnalysis,
    npv: lccAnalysis.npv,
    annualGhgSavingKg: ghgSavings.annualGhgSavingKg,
    annualGhgSavingTonnes: ghgSavings.annualGhgSavingTonnes,
    summaryData,
    environmentalData,
    tempReductionText
  };
}