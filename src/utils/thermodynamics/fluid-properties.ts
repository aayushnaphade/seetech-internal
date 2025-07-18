// Thermodynamic Properties Utility
// Extracted from Engineering-Solver project for SeeTech energy efficiency tools

// Units mapping for thermodynamic properties
export const propUnit = {
  '': '',
  DELTA: '',
  Delta: '',
  DMOLAR: 'mol/m^3',
  Dmolar: 'mol/m^3',
  D: 'kg/m^3',
  DMASS: 'kg/m^3',
  Dmass: 'kg/m^3',
  HMOLAR: 'J/mol',
  Hmolar: 'J/mol',
  H: 'J/kg',
  HMASS: 'J/kg',
  Hmass: 'J/kg',
  P: 'Pa',
  Q: '',
  SMOLAR: 'J/mol/K',
  Smolar: 'J/mol/K',
  S: 'J/kg/K',
  SMASS: 'J/kg/K',
  Smass: 'J/kg/K',
  TAU: '',
  Tau: '',
  T: 'K',
  UMOLAR: 'J/mol',
  Umolar: 'J/mol',
  U: 'J/kg',
  UMASS: 'J/kg',
  Umass: 'J/kg',
  ACENTRIC: '',
  acentric: '',
  ALPHA0: '',
  alpha0: '',
  ALPHAR: '',
  alphar: '',
  A: 'm/s',
  SPEED_OF_SOUND: 'm/s',
  speed_of_sound: 'm/s',
  BVIRIAL: '',
  Bvirial: '',
  CONDUCTIVITY: 'W/m/K',
  L: 'W/m/K',
  conductivity: 'W/m/K',
  CP0MASS: 'J/kg/K',
  Cp0mass: 'J/kg/K',
  CP0MOLAR: 'J/mol/K',
  Cp0molar: 'J/mol/K',
  CPMOLAR: 'J/mol/K',
  Cpmolar: 'J/mol/K',
  CVMOLAR: 'J/mol/K',
  Cvmolar: 'J/mol/K',
  CVMASS: 'J/kg/K',
  Cvmass: 'J/kg/K',
  CP: 'J/kg/K',
  CPMASS: 'J/kg/K',
  Cpmass: 'J/kg/K',
  CV: 'J/kg/K',
  VISCOSITY: 'Pa*s',
  V: 'Pa*s',
  viscosity: 'Pa*s',
  PRANDTL: '',
  Prandtl: '',
  PHASE: '',
  Phase: '',
  QUALITY: '',
  Quality: '',
  PCRIT: 'Pa',
  Pcrit: 'Pa',
  TCRIT: 'K',
  Tcrit: 'K',
  RHOCRIT: 'kg/m^3',
  Rhocrit: 'kg/m^3',
  MOLARMASS: 'kg/mol',
  M: 'kg/mol',
  molar_mass: 'kg/mol',
  DIPOLE_MOMENT: 'C*m',
  dipole_moment: 'C*m',
  FRACTION_MIN: '',
  fraction_min: '',
  FRACTION_MAX: '',
  fraction_max: '',
  TMIN: 'K',
  Tmin: 'K',
  TMAX: 'K',
  Tmax: 'K',
  PMAX: 'Pa',
  Pmax: 'Pa',
  TTRIPLE: 'K',
  Ttriple: 'K',
  PTRIPLE: 'Pa',
  Ptriple: 'Pa',
  PMIN: 'Pa',
  Pmin: 'Pa',
  TREDUCE: 'K',
  Treduce: 'K',
  PREDUCE: 'Pa',
  Preduce: 'Pa',
  RHOMASS_REDUCE: 'kg/m^3',
  rhomass_reduce: 'kg/m^3',
  RHOMOLAR_REDUCE: 'mol/m^3',
  rhomolar_reduce: 'mol/m^3',
  RHOMOLAR_CRITICAL: 'mol/m^3',
  rhomolar_critical: 'mol/m^3',
  RHOMASS_CRITICAL: 'kg/m^3',
  rhomass_critical: 'kg/m^3',
  ISOBARIC_EXPANSION_COEFFICIENT: '1/K',
  isobaric_expansion_coefficient: '1/K',
  ISOTHERMAL_COMPRESSIBILITY: '1/Pa',
  isothermal_compressibility: '1/Pa',
  ISENTROPIC_EXPANSION_COEFFICIENT: '1/K',
  isentropic_expansion_coefficient: '1/K',
  FUGACITY_COEFFICIENT: '',
  fugacity_coefficient: '',
  Z: '',
  compressibility_factor: '',
  FUGACITY: 'Pa',
  fugacity: 'Pa',
  CHEMICAL_POTENTIAL: 'J/mol',
  chemical_potential: 'J/mol',
  FUNDAMENTAL_DERIVATIVE_OF_GAS_DYNAMICS: '',
  fundamental_derivative_of_gas_dynamics: '',
  PIP: '',
  SURFACE_TENSION: 'N/m',
  surface_tension: 'N/m',
  I: 'N/m',
  HELMHOLTZMASS: 'J/kg',
  Helmholtzmass: 'J/kg',
  HELMHOLTZMOLAR: 'J/mol',
  Helmholtzmolar: 'J/mol',
  GIBBSMASS: 'J/kg',
  Gibbsmass: 'J/kg',
  GIBBSMOLAR: 'J/mol',
  Gibbsmolar: 'J/mol',
  VOLUMETRIC_EXPANSION_COEFFICIENT: '1/K',
  volumetric_expansion_coefficient: '1/K',
  GWP20: '',
  GWP100: '',
  GWP500: '',
  ODP: '',
  FLAME_HAZARD: '',
  flame_hazard: '',
  HEALTH_HAZARD: '',
  health_hazard: '',
  PHYSICAL_HAZARD: '',
  physical_hazard: '',
  CONDUCTIVITY_CRITICAL: 'W/m/K',
  conductivity_critical: 'W/m/K',
  VISCOSITY_CRITICAL: 'Pa*s',
  viscosity_critical: 'Pa*s',
  PRANDTL_CRITICAL: '',
  Prandtl_critical: ''
}

// Humid air properties units
export const HApropUnit = {
  'B': 'K',
  'C': 'J/kg/K',
  'Cha': 'J/kg/K',
  'Cp': 'J/kg/K',
  'Cv': 'J/kg/K',
  'Cvha': 'J/kg/K',
  'D': 'kg/m^3',
  'Dha': 'kg/m^3',
  'H': 'J/kg',
  'Hha': 'J/kg',
  'K': 'W/m/K',
  'Kha': 'W/m/K',
  'M': 'kg/mol',
  'Mha': 'kg/mol',
  'mu': 'Pa*s',
  'Muha': 'Pa*s',
  'P': 'Pa',
  'P_w': 'Pa',
  'Psi_w': 'Pa',
  'R': '',
  'RH': '',
  'S': 'J/kg/K',
  'Sha': 'J/kg/K',
  'T': 'K',
  'Tdb': 'K',
  'Tdp': 'K',
  'Twb': 'K',
  'V': 'm^3/kg',
  'Vha': 'm^3/kg',
  'W': 'kg/kg',
  'Y': 'mol/mol',
  'Z': ''
}

// Phase mapping
export const phases = {
  0: 'liquid',
  1: 'supercritical',
  2: 'supercritical_gas',
  3: 'supercritical_liquid',
  4: 'critical_point',
  5: 'gas',
  6: 'twophase',
  8: 'unknown'
}

// Substitute property names for CoolProp compatibility
export function subProp(prop: string): string {
  const substitutions: Record<string, string> = {
    'HMOLAR': 'Hmolar',
    'SMOLAR': 'Smolar',
    'UMOLAR': 'Umolar',
    'DMOLAR': 'Dmolar',
    'CPMOLAR': 'Cpmolar',
    'CVMOLAR': 'Cvmolar',
    'SPEED_OF_SOUND': 'A',
    'HMASS': 'H',
    'SMASS': 'S',
    'UMASS': 'U',
    'DMASS': 'D',
    'CPMASS': 'C',
    'CVMASS': 'O',
    'VISCOSITY': 'V',
    'CONDUCTIVITY': 'L',
    'PRANDTL': 'Prandtl',
    'PHASE': 'Phase',
    'QUALITY': 'Q',
    'MOLARMASS': 'M',
    'PCRIT': 'Pcrit',
    'TCRIT': 'Tcrit',
    'RHOCRIT': 'Rhocrit',
    'TMIN': 'Tmin',
    'TMAX': 'Tmax',
    'PMAX': 'Pmax',
    'TTRIPLE': 'Ttriple',
    'PTRIPLE': 'Ptriple',
    'PMIN': 'Pmin',
    'TREDUCE': 'Treduce',
    'PREDUCE': 'Preduce',
    'RHOMASS_REDUCE': 'rhomass_reduce',
    'RHOMOLAR_REDUCE': 'rhomolar_reduce',
    'RHOMOLAR_CRITICAL': 'rhomolar_critical',
    'RHOMASS_CRITICAL': 'rhomass_critical',
    'ISOBARIC_EXPANSION_COEFFICIENT': 'isobaric_expansion_coefficient',
    'ISOTHERMAL_COMPRESSIBILITY': 'isothermal_compressibility',
    'ISENTROPIC_EXPANSION_COEFFICIENT': 'isentropic_expansion_coefficient',
    'FUGACITY_COEFFICIENT': 'fugacity_coefficient',
    'FUGACITY': 'fugacity',
    'Z': 'Z',
    'CHEMICAL_POTENTIAL': 'chemical_potential',
    'FUNDAMENTAL_DERIVATIVE_OF_GAS_DYNAMICS': 'fundamental_derivative_of_gas_dynamics',
    'PIP': 'PIP',
    'SURFACE_TENSION': 'I',
    'HELMHOLTZMASS': 'Helmholtzmass',
    'HELMHOLTZMOLAR': 'Helmholtzmolar',
    'GIBBSMASS': 'Gibbsmass',
    'GIBBSMOLAR': 'Gibbsmolar',
    'VOLUMETRIC_EXPANSION_COEFFICIENT': 'volumetric_expansion_coefficient',
    'GWP20': 'GWP20',
    'GWP100': 'GWP100',
    'GWP500': 'GWP500',
    'ODP': 'ODP',
    'FLAME_HAZARD': 'flame_hazard',
    'HEALTH_HAZARD': 'health_hazard',
    'PHYSICAL_HAZARD': 'physical_hazard',
    'CONDUCTIVITY_CRITICAL': 'conductivity_critical',
    'VISCOSITY_CRITICAL': 'viscosity_critical',
    'PRANDTL_CRITICAL': 'Prandtl_critical'
  }
  
  return substitutions[prop] || prop
}

// Get units for calculated properties
export function calcPropUnits(prop: string): string {
  const subPropName = subProp(prop)
  if (subPropName in propUnit) {
    return (propUnit as Record<string, string>)[subPropName]
  } else {
    return (propUnit as Record<string, string>)[prop]
  }
}

// Convert value to proper unit format
export function toValue(v: number | string, u?: string): number {
  return u ? Number(v) : Number(v)
}

// Convert value to unit object
export function toUnit(v: number, u?: string): { value: number; unit: string } {
  return { value: v, unit: u || '' }
}

// Common thermodynamic constants
export const THERMODYNAMIC_CONSTANTS = {
  R_UNIVERSAL: 8.314462618, // J/(mol·K)
  R_SPECIFIC_AIR: 287.058, // J/(kg·K)
  R_SPECIFIC_WATER_VAPOR: 461.495, // J/(kg·K)
  STANDARD_TEMPERATURE: 273.15, // K
  STANDARD_PRESSURE: 101325, // Pa
  STANDARD_ATMOSPHERE: 101325, // Pa
  TRIPLE_POINT_WATER: 273.16, // K
  CRITICAL_TEMP_WATER: 647.096, // K
  CRITICAL_PRESSURE_WATER: 22064000, // Pa
  CRITICAL_DENSITY_WATER: 322, // kg/m³
  STEFAN_BOLTZMANN: 5.670374419e-8, // W/(m²·K⁴)
  AVOGADRO: 6.02214076e23, // mol⁻¹
  BOLTZMANN: 1.380649e-23, // J/K
  PLANCK: 6.62607015e-34, // J·s
  SPEED_OF_LIGHT: 299792458, // m/s
  ELECTRON_CHARGE: 1.602176634e-19, // C
  ELECTRON_MASS: 9.1093837015e-31, // kg
  PROTON_MASS: 1.67262192369e-27, // kg
  NEUTRON_MASS: 1.67492749804e-27, // kg
  ATOMIC_MASS_UNIT: 1.66053906660e-27, // kg
  FARADAY: 96485.33212, // C/mol
  MAGNETIC_PERMEABILITY: 1.25663706212e-6, // H/m
  ELECTRIC_PERMITTIVITY: 8.8541878128e-12, // F/m
  IMPEDANCE_FREE_SPACE: 376.730313668, // Ω
  CONDUCTANCE_QUANTUM: 7.748091729e-5, // S
  JOSEPHSON: 483597.8484e9, // Hz/V
  VON_KLITZING: 25812.80745, // Ω
  BOHR_MAGNETON: 9.2740100783e-24, // J/T
  NUCLEAR_MAGNETON: 5.0507837461e-27, // J/T
  CLASSICAL_ELECTRON_RADIUS: 2.8179403262e-15, // m
  THOMSON_CROSS_SECTION: 6.6524587321e-29, // m²
  BOHR_RADIUS: 5.29177210903e-11, // m
  HARTREE_ENERGY: 4.3597447222071e-18, // J
  RYDBERG_CONSTANT: 10973731.568160, // m⁻¹
  FINE_STRUCTURE: 7.2973525693e-3, // dimensionless
  INVERSE_FINE_STRUCTURE: 137.035999084 // dimensionless
}

// Common fluid properties for energy efficiency calculations
export const COMMON_FLUIDS = {
  'Water': {
    name: 'Water',
    formula: 'H2O',
    molarMass: 18.015, // kg/kmol
    criticalTemp: 647.096, // K
    criticalPressure: 22064000, // Pa
    criticalDensity: 322, // kg/m³
    applications: ['Steam cycles', 'Hydronic systems', 'Cooling towers']
  },
  'R134a': {
    name: 'R134a',
    formula: 'C2H2F4',
    molarMass: 102.03, // kg/kmol
    criticalTemp: 374.21, // K
    criticalPressure: 4059300, // Pa
    criticalDensity: 511.9, // kg/m³
    applications: ['Refrigeration', 'Air conditioning', 'Heat pumps']
  },
  'R410A': {
    name: 'R410A',
    formula: 'R32/R125',
    molarMass: 72.58, // kg/kmol
    criticalTemp: 344.494, // K
    criticalPressure: 4901200, // Pa
    criticalDensity: 459.3, // kg/m³
    applications: ['Residential AC', 'Commercial refrigeration', 'Heat pumps']
  },
  'Ammonia': {
    name: 'Ammonia',
    formula: 'NH3',
    molarMass: 17.031, // kg/kmol
    criticalTemp: 405.56, // K
    criticalPressure: 11333000, // Pa
    criticalDensity: 225, // kg/m³
    applications: ['Industrial refrigeration', 'Absorption chillers', 'Heat pumps']
  },
  'CO2': {
    name: 'CO2',
    formula: 'CO2',
    molarMass: 44.01, // kg/kmol
    criticalTemp: 304.13, // K
    criticalPressure: 7377300, // Pa
    criticalDensity: 467.6, // kg/m³
    applications: ['Transcritical refrigeration', 'Heat pumps', 'Supercritical power cycles']
  },
  'Air': {
    name: 'Air',
    formula: 'N2+O2',
    molarMass: 28.97, // kg/kmol
    criticalTemp: 132.63, // K
    criticalPressure: 3786000, // Pa
    criticalDensity: 351.0, // kg/m³
    applications: ['HVAC systems', 'Compressed air', 'Pneumatic systems']
  }
}

// Utility functions for energy efficiency calculations
export class ThermodynamicUtils {
  
  // Convert temperature between units
  static convertTemperature(value: number, fromUnit: string, toUnit: string): number {
    let kelvin = value
    
    // Convert to Kelvin first
    switch (fromUnit.toLowerCase()) {
      case 'c':
      case 'celsius':
        kelvin = value + 273.15
        break
      case 'f':
      case 'fahrenheit':
        kelvin = (value - 32) * 5/9 + 273.15
        break
      case 'k':
      case 'kelvin':
        kelvin = value
        break
      case 'r':
      case 'rankine':
        kelvin = value * 5/9
        break
      default:
        kelvin = value
    }
    
    // Convert from Kelvin to target unit
    switch (toUnit.toLowerCase()) {
      case 'c':
      case 'celsius':
        return kelvin - 273.15
      case 'f':
      case 'fahrenheit':
        return (kelvin - 273.15) * 9/5 + 32
      case 'k':
      case 'kelvin':
        return kelvin
      case 'r':
      case 'rankine':
        return kelvin * 9/5
      default:
        return kelvin
    }
  }
  
  // Convert pressure between units
  static convertPressure(value: number, fromUnit: string, toUnit: string): number {
    let pascal = value
    
    // Convert to Pascal first
    switch (fromUnit.toLowerCase()) {
      case 'pa':
      case 'pascal':
        pascal = value
        break
      case 'kpa':
      case 'kilopascal':
        pascal = value * 1000
        break
      case 'mpa':
      case 'megapascal':
        pascal = value * 1000000
        break
      case 'bar':
        pascal = value * 100000
        break
      case 'psi':
        pascal = value * 6894.76
        break
      case 'atm':
      case 'atmosphere':
        pascal = value * 101325
        break
      case 'mmhg':
      case 'torr':
        pascal = value * 133.322
        break
      case 'inh2o':
        pascal = value * 249.082
        break
      default:
        pascal = value
    }
    
    // Convert from Pascal to target unit
    switch (toUnit.toLowerCase()) {
      case 'pa':
      case 'pascal':
        return pascal
      case 'kpa':
      case 'kilopascal':
        return pascal / 1000
      case 'mpa':
      case 'megapascal':
        return pascal / 1000000
      case 'bar':
        return pascal / 100000
      case 'psi':
        return pascal / 6894.76
      case 'atm':
      case 'atmosphere':
        return pascal / 101325
      case 'mmhg':
      case 'torr':
        return pascal / 133.322
      case 'inh2o':
        return pascal / 249.082
      default:
        return pascal
    }
  }
  
  // Convert energy between units
  static convertEnergy(value: number, fromUnit: string, toUnit: string): number {
    let joule = value
    
    // Convert to Joule first
    switch (fromUnit.toLowerCase()) {
      case 'j':
      case 'joule':
        joule = value
        break
      case 'kj':
      case 'kilojoule':
        joule = value * 1000
        break
      case 'mj':
      case 'megajoule':
        joule = value * 1000000
        break
      case 'cal':
      case 'calorie':
        joule = value * 4.184
        break
      case 'kcal':
      case 'kilocalorie':
        joule = value * 4184
        break
      case 'btu':
        joule = value * 1055.06
        break
      case 'kwh':
      case 'kilowatthour':
        joule = value * 3600000
        break
      case 'therm':
        joule = value * 105505600
        break
      case 'ft-lbf':
        joule = value * 1.35582
        break
      default:
        joule = value
    }
    
    // Convert from Joule to target unit
    switch (toUnit.toLowerCase()) {
      case 'j':
      case 'joule':
        return joule
      case 'kj':
      case 'kilojoule':
        return joule / 1000
      case 'mj':
      case 'megajoule':
        return joule / 1000000
      case 'cal':
      case 'calorie':
        return joule / 4.184
      case 'kcal':
      case 'kilocalorie':
        return joule / 4184
      case 'btu':
        return joule / 1055.06
      case 'kwh':
      case 'kilowatthour':
        return joule / 3600000
      case 'therm':
        return joule / 105505600
      case 'ft-lbf':
        return joule / 1.35582
      default:
        return joule
    }
  }
  
  // Convert power between units
  static convertPower(value: number, fromUnit: string, toUnit: string): number {
    let watt = value
    
    // Convert to Watt first
    switch (fromUnit.toLowerCase()) {
      case 'w':
      case 'watt':
        watt = value
        break
      case 'kw':
      case 'kilowatt':
        watt = value * 1000
        break
      case 'mw':
      case 'megawatt':
        watt = value * 1000000
        break
      case 'hp':
      case 'horsepower':
        watt = value * 745.7
        break
      case 'btu/h':
      case 'btuh':
        watt = value * 0.293071
        break
      case 'ton':
      case 'tonref':
        watt = value * 3516.85
        break
      case 'tr':
        watt = value * 3516.85
        break
      case 'cal/s':
        watt = value * 4.184
        break
      case 'kcal/h':
        watt = value * 1.163
        break
      default:
        watt = value
    }
    
    // Convert from Watt to target unit
    switch (toUnit.toLowerCase()) {
      case 'w':
      case 'watt':
        return watt
      case 'kw':
      case 'kilowatt':
        return watt / 1000
      case 'mw':
      case 'megawatt':
        return watt / 1000000
      case 'hp':
      case 'horsepower':
        return watt / 745.7
      case 'btu/h':
      case 'btuh':
        return watt / 0.293071
      case 'ton':
      case 'tonref':
        return watt / 3516.85
      case 'tr':
        return watt / 3516.85
      case 'cal/s':
        return watt / 4.184
      case 'kcal/h':
        return watt / 1.163
      default:
        return watt
    }
  }
  
  // Calculate efficiency
  static calculateEfficiency(output: number, input: number, unit: string = '%'): number {
    const efficiency = (output / input) * 100
    return unit === '%' ? efficiency : efficiency / 100
  }
  
  // Calculate COP (Coefficient of Performance)
  static calculateCOP(output: number, input: number): number {
    return output / input
  }
  
  // Calculate heat transfer rate
  static calculateHeatTransfer(mass: number, specificHeat: number, deltaT: number): number {
    return mass * specificHeat * deltaT
  }
  
  // Calculate Reynolds number
  static calculateReynolds(density: number, velocity: number, diameter: number, viscosity: number): number {
    return (density * velocity * diameter) / viscosity
  }
  
  // Calculate Prandtl number
  static calculatePrandtl(viscosity: number, specificHeat: number, thermalConductivity: number): number {
    return (viscosity * specificHeat) / thermalConductivity
  }
  
  // Calculate Nusselt number (simple correlation)
  static calculateNusselt(reynolds: number, prandtl: number, geometry: string = 'pipe'): number {
    if (geometry === 'pipe') {
      // Dittus-Boelter equation for turbulent flow in pipes
      return 0.023 * Math.pow(reynolds, 0.8) * Math.pow(prandtl, 0.4)
    } else if (geometry === 'flat_plate') {
      // Flat plate correlation
      return 0.664 * Math.pow(reynolds, 0.5) * Math.pow(prandtl, 0.33)
    }
    return 0.023 * Math.pow(reynolds, 0.8) * Math.pow(prandtl, 0.4)
  }
}

// Export all utilities
export default {
  propUnit,
  HApropUnit,
  phases,
  subProp,
  calcPropUnits,
  toValue,
  toUnit,
  THERMODYNAMIC_CONSTANTS,
  COMMON_FLUIDS,
  ThermodynamicUtils
}
