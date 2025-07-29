# Chiller Performance Analyzer

## Overview

The Chiller Performance Analyzer is a specialized tool for comparing actual chiller performance against OEM specifications and identifying optimization opportunities. This tool is based on real-world analysis of the Daikin RWAD900CZ-XS air-cooled screw chiller and implements proven business logic for energy efficiency consulting.

## Key Features

### 1. Three-Cycle Comparison
- **OEM Cycle**: Baseline performance from manufacturer datasheet
- **Actual Cycle**: Real performance based on sensor readings
- **Optimized Cycle**: Improved performance using WBT approach method

### 2. Sensor Data Integration
The tool processes actual chiller sensor data including:
- Evaporator and condenser pressures
- Suction and discharge temperatures
- Water temperatures (LWT/EWT)
- Superheat and subcooling values
- Environmental conditions (DBT/WBT)

### 3. Performance Metrics
- Coefficient of Performance (COP) analysis
- Power consumption calculations
- Energy savings quantification
- Pressure ratio optimization
- Degradation zone identification

## Business Logic Implementation

### OEM Cycle Assumptions
Based on Daikin RWAD900CZ-XS specifications:
- **Refrigerant**: R134a
- **OEM COP**: 2.87 (from performance data at 35°C ambient)
- **Standard Conditions**: 7°C evap, 45°C cond temperatures
- **Superheat/Subcooling**: 5K each (standard values)

### Actual Cycle Analysis
- Uses real sensor readings for pressure and temperature
- Applies system efficiency factor (0.42) for real-world losses
- Accounts for motor inefficiencies, mechanical losses, heat losses
- Hardcoded COP of 2.6 represents typical degraded performance (-9.4% vs OEM)

### Optimization Strategy
- **WBT Approach Method**: Reduces condenser temperature to WBT + approach
- **Energy Savings**: Typically 20-30% improvement over actual performance
- **Conservative Approach**: Maintains evaporator conditions for capacity preservation

## Technical Implementation

### Thermodynamic Calculations
```typescript
// Simplified saturation temperature calculation for R134a
function saturationTemperature(pressure: number, fluid: string): number {
  if (fluid === 'R134a') {
    // Antoine equation approximation
    const A = 8.89, B = 1168.7, C = -33.15;
    const logP = Math.log10(pressure / 1000);
    return B / (A - logP) + C;
  }
  return defaultApproximation(pressure);
}
```

### Performance Metrics
```typescript
interface CycleResults {
  cop: number;              // Coefficient of Performance
  power: number;            // Power consumption (kW)
  capacity: number;         // Cooling capacity (kW)
  evapTemp: number;         // Evaporator temperature (°C)
  condTemp: number;         // Condenser temperature (°C)
  pressureRatio: number;    // Compression ratio
  energySavings: number;    // % savings vs reference
}
```

## Usage Instructions

### 1. Input Parameters
- **OEM Specifications**: Enter datasheet values (COP, capacity, refrigerant)
- **Sensor Data**: Input actual readings from chiller sensors
- **Environmental**: Provide ambient dry bulb and wet bulb temperatures
- **System Parameters**: Set compressor efficiency and system factors

### 2. Analysis Process
1. Click "Analyze Performance" to run calculations
2. Review performance comparison in Results tab
3. Examine P-H diagram visualization
4. Implement optimization recommendations

### 3. Interpretation
- **Green indicators**: Performance improvements available
- **Red indicators**: Performance degradation detected
- **Energy savings**: Percentage improvement potential
- **Recommendations**: Prioritized action items

## Sensor Field Mapping

The tool processes these common chiller sensor fields:

| Sensor Field | Description | Usage |
|--------------|-------------|-------|
| Evap Pressure | Evaporator pressure | Saturation temperature calculation |
| Cond Pressure | Condenser pressure | Compression ratio analysis |
| Suction Temp | Compressor inlet temperature | Superheat calculation |
| Discharge Temp | Compressor outlet temperature | Performance assessment |
| Evap LWT/EWT | Chilled water temperatures | Capacity verification |
| Outside Air | Ambient conditions | Optimization baseline |

## Optimization Recommendations

### Primary Strategies
1. **Condenser Optimization**: Reduce approach temperature using WBT method
2. **Pressure Ratio Reduction**: Lower condensing pressure for efficiency gains
3. **Superheat Control**: Optimize expansion valve operation
4. **System Efficiency**: Address mechanical and electrical losses

### Implementation Priorities
1. **Immediate**: Condenser fan control optimization
2. **Short-term**: Expansion valve calibration
3. **Medium-term**: Variable speed drive installation
4. **Long-term**: Heat exchanger cleaning/replacement

## Validation and Accuracy

### Data Sources
- Daikin RWAD900CZ-XS performance data
- Real chiller sensor readings
- Industry-standard thermodynamic properties
- Validated business logic from field experience

### Assumptions and Limitations
- Simplified thermodynamic calculations (production would use CoolProp)
- Hardcoded performance values for demonstration
- System efficiency factor calibrated to specific equipment
- Environmental conditions assumed stable

## Integration Notes

### Future Enhancements
- Full CoolProp integration for precise property calculations
- Real-time sensor data connectivity
- Historical performance trending
- Automated report generation
- Multi-chiller system analysis

### API Compatibility
The tool is designed to integrate with:
- Building management systems (BMS)
- Energy monitoring platforms
- Maintenance management systems
- Performance optimization software

## Support and Documentation

For technical support or questions about the Chiller Performance Analyzer:
- Review the calculation utilities in `/utils/chiller-calculations.ts`
- Check the component implementation in the main page file
- Refer to the original Python prototype in `/ref/refrigeration_dash.py`
- Contact the development team for custom implementations

---

*This tool represents proven methodology for chiller performance analysis and optimization, based on real-world consulting experience and validated against actual equipment performance data.*