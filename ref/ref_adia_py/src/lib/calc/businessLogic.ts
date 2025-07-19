/**
 * Business logic and financial calculations
 * Ported from calculations/business_logic.py
 */

import { formatCurrency } from '../utils/currencyFormatter';
import { roundNumber } from '../utils/numberRounding';

export interface ProjectConstants {
  clientName: string;
  clientLocation: string;
  reportDate: Date;
  preparedBy: string;
  chillerCapacityTR: number;
  chillerType: string;
  workingDays: number;
  operatingHours: number;
  initialPowerKW: number;
  actualPowerKW: number;
  expectedPowerReductionPct: number;
  electricityTariff: number;
  waterCost: number;
  totalCFM: number;
  waterConsumption: number;
  tdsRecommendation: number;
  projectCost: number;
  maintenancePct: number;
  gridEmissionFactor: number;
  inflationRate: number;
  discountRate: number;
  projectLife: number;
  tempReductionC?: number;
  copOem?: number;
  copActual?: number;
  copOptimized?: number;
}

export interface CalculationResults {
  powerSavingPct: number;
  initialPowerKW: number;
  annualEnergySavingKWh: number;
  annualMonerarySaving: number;
  annualWaterConsumption: number;
  annualWaterCost: number;
  annualMaintenanceCost: number;
  totalAnnualOperatingCost: number;
  netAnnualSavings: number;
  roiPeriod: number;
  lccTable: any[];
  npv: number;
  annualGhgSavingKg: number;
  annualGhgSavingTonnes: number;
  tempReductionText: string;
  summaryData: any;
  environmentalData: any;
}

/**
 * Calculate power savings from condenser temperature reduction
 */
export function calculatePowerSavings(constants: ProjectConstants): number {
  return constants.expectedPowerReductionPct;
}

/**
 * Calculate annual energy and cost savings
 */
export function calculateEnergySavings(
  powerSavingPct: number,
  constants: ProjectConstants
): {
  initialPowerKW: number;
  annualEnergySavingKWh: number;
  annualMonerarySaving: number;
} {
  // Calculate annual energy consumption based on actual power consumption
  const annualEnergyKWh = 
    constants.actualPowerKW * 
    constants.operatingHours * 
    constants.workingDays;
  
  // Calculate energy savings using the power saving percentage
  const annualEnergySavingKWh = annualEnergyKWh * (powerSavingPct / 100);
  
  // Calculate annual monetary savings
  const annualMonerarySaving = annualEnergySavingKWh * constants.electricityTariff;
  
  return {
    initialPowerKW: constants.actualPowerKW,
    annualEnergySavingKWh,
    annualMonerarySaving
  };
}

/**
 * Calculate water and maintenance costs
 */
export function calculateOperatingCosts(constants: ProjectConstants): {
  annualWaterConsumption: number;
  annualWaterCost: number;
  annualMaintenanceCost: number;
  totalAnnualOperatingCost: number;
} {
  // Water consumption and cost
  // Calculate based on formula: 4 liters per 1000 CFM
  const hourlyWaterConsumption = 
    (constants.totalCFM / 1000) * constants.waterConsumption;
    
  const annualWaterConsumption = 
    hourlyWaterConsumption * constants.operatingHours * constants.workingDays;
    
  // Convert to cubic meters
  const annualWaterConsumptionM3 = annualWaterConsumption / 1000;
  
  // Cost at INR per m³
  const annualWaterCost = annualWaterConsumptionM3 * constants.waterCost;
  
  // Maintenance cost
  const annualMaintenanceCost = constants.projectCost * (constants.maintenancePct / 100);
  
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
 * Calculate simple payback period
 */
export function calculateROI(netAnnualSavings: number, constants: ProjectConstants): number {
  const years = constants.projectCost / netAnnualSavings;
  const months = Math.round(years * 12);
  return months / 12; // Convert months to years for display
}

/**
 * Perform life cycle cost analysis
 */
export function calculateLCC(
  annualMonerarySaving: number, 
  totalAnnualOperatingCost: number, 
  constants: ProjectConstants
): {
  lccTable: any[];
  npv: number;
} {
  const lccTable = [];
  let cumulativeDcf = -constants.projectCost;  // Initial investment is negative cash flow
  
  // Year 0 (initial investment)
  lccTable.push({
    "Year": 0,
    "Initial Investment": -constants.projectCost,
    "Annual Savings (Nominal)": 0,
    "Annual O&M Cost (Nominal)": 0,
    "Net Annual Cash Flow (Nominal)": -constants.projectCost,
    "Net Annual Cash Flow (Discounted)": -constants.projectCost,
    "Cumulative Discounted Cash Flow": cumulativeDcf
  });
  
  // Calculate for each year
  for (let year = 1; year <= constants.projectLife; year++) {
    // Apply inflation to savings and costs
    const inflationFactor = Math.pow(1 + constants.inflationRate/100, year);
    const discountFactor = 1 / Math.pow(1 + constants.discountRate/100, year);
    
    const nominalSavings = annualMonerarySaving * inflationFactor;
    const nominalOmCost = totalAnnualOperatingCost * inflationFactor;
    const nominalCashFlow = nominalSavings - nominalOmCost;
    const discountedCashFlow = nominalCashFlow * discountFactor;
    
    cumulativeDcf += discountedCashFlow;
    
    lccTable.push({
      "Year": year,
      "Initial Investment": 0,
      "Annual Savings (Nominal)": Math.round(nominalSavings),
      "Annual O&M Cost (Nominal)": Math.round(nominalOmCost),
      "Net Annual Cash Flow (Nominal)": Math.round(nominalCashFlow),
      "Net Annual Cash Flow (Discounted)": Math.round(discountedCashFlow),
      "Cumulative Discounted Cash Flow": Math.round(cumulativeDcf)
    });
  }
  
  // NPV is the final cumulative discounted cash flow
  const npv = cumulativeDcf;
  
  return { lccTable, npv };
}

/**
 * Calculate greenhouse gas emission savings
 */
export function calculateGhgSavings(
  annualEnergySavingKWh: number, 
  gridEmissionFactor: number
): {
  annualGhgSavingKg: number;
  annualGhgSavingTonnes: number;
} {
  const annualGhgSavingKg = annualEnergySavingKWh * gridEmissionFactor;
  const annualGhgSavingTonnes = annualGhgSavingKg / 1000;
  
  return {
    annualGhgSavingKg,
    annualGhgSavingTonnes
  };
}

/**
 * Calculate all results for the proposal
 */
export function calculateResults(constants: ProjectConstants): CalculationResults {
  // Calculate key metrics
  const powerSavingPct = calculatePowerSavings(constants);
  
  const { 
    initialPowerKW, 
    annualEnergySavingKWh, 
    annualMonerarySaving 
  } = calculateEnergySavings(powerSavingPct, constants);
  
  const {
    annualWaterConsumption,
    annualWaterCost,
    annualMaintenanceCost,
    totalAnnualOperatingCost
  } = calculateOperatingCosts(constants);
  
  const netAnnualSavings = annualMonerarySaving - totalAnnualOperatingCost;
  
  const roiPeriod = calculateROI(netAnnualSavings, constants);
  
  const { lccTable, npv } = calculateLCC(
    annualMonerarySaving, 
    totalAnnualOperatingCost, 
    constants
  );
  
  const {
    annualGhgSavingKg,
    annualGhgSavingTonnes
  } = calculateGhgSavings(
    annualEnergySavingKWh, 
    constants.gridEmissionFactor
  );
  
  // Format the temperature reduction text
  let tempReductionText = "";
  if (constants.tempReductionC && constants.copActual && constants.copOptimized) {
    const condActual = constants.tempReductionC + (36.0 + 273.15) - 273.15;
    const condOptimized = 36.0;
    tempReductionText = `${constants.tempReductionC.toFixed(1)}°C (from ${condActual.toFixed(1)}°C to ${condOptimized.toFixed(1)}°C)`;
  } else {
    tempReductionText = `${constants.expectedPowerReductionPct.toFixed(1)}% power reduction`;
  }
  
  // Summary table data
  const summaryData = {
    data: [
      { Metric: 'Chiller Capacity', Value: `${constants.chillerCapacityTR} TR` },
      { Metric: 'Working Days', Value: `${constants.workingDays} days` },
      { Metric: 'Working Hours', Value: `${constants.operatingHours} hours` },
      { Metric: 'Initial Power Consumption', Value: `${constants.initialPowerKW.toFixed(1)} kW/hr` },
      { Metric: 'Actual Power Consumption', Value: `${constants.actualPowerKW.toFixed(1)} kW/hr` },
      { Metric: 'Expected Power Reduction', Value: `${powerSavingPct.toFixed(1)}%` },
      { Metric: 'Annual Energy Savings', Value: `${Math.floor(annualEnergySavingKWh).toLocaleString()} kWh/year` },
      { Metric: 'Annual Cost Savings', Value: `${formatCurrency(annualMonerarySaving)}/year` },
      { Metric: 'Annual Water Consumption', Value: `${annualWaterConsumption.toFixed(1)} m³/year` },
      { Metric: 'Project Cost', Value: formatCurrency(constants.projectCost) },
      { Metric: 'Simple Payback Period', Value: `${roiPeriod.toFixed(1)} years` },
      { Metric: 'NPV (15 Years)', Value: formatCurrency(npv) },
    ]
  };
  
  // Create LCC summary for a more concise table
  const lccSummary = lccTable
    .filter(row => [0, 1, 2, 3, 5, 10, 15].includes(row.Year))
    .map(row => ({
      Year: row.Year,
      "Cash Flow": row["Net Annual Cash Flow (Nominal)"],
      "Discounted CF": row["Net Annual Cash Flow (Discounted)"],
      "Cumulative DCF": row["Cumulative Discounted Cash Flow"]
    }));
    
  // Environmental Impact Table
  const environmentalData = {
    data: [
      { 
        Impact: 'Annual Energy Savings', 
        Value: `${Math.floor(annualEnergySavingKWh).toLocaleString()} kWh/year` 
      },
      { 
        Impact: 'Grid Emission Factor', 
        Value: `${constants.gridEmissionFactor} kg CO2e/kWh` 
      },
      { 
        Impact: 'Annual CO2e Reduction', 
        Value: `${annualGhgSavingTonnes.toFixed(1)} tonnes CO2e/year` 
      },
      { 
        Impact: 'Equivalent to Trees Planted', 
        Value: `${Math.floor(annualGhgSavingTonnes * 16.5).toLocaleString()} trees` 
      },
    ]
  };
  
  return {
    powerSavingPct,
    initialPowerKW,
    annualEnergySavingKWh,
    annualMonerarySaving,
    annualWaterConsumption,
    annualWaterCost,
    annualMaintenanceCost,
    totalAnnualOperatingCost,
    netAnnualSavings,
    roiPeriod,
    lccTable,
    npv,
    annualGhgSavingKg,
    annualGhgSavingTonnes,
    tempReductionText,
    summaryData,
    environmentalData
  };
}
