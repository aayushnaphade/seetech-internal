import { ChillerProposalData } from '../types';

/**
 * Centralized derived metrics builder for proposal template.
 * All numeric transformations that were previously inline in the template
 * should be moved here so the UI stays declarative and presentational.
 */
export interface DerivedProposalMetrics {
  // Power & efficiency
  capacityTR: number;
  capacityKW: number;
  currentPowerKW: number;
  proposedPowerKW: number;
  powerSavingKW: number;
  savingPct: number; // %
  beforeCOP: number;
  afterCOP: number;
  copImprovement: number;
  // Temperature
  beforeTempC: number;
  afterTempC: number;
  tempReductionC: number;
  tempLabel: string;
  // Energy & financial
  operatingHours: number;
  annualEnergySavingKWh: number;
  annualElectricitySavings: number; // currency (₹) based on electricityTariff
  annualWaterCost: number;
  annualMaintenanceCost: number;
  netAnnualSavings: number;
  investmentCost: number;
  simplePaybackMonths: number | null; // months
  // Environmental
  co2ReductionTonnes: number; // annual
  treesEquivalent: number;
  // Life cycle (very simplified placeholders; can be replaced by DCF model)
  projectLifespan: number;
  lifetimeNetSavings: number;
}

const INR_CURRENCY_SANITIZE = /[^\d.\-]/g;

export function parseNumber(str: string | undefined, fallback = 0): number {
  if (!str) return fallback;
  const cleaned = str.replace(INR_CURRENCY_SANITIZE, '');
  const v = parseFloat(cleaned);
  return isNaN(v) ? fallback : v;
}

export function buildDerivedMetrics(data: ChillerProposalData): DerivedProposalMetrics {
  const capacityTR = parseNumber(data.systemCapacity?.toString(), 0);
  const capacityKW = capacityTR * 3.517; // TR → kW
  const currentPowerKW = parseNumber(data.currentPowerConsumption, 0);
  const proposedPowerKW = parseNumber(data.proposedPowerConsumption, 0);
  const powerSavingKW = Math.max(0, currentPowerKW - proposedPowerKW);
  const savingPct = currentPowerKW > 0 ? (powerSavingKW / currentPowerKW) * 100 : 0;

  // Temperatures (choose best available fields)
  const beforeTempC = parseNumber(
    data.ambientDBT || data.currentCondenserTemp || data.condTemp,
    0
  );
  const afterTempC = parseNumber(
    data.ambientWBT || data.optimizedCondenserTemp || data.optimizedCondTemp,
    0
  );
  const tempReductionC = beforeTempC - afterTempC;
  const beforeCOP = currentPowerKW > 0 ? capacityKW / currentPowerKW : 0;
  const afterCOP = proposedPowerKW > 0 ? capacityKW / proposedPowerKW : 0;
  const copImprovement = afterCOP - beforeCOP;
  const tempLabel = data.ambientDBT && data.ambientWBT ? 'Ambient Air Temperature (DBT → WBT)' : 'Condenser Inlet Temperature';

  const operatingHours = parseNumber(data.operatingHours, 8760);
  const annualEnergySavingKWh = powerSavingKW * operatingHours;

  const electricityTariff = parseNumber(data.electricityTariff, 8.5);
  const annualElectricitySavings = annualEnergySavingKWh * electricityTariff;

  const waterConsumption = parseNumber(data.waterConsumption, 0); // kL/year
  const waterTariff = parseNumber(data.waterTariff, 0);
  const annualWaterCost = waterConsumption * waterTariff;

  // Maintenance cost estimate (try to infer from fields the form already computed)
  let annualMaintenanceCost = 0;
  if (data.maintenanceCostType === 'percentage') {
    annualMaintenanceCost = (parseNumber(data.investmentCost) * parseNumber(data.maintenanceCostPercent, 0)) / 100;
  } else if (data.maintenanceCostType === 'static') {
    annualMaintenanceCost = parseNumber(data.maintenanceCostStatic, 0);
  } else if (data.maintenanceCostType === 'monthly') {
    annualMaintenanceCost = parseNumber(data.maintenanceCostMonthly, 0) * 12;
  } else if (data.maintenanceCostType === 'yearly') {
    annualMaintenanceCost = parseNumber(data.maintenanceCostYearly, 0);
  } else if (data.maintenanceCostType === 'onetime') {
    annualMaintenanceCost = parseNumber(data.maintenanceCostOnetime, 0) / Math.max(1, parseNumber(data.projectLifespan, 15));
  }

  const netAnnualSavings = annualElectricitySavings - annualWaterCost - annualMaintenanceCost;
  const investmentCost = parseNumber(data.investmentCost, 0);
  const simplePaybackMonths = netAnnualSavings > 0 && investmentCost > 0 ? (investmentCost / netAnnualSavings) * 12 : null;

  // Environmental assumptions
  const emissionFactorKgPerKWh = 0.82; // kg CO2e per kWh
  const co2ReductionTonnes = (annualEnergySavingKWh * emissionFactorKgPerKWh) / 1000; // tonnes
  const treesEquivalent = co2ReductionTonnes * 16.5; // rough heuristic

  const projectLifespan = parseNumber(data.projectLifespan, 15);
  const lifetimeNetSavings = netAnnualSavings * projectLifespan;

  return {
    capacityTR,
    capacityKW,
    currentPowerKW,
    proposedPowerKW,
    powerSavingKW,
    savingPct,
    beforeCOP,
    afterCOP,
    copImprovement,
    beforeTempC,
    afterTempC,
    tempReductionC,
    tempLabel,
    operatingHours,
    annualEnergySavingKWh,
    annualElectricitySavings,
    annualWaterCost,
    annualMaintenanceCost,
    netAnnualSavings,
    investmentCost,
    simplePaybackMonths,
    co2ReductionTonnes,
    treesEquivalent,
    projectLifespan,
    lifetimeNetSavings,
  };
}

export function getSystemLabel(systemType: string | undefined): { base: string; capital: string; possessive: string; powerLabel: string } {
  const st = (systemType || 'chiller').toLowerCase();
  if (st === 'dx') {
    return { base: 'dx', capital: 'DX', possessive: 'DX system\'s', powerLabel: 'DX system power' };
  }
  if (st === 'vrf') {
    return { base: 'vrf', capital: 'VRF', possessive: 'VRF system\'s', powerLabel: 'VRF system power' };
  }
  return { base: 'chiller', capital: 'Chiller', possessive: "chiller's", powerLabel: 'chiller power' };
}
