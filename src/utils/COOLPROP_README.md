# 🧪 CoolProp WASM Integration for SeeTech

This integration brings your **Engineering-Solver** CoolProp WASM library directly into SeeTech for real thermodynamic property calculations.

## 📁 Files Structure

```
public/
├── coolprop.js          # CoolProp JavaScript binding
├── coolprop.wasm        # CoolProp WASM binary (your pre-compiled library)
├── math.js              # Math.js library
├── fluidProperties.js   # Your fluid properties helper functions
├── molecularMass.js     # Your molecular mass calculations
└── mathWorker.js        # Math worker for plotting

src/utils/
├── coolprop-integration.tsx  # TypeScript integration wrapper
├── coolprop-example.tsx      # Complete usage example
└── index.ts                  # Main exports
```

## 🚀 Quick Start

```typescript
import { initializeLibraries, props, HAprops, phase, MM, plot } from '@/utils'

// Initialize libraries (call once in your app)
await initializeLibraries()

// Calculate water properties at 25°C, 1 atm
const density = props('D', 'Water', { T: 298.15, P: 101325 })
const enthalpy = props('H', 'Water', { T: 298.15, P: 101325 })
const phase = phase('Water', { T: 298.15, P: 101325 })

// Molecular mass calculation
const water = MM('H2O')
console.log(`Water molar mass: ${water.totalMass} g/mol`)

// Create plots
const plotData = plot([{
  x: [1, 2, 3, 4, 5],
  y: [2, 4, 6, 8, 10],
  type: 'scatter',
  mode: 'lines+markers'
}], {
  title: 'Energy Data',
  xaxis: { title: 'Time (h)' },
  yaxis: { title: 'Energy (kWh)' }
})
```

## 🔧 Available Functions

### **Thermodynamic Properties**

#### `props(property, fluid, fluidProperties)`
Calculate thermodynamic properties using CoolProp.

```typescript
// Temperature and pressure inputs
const density = props('D', 'Water', { T: 298.15, P: 101325 })
const enthalpy = props('H', 'R134a', { T: 273.15, P: 400000 })

// Quality input for two-phase states
const h_vapor = props('H', 'Water', { P: 101325, Q: 1 })
const h_liquid = props('H', 'Water', { P: 101325, Q: 0 })

// Phase-specific properties
const density_liquid = props('D', 'Water', { 'T|liquid': 461.1, P: 5e6 })
const density_gas = props('D', 'Water', { T: 597.9, 'P|gas': 5e6 })
```

**Common Properties:**
- `T` - Temperature (K)
- `P` - Pressure (Pa)
- `D` - Density (kg/m³)
- `H` - Enthalpy (J/kg)
- `S` - Entropy (J/kg/K)
- `C` - Specific heat (J/kg/K)
- `Q` - Quality (0-1)
- `V` - Viscosity (Pa·s)
- `L` - Thermal conductivity (W/m/K)

**Supported Fluids:**
- `Water`, `R134a`, `R410A`, `R32`, `R125`, `R407C`, `R22`
- `CO2`, `Ammonia`, `Propane`, `Methane`, `Ethane`
- `Air`, `Nitrogen`, `Oxygen`, `Argon`

### **Humid Air Properties**

#### `HAprops(property, fluidProperties)`
Calculate humid air properties.

```typescript
// Humidity ratio from temperature, pressure, and relative humidity
const W = HAprops('W', { T: 298.15, P: 101325, R: 0.5 })

// Dew point temperature
const Tdp = HAprops('Tdp', { T: 298.15, P: 101325, R: 0.5 })

// Enthalpy of humid air
const H = HAprops('H', { T: 298.15, P: 101325, R: 0.5 })
```

**Properties:**
- `W` - Humidity ratio (kg/kg)
- `R` - Relative humidity (0-1)
- `Tdp` - Dew point temperature (K)
- `Twb` - Wet bulb temperature (K)
- `H` - Enthalpy (J/kg)
- `S` - Entropy (J/kg/K)
- `V` - Specific volume (m³/kg)

### **Phase Detection**

#### `phase(fluid, fluidProperties)`
Determine the phase of a fluid.

```typescript
const liquidPhase = phase('Water', { P: 101325, Q: 0 })  // 'liquid'
const vaporPhase = phase('Water', { P: 101325, Q: 1 })   // 'gas'
const twoPhase = phase('Water', { P: 101325, Q: 0.5 })   // 'twophase'
```

### **Molecular Mass**

#### `MM(formula)`
Calculate molecular mass and composition.

```typescript
const water = MM('H2O')
// Returns: {
//   formula: 'H2O',
//   totalMass: 18.015,
//   elements: { H: 2, O: 1 },
//   molecularMass: { H: 2.016, O: 15.999 },
//   fraction: { H: 0.112, O: 0.888 }
// }

const glucose = MM('C6H12O6')
const sulfuricAcid = MM('H2SO4')
const methane = MM('CH4')
```

### **Plotting**

#### `plot(data, layout, config)`
Create Plotly-compatible plots.

```typescript
const plotData = plot([{
  x: [1, 2, 3, 4, 5],
  y: [10, 20, 30, 40, 50],
  type: 'scatter',
  mode: 'lines+markers',
  name: 'Data Series'
}], {
  title: 'Energy Efficiency Analysis',
  xaxis: { title: 'Time (hours)' },
  yaxis: { title: 'Power (kW)' }
}, {
  responsive: true
})
```

## 📊 Engineering Examples

### **Refrigeration Cycle Analysis**

```typescript
// R134a refrigeration cycle
const evapTemp = 263.15  // -10°C
const condTemp = 313.15  // 40°C

// State points
const h1 = props('H', 'R134a', { T: evapTemp, Q: 1 })    // Evaporator exit
const s1 = props('S', 'R134a', { T: evapTemp, Q: 1 })
const p2 = props('P', 'R134a', { T: condTemp, Q: 1 })
const h2 = props('H', 'R134a', { P: p2, S: s1 })         // Compressor exit
const h3 = props('H', 'R134a', { T: condTemp, Q: 0 })    // Condenser exit
const h4 = h3  // Throttling process

// Performance metrics
const qEvap = math.number(h1) - math.number(h4)  // Cooling capacity
const wComp = math.number(h2) - math.number(h1)  // Compressor work
const cop = qEvap / wComp                         // Coefficient of performance

console.log(`COP: ${cop.toFixed(2)}`)
```

### **Combustion Analysis**

```typescript
// Methane combustion: CH4 + 2O2 → CO2 + 2H2O
const methane = MM('CH4')
const oxygen = MM('O2')
const co2 = MM('CO2')
const water = MM('H2O')

const fuelMass = 10  // kg of methane
const airFuelRatio = 17.2  // stoichiometric for methane

// Products
const co2Mass = (fuelMass / methane.totalMass) * co2.totalMass
const h2oMass = (fuelMass / methane.totalMass) * 2 * water.totalMass

console.log(`CO2 produced: ${co2Mass.toFixed(2)} kg`)
console.log(`H2O produced: ${h2oMass.toFixed(2)} kg`)
```

### **Heat Exchanger Analysis**

```typescript
// Hot water cooling from 80°C to 60°C
const hotInlet = props('H', 'Water', { T: 353.15, P: 101325 })
const hotOutlet = props('H', 'Water', { T: 333.15, P: 101325 })
const specificHeat = props('C', 'Water', { T: 343.15, P: 101325 })

const massFlow = 1  // kg/s
const heatTransfer = massFlow * (math.number(hotInlet) - math.number(hotOutlet))

console.log(`Heat transfer rate: ${heatTransfer/1000} kW`)
```

### **Psychrometric Analysis**

```typescript
// HVAC system design
const outsideTemp = 308.15  // 35°C
const insideTemp = 298.15   // 25°C
const outsideRH = 0.8       // 80% RH
const insideRH = 0.5        // 50% RH

// Outside conditions
const outsideW = HAprops('W', { T: outsideTemp, P: 101325, R: outsideRH })
const outsideH = HAprops('H', { T: outsideTemp, P: 101325, R: outsideRH })

// Inside conditions
const insideW = HAprops('W', { T: insideTemp, P: 101325, R: insideRH })
const insideH = HAprops('H', { T: insideTemp, P: 101325, R: insideRH })

// Cooling load
const airFlow = 1000  // kg/h
const sensibleLoad = airFlow * (math.number(outsideH) - math.number(insideH))
const latentLoad = airFlow * 2501000 * (math.number(outsideW) - math.number(insideW))

console.log(`Sensible load: ${sensibleLoad/1000} kW`)
console.log(`Latent load: ${latentLoad/1000} kW`)
```

## 🎯 React Integration

### **Using the Hook**

```typescript
import { useCoolProp } from '@/utils'

const ThermodynamicCalculator = () => {
  const { isLoaded, error, props, MM, plot } = useCoolProp()

  if (!isLoaded) return <div>Loading CoolProp...</div>
  if (error) return <div>Error: {error}</div>

  // Use props, MM, plot functions here
  const density = props('D', 'Water', { T: 298.15, P: 101325 })
  
  return (
    <div>
      <h2>Water density: {math.number(density).toFixed(2)} kg/m³</h2>
    </div>
  )
}
```

### **Manual Initialization**

```typescript
import { initializeLibraries, props } from '@/utils'

const App = () => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    initializeLibraries().then(() => {
      setIsReady(true)
    })
  }, [])

  // Use CoolProp functions after isReady is true
}
```

## 🔧 Math.js Integration

Your Math.js library with units support is also available:

```typescript
import { math } from '@/utils'

// Unit calculations
const pressure = math.unit(1, 'bar')
const pressurePsi = math.unit(pressure, 'psi')

// Expressions
const result = math.evaluate('2 * 3 + 4')
const unitResult = math.evaluate('1 atm to Pa')
```

## 📝 Notes

1. **Library Loading**: CoolProp WASM must be loaded before use. Use `initializeLibraries()` or the `useCoolProp` hook.

2. **Units**: All inputs and outputs use SI units (K, Pa, J/kg, etc.) unless otherwise specified.

3. **Error Handling**: Always wrap CoolProp calls in try-catch blocks for production use.

4. **Performance**: CoolProp calculations are fast, but initialize libraries only once per app lifecycle.

5. **Browser Compatibility**: Requires WebAssembly support (all modern browsers).

## 🎉 Ready to Use!

Your actual CoolProp WASM library from Engineering-Solver is now integrated into SeeTech with full TypeScript support. You can perform real thermodynamic calculations, molecular mass analysis, and create engineering plots just like in your original project!
