# Enhanced P-H Analyzer - Vapor Compression Cycle Tool

## Overview
The P-H Analyzer is a comprehensive thermodynamic analysis tool for vapor compression refrigeration cycles, featuring real-time CoolProp calculations and interactive Plotly visualizations. This enhanced version provides professional-grade analysis capabilities for HVAC engineers and mechanical engineers.

## Key Features

### 🔬 **Advanced Thermodynamic Analysis**
- **Real CoolProp Integration**: Uses WASM-based CoolProp for accurate thermodynamic properties
- **Multiple Refrigerants**: Support for R134a, R410A, R32, R290, R600a, R717, R744, and more
- **4-Point Vapor Compression Cycle**: Complete analysis of compression, condensation, expansion, and evaporation processes
- **Enhanced Performance Metrics**: COP, EER, SEER, pressure ratios, efficiencies, and more

### 📊 **Professional Visualization**
- **Interactive P-H Diagrams**: Pressure-Enthalpy diagrams with cycle plotting
- **Isotherms**: Constant temperature lines for detailed analysis
- **Isobars**: Constant pressure lines across the diagram
- **Quality Lines**: Constant dryness fraction lines in two-phase region
- **Cycle Point Annotations**: Clear labeling of thermodynamic states

### 🎛️ **Comprehensive Input Parameters**
- **System Configuration**: Refrigerant selection and system type (cooling, heat pump, refrigeration)
- **Operating Conditions**: Evaporator/condenser temperatures, ambient/indoor conditions
- **Cycle Parameters**: Superheating, subcooling, capacities, and efficiencies
- **Advanced Options**: Isentropic efficiency, volumetric efficiency
- **Visualization Controls**: Toggle isotherms, isobars, quality lines

### 📈 **Detailed Process Analysis**
- **Compression Process**: Work input, temperature rise, pressure ratios
- **Condensation Process**: Heat rejection, subcooling, approach temperatures
- **Expansion Process**: Pressure drops, quality analysis, throttling effects
- **Evaporation Process**: Cooling effects, superheating, heat transfer analysis

### 💡 **Intelligent Recommendations**
- **Performance Optimization**: Automatic identification of improvement opportunities
- **Best Practice Indicators**: Highlighting optimal operating conditions
- **System Sizing**: Refrigerant charge estimation and flow rate calculations
- **Efficiency Analysis**: Comparative performance metrics

## Technical Specifications

### Supported Refrigerants
- **HFC Refrigerants**: R134a, R410A, R32
- **Natural Refrigerants**: R290 (Propane), R600a (Isobutane), R717 (Ammonia), R744 (CO₂)
- **HFO Refrigerants**: R1234yf, R1234ze
- **Legacy Refrigerants**: R22 (for existing system analysis)

### Calculation Accuracy
- **CoolProp NIST Database**: Reference-quality thermodynamic properties
- **Temperature Range**: -40°C to +100°C operating range
- **Pressure Range**: 0.5 bar to 50 bar working pressures
- **Precision**: ±0.1% accuracy for most properties

### Performance Metrics Calculated
- **Coefficient of Performance (COP)**: Both cooling and heating modes
- **Energy Efficiency Ratio (EER)**: Standard and seasonal ratings
- **Pressure Ratios**: Compression efficiency indicators
- **Mass Flow Rates**: System sizing parameters
- **Volumetric Flow Rates**: Compressor selection criteria
- **Refrigerant Charge**: Environmental impact assessment

## Usage Guide

### Basic Operation
1. **Select Refrigerant**: Choose from comprehensive list of working fluids
2. **Set Operating Conditions**: Configure evaporator and condenser temperatures
3. **Adjust Cycle Parameters**: Set superheating, subcooling, and capacities
4. **Configure Analysis**: Enable advanced visualization options
5. **Calculate Cycle**: Generate complete thermodynamic analysis

### Advanced Features
- **Environmental Analysis**: Include ambient and indoor temperature effects
- **Efficiency Optimization**: Adjust isentropic and volumetric efficiencies
- **Detailed Visualization**: Enable isotherms, isobars, and quality lines
- **Process Analysis**: Review detailed thermodynamic process breakdown

### Professional Applications
- **HVAC System Design**: Optimize cooling and heating system performance
- **Energy Auditing**: Analyze existing system efficiency and improvements
- **Equipment Selection**: Size compressors, heat exchangers, and controls
- **Refrigeration Design**: Cold storage and industrial cooling applications
- **Heat Pump Analysis**: Heating system optimization and performance

## File Structure
```
ph-analyzer/
├── page.tsx                 # Main analyzer interface
├── types.ts                 # TypeScript type definitions
├── calculations.ts          # CoolProp integration and cycle calculations
├── components/
│   ├── InputForm.tsx        # Parameter input interface
│   ├── PHDiagram.tsx        # Interactive P-H diagram visualization
│   ├── ResultsDisplay.tsx   # Basic performance results
│   └── ProcessAnalysis.tsx  # Detailed thermodynamic analysis
└── examples.ts              # Sample configurations and use cases
```

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Thermodynamics**: CoolProp WASM (v6.4+)
- **Visualization**: Plotly.js for interactive diagrams
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React hooks for real-time calculations

## Engineering Applications

### HVAC Design
- Air conditioning system optimization
- Heat pump performance analysis
- Chiller plant efficiency studies
- Building cooling load calculations

### Refrigeration Systems
- Cold storage design and optimization
- Industrial refrigeration analysis
- Food processing cooling systems
- Pharmaceutical cold chain design

### Research & Development
- New refrigerant evaluation
- Cycle modification studies
- Heat exchanger optimization
- Compressor performance analysis

## Best Practices
1. **Validate Input Ranges**: Ensure operating conditions are within refrigerant limits
2. **Consider Real Conditions**: Include ambient temperature and fouling effects
3. **Optimize Gradually**: Make incremental changes to observe performance impacts
4. **Document Results**: Export diagrams and data for reporting and validation
5. **Safety Considerations**: Verify pressure and temperature limits for all components

## Future Enhancements
- Multi-stage compression cycles
- Transcritical CO₂ cycle analysis
- Economic optimization calculations
- Advanced cycle configurations (economizer, flash tank)
- Real-time system monitoring integration

## Support & Documentation
For technical support, calculation validation, or feature requests, refer to the main SeeTech Internal documentation or contact the development team.

---
*Enhanced P-H Analyzer - Professional vapor compression cycle analysis for modern HVAC and refrigeration applications.*
