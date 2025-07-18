// Molecular Mass Utility
// Extracted from Engineering-Solver project for SeeTech energy efficiency tools

// Atomic masses of elements (in atomic mass units)
export const atomicMasses = {
  H: 1.00794, He: 4.0026, Li: 6.941, Be: 9.01218, B: 10.811, C: 12.011, N: 14.0067, O: 15.9994, F: 18.9984, Ne: 20.1797,
  Na: 22.98977, Mg: 24.305, Al: 26.98154, Si: 28.0855, P: 30.97376, S: 32.066, Cl: 35.4527, Ar: 39.948, K: 39.0983, Ca: 40.078,
  Sc: 44.9559, Ti: 47.88, V: 50.9415, Cr: 51.996, Mn: 54.938, Fe: 55.847, Co: 58.9332, Ni: 58.6934, Cu: 63.546, Zn: 65.39,
  Ga: 69.723, Ge: 72.61, As: 74.9216, Se: 78.96, Br: 79.904, Kr: 83.8, Rb: 85.4678, Sr: 87.62, Y: 88.9059, Zr: 91.224,
  Nb: 92.9064, Mo: 95.94, Tc: 98, Ru: 101.07, Rh: 102.9055, Pd: 106.42, Ag: 107.868, Cd: 112.41, In: 114.82, Sn: 118.71,
  Sb: 121.757, Te: 127.6, I: 126.9045, Xe: 131.29, Cs: 132.9054, Ba: 137.33, La: 138.9055, Hf: 178.49, Ta: 180.9479, W: 183.85,
  Re: 186.207, Os: 190.2, Ir: 192.22, Pt: 195.08, Au: 196.9665, Hg: 200.59, Tl: 204.383, Pb: 207.2, Bi: 208.9804, Po: 209,
  At: 210, Rn: 222, Fr: 223, Ra: 226.0254, Ac: 227, Rf: 261, Db: 262, Sg: 263, Bh: 262, Hs: 265, Mt: 266, Uun: 269, Uuu: 272,
  Uub: 277, Ce: 140.12, Pr: 140.9077, Nd: 144.24, Pm: 145, Sm: 150.36, Eu: 151.965, Gd: 157.25, Tb: 158.9253, Dy: 162.5,
  Ho: 164.9303, Er: 167.26, Tm: 168.9342, Yb: 173.04, Lu: 174.967, Th: 232.0381, Pa: 231.0359, U: 238.029, Np: 237.0482,
  Pu: 244, Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257, Md: 258, No: 259, Lr: 262
}

// Interface for molecular composition
export interface MolecularComposition {
  [element: string]: number
}

// Interface for molecular mass result
export interface MolecularMassResult {
  formula: string
  elements: MolecularComposition
  totalMass: number
  molecularMass: MolecularComposition
  fraction: MolecularComposition
}

// Add molecules together
function addMolecules(molecA: MolecularComposition, molecB: MolecularComposition, molecBqty: number): MolecularComposition {
  const result = { ...molecA }
  for (const [elem, atoms] of Object.entries(molecB)) {
    result[elem] = (result[elem] || 0) + molecBqty * atoms
  }
  return result
}

// Parse simple chemical formula
function parseSimpleFormula(formula: string): MolecularComposition {
  const elementPattern = /[A-Z][a-z]*/g
  const numberPattern = /\d+$/
  let molec: MolecularComposition = {}
  const chemArray = formula.match(/[A-Z][a-z]*\d*/g) || []
  
  chemArray.forEach(part => {
    const elementMatch = part.match(elementPattern)
    if (elementMatch) {
      const element = elementMatch[0]
      const numberMatch = part.match(numberPattern)
      const atoms = numberMatch ? parseInt(numberMatch[0]) : 1
      molec[element] = (molec[element] || 0) + atoms
    }
  })
  
  return molec
}

// Main molecular mass calculation function
export function calculateMolecularMass(formula: string): MolecularMassResult {
  // Clean formula
  const cleanFormula = formula.replace(/\s/g, '')
  
  // Simple formula validation
  const validFormula = /^([A-Z][a-z]*\d*)+$/
  if (!validFormula.test(cleanFormula)) {
    throw new Error('Invalid chemical formula. Only simple formulas supported (e.g., H2O, CO2, C6H12O6)')
  }
  
  // Parse the formula
  const elements = parseSimpleFormula(cleanFormula)
  
  // Calculate molecular masses and fractions
  const molecularMass: MolecularComposition = {}
  const fraction: MolecularComposition = {}
  let totalMass = 0
  
  // Calculate total mass and individual element masses
  for (const [element, count] of Object.entries(elements)) {
    if (!(element in atomicMasses)) {
      throw new Error(`Unknown element: ${element}`)
    }
    const elementMass = (atomicMasses as any)[element] * count
    molecularMass[element] = elementMass
    totalMass += elementMass
  }
  
  // Calculate mass fractions
  for (const element of Object.keys(elements)) {
    fraction[element] = molecularMass[element] / totalMass
  }
  
  return {
    formula: cleanFormula,
    elements,
    totalMass,
    molecularMass,
    fraction
  }
}

// Convenient alias for compatibility with Engineering-Solver
export const MM = calculateMolecularMass

// Common compounds for energy efficiency calculations
export const COMMON_COMPOUNDS = {
  // Combustion fuels
  'CH4': { name: 'Methane', molarMass: 16.04, type: 'fuel' },
  'C2H6': { name: 'Ethane', molarMass: 30.07, type: 'fuel' },
  'C3H8': { name: 'Propane', molarMass: 44.10, type: 'fuel' },
  'C4H10': { name: 'Butane', molarMass: 58.12, type: 'fuel' },
  'C6H6': { name: 'Benzene', molarMass: 78.11, type: 'fuel' },
  'C8H18': { name: 'Octane', molarMass: 114.23, type: 'fuel' },
  'C2H5OH': { name: 'Ethanol', molarMass: 46.07, type: 'fuel' },
  'CH3OH': { name: 'Methanol', molarMass: 32.04, type: 'fuel' },
  
  // Combustion products
  'CO2': { name: 'Carbon Dioxide', molarMass: 44.01, type: 'combustion_product' },
  'H2O': { name: 'Water', molarMass: 18.015, type: 'combustion_product' },
  'CO': { name: 'Carbon Monoxide', molarMass: 28.01, type: 'combustion_product' },
  'NO': { name: 'Nitric Oxide', molarMass: 30.01, type: 'combustion_product' },
  'NO2': { name: 'Nitrogen Dioxide', molarMass: 46.01, type: 'combustion_product' },
  'SO2': { name: 'Sulfur Dioxide', molarMass: 64.07, type: 'combustion_product' },
  
  // Air components
  'N2': { name: 'Nitrogen', molarMass: 28.014, type: 'air_component' },
  'O2': { name: 'Oxygen', molarMass: 31.998, type: 'air_component' },
  'Ar': { name: 'Argon', molarMass: 39.948, type: 'air_component' },
  
  // Refrigerants
  'R134a': { name: 'R134a', formula: 'C2H2F4', molarMass: 102.03, type: 'refrigerant' },
  'R410A': { name: 'R410A', formula: 'R32/R125', molarMass: 72.58, type: 'refrigerant' },
  'R32': { name: 'R32', formula: 'CH2F2', molarMass: 52.02, type: 'refrigerant' },
  'R125': { name: 'R125', formula: 'C2HF5', molarMass: 120.02, type: 'refrigerant' },
  'R407C': { name: 'R407C', formula: 'R32/R125/R134a', molarMass: 86.2, type: 'refrigerant' },
  'R22': { name: 'R22', formula: 'CHClF2', molarMass: 86.47, type: 'refrigerant' },
  
  // Common acids and bases
  'H2SO4': { name: 'Sulfuric Acid', molarMass: 98.08, type: 'acid' },
  'HCl': { name: 'Hydrochloric Acid', molarMass: 36.46, type: 'acid' },
  'HNO3': { name: 'Nitric Acid', molarMass: 63.01, type: 'acid' },
  'NaOH': { name: 'Sodium Hydroxide', molarMass: 40.00, type: 'base' },
  'Ca(OH)2': { name: 'Calcium Hydroxide', molarMass: 74.09, type: 'base' },
  
  // Common salts
  'NaCl': { name: 'Sodium Chloride', molarMass: 58.44, type: 'salt' },
  'CaCl2': { name: 'Calcium Chloride', molarMass: 110.98, type: 'salt' },
  'MgCl2': { name: 'Magnesium Chloride', molarMass: 95.21, type: 'salt' },
  
  // Organic compounds
  'C6H12O6': { name: 'Glucose', molarMass: 180.16, type: 'organic' },
  'C2H4': { name: 'Ethylene', molarMass: 28.05, type: 'organic' },
  'C2H2': { name: 'Acetylene', molarMass: 26.04, type: 'organic' }
}

// Utility functions for energy calculations
export class MolecularUtils {
  
  // Get molecular mass of a compound
  static getMolarMass(formula: string): number {
    return calculateMolecularMass(formula).totalMass
  }
  
  // Calculate moles from mass
  static calculateMoles(mass: number, molarMass: number): number {
    return mass / molarMass
  }
  
  // Calculate mass from moles
  static calculateMass(moles: number, molarMass: number): number {
    return moles * molarMass
  }
  
  // Calculate mass percentage of an element in a compound
  static calculateMassPercentage(formula: string, element: string): number {
    const result = calculateMolecularMass(formula)
    return (result.fraction[element] || 0) * 100
  }
  
  // Calculate stoichiometric air requirement for combustion
  static calculateStoichiometricAir(fuelFormula: string): number {
    const fuel = calculateMolecularMass(fuelFormula)
    const carbonAtoms = fuel.elements.C || 0
    const hydrogenAtoms = fuel.elements.H || 0
    const oxygenAtoms = fuel.elements.O || 0
    
    // Stoichiometric equation: CxHy + (x + y/4)O2 -> xCO2 + (y/2)H2O
    const oxygenRequired = carbonAtoms + hydrogenAtoms / 4 - oxygenAtoms / 2
    
    // Air is approximately 21% oxygen by volume
    const airRequired = oxygenRequired / 0.21
    
    return airRequired
  }
  
  // Calculate theoretical CO2 production from fuel combustion
  static calculateCO2Production(fuelFormula: string, fuelMass: number): number {
    const fuel = calculateMolecularMass(fuelFormula)
    const carbonAtoms = fuel.elements.C || 0
    const co2MolarMass = calculateMolecularMass('CO2').totalMass
    
    const fuelMoles = fuelMass / fuel.totalMass
    const co2Moles = fuelMoles * carbonAtoms
    const co2Mass = co2Moles * co2MolarMass
    
    return co2Mass
  }
  
  // Calculate heating value correction for fuel composition
  static calculateHeatingValueCorrection(fuelFormula: string, lowerHeatingValue: number): number {
    const fuel = calculateMolecularMass(fuelFormula)
    const hydrogenAtoms = fuel.elements.H || 0
    const waterMolarMass = calculateMolecularMass('H2O').totalMass
    
    // Latent heat of vaporization of water at 25°C (kJ/mol)
    const latentHeat = 44.01
    
    // Calculate higher heating value
    const waterMoles = hydrogenAtoms / 2
    const latentHeatContribution = waterMoles * latentHeat / fuel.totalMass
    
    return lowerHeatingValue + latentHeatContribution
  }
  
  // Calculate equivalence ratio (fuel-air ratio / stoichiometric fuel-air ratio)
  static calculateEquivalenceRatio(fuelMass: number, airMass: number, fuelFormula: string): number {
    const fuel = calculateMolecularMass(fuelFormula)
    const airMolarMass = 28.97 // kg/kmol for air
    
    const fuelMoles = fuelMass / fuel.totalMass
    const airMoles = airMass / airMolarMass
    
    const stoichiometricAirMoles = this.calculateStoichiometricAir(fuelFormula)
    const actualFuelAirRatio = fuelMoles / airMoles
    const stoichiometricFuelAirRatio = 1 / stoichiometricAirMoles
    
    return actualFuelAirRatio / stoichiometricFuelAirRatio
  }
}

// Export all utilities
export default {
  atomicMasses,
  calculateMolecularMass,
  MM,
  COMMON_COMPOUNDS,
  MolecularUtils
}
