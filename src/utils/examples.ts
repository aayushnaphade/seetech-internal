// Example usage of thermodynamic and plotting utilities
// This shows how to use the utilities extracted from your Engineering-Solver project

import {
  ThermodynamicUtils,
  MolecularUtils,
  EnergyPlots,
  createPlot,
  calculateMolecularMass,
  MM,
  COMMON_COMPOUNDS,
  THERMODYNAMIC_CONSTANTS
} from './index'

// Examples of how to use the utilities

// 1. Temperature conversions
console.log('=== Temperature Conversions ===')
const tempCelsius = 25
const tempFahrenheit = ThermodynamicUtils.convertTemperature(tempCelsius, 'C', 'F')
const tempKelvin = ThermodynamicUtils.convertTemperature(tempCelsius, 'C', 'K')
console.log(`${tempCelsius}°C = ${tempFahrenheit}°F = ${tempKelvin}K`)

// 2. Pressure conversions
console.log('\n=== Pressure Conversions ===')
const pressureBar = 1
const pressurePsi = ThermodynamicUtils.convertPressure(pressureBar, 'bar', 'psi')
const pressurePa = ThermodynamicUtils.convertPressure(pressureBar, 'bar', 'pa')
console.log(`${pressureBar} bar = ${pressurePsi.toFixed(2)} psi = ${pressurePa} Pa`)

// 3. Energy conversions
console.log('\n=== Energy Conversions ===')
const energyKJ = 1000
const energyBTU = ThermodynamicUtils.convertEnergy(energyKJ, 'kj', 'btu')
const energyKWh = ThermodynamicUtils.convertEnergy(energyKJ, 'kj', 'kwh')
console.log(`${energyKJ} kJ = ${energyBTU.toFixed(2)} BTU = ${energyKWh.toFixed(4)} kWh`)

// 4. Molecular mass calculations
console.log('\n=== Molecular Mass Calculations ===')
const water = calculateMolecularMass('H2O')
console.log('Water (H2O):')
console.log(`  Formula: ${water.formula}`)
console.log(`  Total mass: ${water.totalMass.toFixed(3)} g/mol`)
console.log(`  Elements: ${JSON.stringify(water.elements)}`)
console.log(`  Fraction of O: ${(water.fraction.O * 100).toFixed(1)}%`)

const methane = MM('CH4')
console.log(`\nMethane (CH4): ${methane.totalMass.toFixed(3)} g/mol`)

// 5. Efficiency calculations
console.log('\n=== Efficiency Calculations ===')
const heatInput = 1000 // kW
const workOutput = 350 // kW
const efficiency = ThermodynamicUtils.calculateEfficiency(workOutput, heatInput)
const cop = ThermodynamicUtils.calculateCOP(workOutput, heatInput)
console.log(`Efficiency: ${efficiency.toFixed(1)}%`)
console.log(`COP: ${cop.toFixed(2)}`)

// 6. Combustion calculations
console.log('\n=== Combustion Calculations ===')
const fuelMass = 10 // kg of methane
const co2Production = MolecularUtils.calculateCO2Production('CH4', fuelMass)
const stoichiometricAir = MolecularUtils.calculateStoichiometricAir('CH4')
console.log(`CO2 from ${fuelMass} kg CH4: ${co2Production.toFixed(2)} kg`)
console.log(`Stoichiometric air requirement: ${stoichiometricAir.toFixed(2)} mol air/mol fuel`)

// 7. Common compounds
console.log('\n=== Common Compounds ===')
console.log('R134a:', COMMON_COMPOUNDS.R134a)
console.log('Methane:', COMMON_COMPOUNDS.CH4)
console.log('Carbon Dioxide:', COMMON_COMPOUNDS.CO2)

// 8. Plotting examples
console.log('\n=== Plotting Examples ===')

// Simple line plot
const xData = [1, 2, 3, 4, 5]
const yData = [2, 4, 6, 8, 10]
const linePlot = EnergyPlots.createLinePlot(
  xData, 
  yData, 
  'Linear Relationship', 
  'Input', 
  'Output'
)
console.log('Line plot created:', linePlot.isPlot)

// Efficiency comparison chart
const systems = ['Heat Pump', 'Boiler', 'Electric Heater']
const efficiencies = [300, 90, 98] // COP for heat pump, efficiency % for others
const efficiencyChart = EnergyPlots.createEfficiencyComparison(
  systems, 
  efficiencies, 
  'Heating System Performance'
)
console.log('Efficiency chart created:', efficiencyChart.isPlot)

// Pressure-enthalpy diagram data
const enthalpy = [200, 250, 400, 450, 200] // kJ/kg
const pressure = [1, 10, 10, 1, 1] // bar
const phDiagram = EnergyPlots.createPressureEnthalpyDiagram(
  enthalpy, 
  pressure, 
  'Refrigeration Cycle'
)
console.log('P-h diagram created:', phDiagram.isPlot)

// 9. Heat transfer calculations
console.log('\n=== Heat Transfer Calculations ===')
const mass = 100 // kg
const specificHeat = 4.18 // kJ/kg·K for water
const deltaT = 50 // K
const heatTransfer = ThermodynamicUtils.calculateHeatTransfer(mass, specificHeat, deltaT)
console.log(`Heat transfer: ${heatTransfer} kJ`)

// 10. Fluid flow calculations
console.log('\n=== Fluid Flow Calculations ===')
const density = 1000 // kg/m³
const velocity = 2 // m/s
const diameter = 0.1 // m
const viscosity = 0.001 // Pa·s
const reynolds = ThermodynamicUtils.calculateReynolds(density, velocity, diameter, viscosity)
console.log(`Reynolds number: ${reynolds}`)

// 11. Constants
console.log('\n=== Thermodynamic Constants ===')
console.log(`Universal gas constant: ${THERMODYNAMIC_CONSTANTS.R_UNIVERSAL} J/(mol·K)`)
console.log(`Standard pressure: ${THERMODYNAMIC_CONSTANTS.STANDARD_PRESSURE} Pa`)
console.log(`Critical temperature of water: ${THERMODYNAMIC_CONSTANTS.CRITICAL_TEMP_WATER} K`)

export {
  // Example functions that could be used in your SeeTech components
  tempCelsius,
  tempFahrenheit,
  tempKelvin,
  water,
  methane,
  efficiency,
  cop,
  linePlot,
  efficiencyChart,
  phDiagram
}
