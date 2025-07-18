# SeeTech Energy Efficiency Utilities

This utilities library contains thermodynamic properties, molecular mass calculations, and plotting functions extracted from your Engineering-Solver project. These utilities are designed to support energy efficiency calculations and visualizations for SeeTech's consulting tools.

## Features

### 🌡️ Thermodynamic Properties
- **Fluid Properties**: Complete property units mapping for CoolProp compatibility
- **Unit Conversions**: Temperature, pressure, energy, and power conversions
- **Thermodynamic Constants**: Physical constants for engineering calculations
- **Heat Transfer**: Reynolds, Prandtl, and Nusselt number calculations
- **Efficiency Calculations**: COP, efficiency, and performance metrics

### 🧪 Molecular Mass Calculations
- **Chemical Formula Parsing**: Parse simple chemical formulas (H2O, CO2, etc.)
- **Molecular Mass**: Calculate molar mass from chemical formulas
- **Combustion Analysis**: Stoichiometric air requirements and CO2 production
- **Common Compounds**: Pre-defined database of fuels, refrigerants, and chemicals
- **Mass Balance**: Element fraction and percentage calculations

### 📊 Plotting Utilities
- **Plotly Integration**: TypeScript interfaces for Plotly.js
- **Energy-Specific Plots**: P-h diagrams, T-s diagrams, efficiency charts
- **Thermodynamic Cycles**: Refrigeration and power cycle visualizations
- **Heat Exchanger Plots**: Effectiveness and NTU relationships
- **Psychrometric Charts**: Humid air property plotting

## Installation

The utilities are already included in your SeeTech project. Simply import what you need:

```typescript
import {
  ThermodynamicUtils,
  MolecularUtils,
  EnergyPlots,
  calculateMolecularMass,
  MM,
  COMMON_COMPOUNDS,
  THERMODYNAMIC_CONSTANTS
} from './utils'
```

## Usage Examples

### Temperature Conversions
```typescript
import { ThermodynamicUtils } from './utils'

const tempC = 25
const tempF = ThermodynamicUtils.convertTemperature(tempC, 'C', 'F')
const tempK = ThermodynamicUtils.convertTemperature(tempC, 'C', 'K')
console.log(`${tempC}°C = ${tempF}°F = ${tempK}K`)
```

### Molecular Mass Calculations
```typescript
import { calculateMolecularMass, MM } from './utils'

// Calculate molecular mass of water
const water = calculateMolecularMass('H2O')
console.log(`Water molar mass: ${water.totalMass} g/mol`)
console.log(`Oxygen fraction: ${(water.fraction.O * 100).toFixed(1)}%`)

// Shorthand notation
const methane = MM('CH4')
console.log(`Methane: ${methane.totalMass} g/mol`)
```

### Efficiency Calculations
```typescript
import { ThermodynamicUtils } from './utils'

const heatInput = 1000 // kW
const workOutput = 350 // kW
const efficiency = ThermodynamicUtils.calculateEfficiency(workOutput, heatInput)
const cop = ThermodynamicUtils.calculateCOP(workOutput, heatInput)
console.log(`Efficiency: ${efficiency}%`)
console.log(`COP: ${cop}`)
```

### Combustion Analysis
```typescript
import { MolecularUtils } from './utils'

const fuelMass = 10 // kg of methane
const co2Production = MolecularUtils.calculateCO2Production('CH4', fuelMass)
const stoichiometricAir = MolecularUtils.calculateStoichiometricAir('CH4')
console.log(`CO2 from ${fuelMass} kg CH4: ${co2Production} kg`)
```

### Plotting Energy Data
```typescript
import { EnergyPlots } from './utils'

// Create efficiency comparison chart
const systems = ['Heat Pump', 'Boiler', 'Electric Heater']
const efficiencies = [300, 90, 98]
const chart = EnergyPlots.createEfficiencyComparison(
  systems, 
  efficiencies, 
  'Heating System Performance'
)

// Create pressure-enthalpy diagram
const enthalpy = [200, 250, 400, 450, 200] // kJ/kg
const pressure = [1, 10, 10, 1, 1] // bar
const phDiagram = EnergyPlots.createPressureEnthalpyDiagram(
  enthalpy, 
  pressure, 
  'Refrigeration Cycle'
)
```

### Heat Transfer Calculations
```typescript
import { ThermodynamicUtils } from './utils'

const reynolds = ThermodynamicUtils.calculateReynolds(
  1000, // density kg/m³
  2,    // velocity m/s
  0.1,  // diameter m
  0.001 // viscosity Pa·s
)
console.log(`Reynolds number: ${reynolds}`)
```

### Using Common Compounds
```typescript
import { COMMON_COMPOUNDS } from './utils'

console.log('R134a:', COMMON_COMPOUNDS.R134a)
console.log('Methane:', COMMON_COMPOUNDS.CH4)
console.log('Available refrigerants:', Object.keys(COMMON_COMPOUNDS)
  .filter(key => COMMON_COMPOUNDS[key].type === 'refrigerant'))
```

## API Reference

### ThermodynamicUtils
- `convertTemperature(value, fromUnit, toUnit)`: Convert between temperature units
- `convertPressure(value, fromUnit, toUnit)`: Convert between pressure units
- `convertEnergy(value, fromUnit, toUnit)`: Convert between energy units
- `convertPower(value, fromUnit, toUnit)`: Convert between power units
- `calculateEfficiency(output, input, unit)`: Calculate efficiency percentage
- `calculateCOP(output, input)`: Calculate coefficient of performance
- `calculateHeatTransfer(mass, specificHeat, deltaT)`: Calculate heat transfer rate
- `calculateReynolds(density, velocity, diameter, viscosity)`: Calculate Reynolds number
- `calculatePrandtl(viscosity, specificHeat, thermalConductivity)`: Calculate Prandtl number
- `calculateNusselt(reynolds, prandtl, geometry)`: Calculate Nusselt number

### MolecularUtils
- `getMolarMass(formula)`: Get molar mass from chemical formula
- `calculateMoles(mass, molarMass)`: Calculate number of moles
- `calculateMass(moles, molarMass)`: Calculate mass from moles
- `calculateMassPercentage(formula, element)`: Calculate element mass percentage
- `calculateStoichiometricAir(fuelFormula)`: Calculate stoichiometric air requirement
- `calculateCO2Production(fuelFormula, fuelMass)`: Calculate CO2 production from fuel
- `calculateEquivalenceRatio(fuelMass, airMass, fuelFormula)`: Calculate equivalence ratio

### EnergyPlots
- `createLinePlot(x, y, title, xLabel, yLabel, options)`: Create line plot
- `createScatterPlot(x, y, title, xLabel, yLabel, options)`: Create scatter plot
- `createBarChart(x, y, title, xLabel, yLabel, options)`: Create bar chart
- `createPressureEnthalpyDiagram(enthalpy, pressure, title, options)`: Create P-h diagram
- `createTemperatureEntropyDiagram(entropy, temperature, title, options)`: Create T-s diagram
- `createEfficiencyComparison(systems, efficiencies, title, options)`: Create efficiency chart
- `createPsychrometricData(dryBulbTemp, humidity, title, options)`: Create psychrometric chart
- `createHeatExchangerPlot(ntu, effectiveness, title, options)`: Create heat exchanger plot

## Constants and Data

### THERMODYNAMIC_CONSTANTS
Physical constants for engineering calculations:
- `R_UNIVERSAL`: Universal gas constant (8.314 J/(mol·K))
- `STANDARD_PRESSURE`: Standard atmospheric pressure (101325 Pa)
- `CRITICAL_TEMP_WATER`: Critical temperature of water (647.096 K)
- And many more...

### COMMON_COMPOUNDS
Pre-defined database of compounds with molar masses and types:
- **Fuels**: CH4, C2H6, C3H8, C8H18, C2H5OH, etc.
- **Refrigerants**: R134a, R410A, R32, R125, etc.
- **Combustion Products**: CO2, H2O, CO, NO, NO2, etc.
- **Air Components**: N2, O2, Ar

## Integration with SeeTech Components

These utilities can be integrated into your SeeTech React components:

```typescript
// In a React component
import { ThermodynamicUtils, EnergyPlots } from '@/utils'

const EnergyCalculator = () => {
  const [temperature, setTemperature] = useState(25)
  const [efficiency, setEfficiency] = useState(0)
  
  useEffect(() => {
    const tempK = ThermodynamicUtils.convertTemperature(temperature, 'C', 'K')
    // Use tempK for calculations...
  }, [temperature])
  
  const plotData = EnergyPlots.createLinePlot(
    [1, 2, 3, 4, 5],
    [20, 25, 30, 35, 40],
    'Temperature vs Time',
    'Time (hours)',
    'Temperature (°C)'
  )
  
  return (
    <div>
      {/* Your component JSX */}
      <Plot data={plotData.data} layout={plotData.layout} config={plotData.config} />
    </div>
  )
}
```

## Files Structure

```
src/utils/
├── index.ts                           # Main exports
├── examples.ts                        # Usage examples
├── thermodynamics/
│   ├── fluid-properties.ts           # Thermodynamic properties and conversions
│   └── molecular-mass.ts             # Molecular mass calculations
└── plotting/
    └── plotly-utils.ts               # Plotly visualization utilities
```

## Notes

- These utilities are extracted from your Engineering-Solver project
- All functions include proper TypeScript typing
- No external dependencies beyond standard JavaScript
- Compatible with CoolProp property naming conventions
- Designed for energy efficiency and HVAC applications
- Ready to integrate with Plotly.js for visualizations

## Future Enhancements

- Add psychrometric property calculations
- Include more refrigerant properties
- Add steam table calculations
- Implement more heat exchanger correlations
- Add building energy modeling utilities
