// Example Component using CoolProp WASM Integration
// This shows how to use your actual CoolProp library in SeeTech

'use client';

import React, { useEffect, useState } from 'react';
import { 
  initializeLibraries, 
  props, 
  HAprops, 
  phase, 
  MM, 
  plot, 
  math 
} from './coolprop-integration';

interface ThermodynamicCalculation {
  temperature: number;
  pressure: number;
  density?: number;
  enthalpy?: number;
  entropy?: number;
  phase?: string;
}

const CoolPropExample: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculation, setCalculation] = useState<ThermodynamicCalculation | null>(null);
  const [molecularMass, setMolecularMass] = useState<any>(null);
  const [plotData, setPlotData] = useState<any>(null);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        await initializeLibraries();
        setIsLoaded(true);
        
        // Example calculations once libraries are loaded
        performCalculations();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load CoolProp');
      }
    };

    loadLibraries();
  }, []);

  const performCalculations = async () => {
    try {
      // Example 1: Water properties at 25°C and 1 atm
      const temp = 25 + 273.15; // Convert to Kelvin
      const pressure = 101325; // Pa
      
      // Calculate water properties
      const density = props('D', 'Water', { T: temp, P: pressure });
      const enthalpy = props('H', 'Water', { T: temp, P: pressure });
      const entropy = props('S', 'Water', { T: temp, P: pressure });
      const phaseState = phase('Water', { T: temp, P: pressure });
      
      setCalculation({
        temperature: temp - 273.15,
        pressure: pressure / 1000, // Convert to kPa
        density: math.number(density),
        enthalpy: math.number(enthalpy) / 1000, // Convert to kJ/kg
        entropy: math.number(entropy) / 1000, // Convert to kJ/kg·K
        phase: phaseState
      });

      // Example 2: Molecular mass calculation
      const waterMM = MM('H2O');
      setMolecularMass(waterMM);

      // Example 3: Create a simple plot
      const plotResult = plot(
        [{
          x: [1, 2, 3, 4, 5],
          y: [2, 4, 6, 8, 10],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Linear Data'
        }],
        {
          title: 'Sample Energy Data',
          xaxis: { title: 'Time (hours)' },
          yaxis: { title: 'Energy (kWh)' }
        }
      );
      setPlotData(plotResult);

    } catch (err) {
      console.error('Calculation error:', err);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  const calculateRefrigerantProperties = async () => {
    try {
      // Calculate R134a properties at different states
      const evapTemp = 273.15 - 10; // -10°C
      const condTemp = 273.15 + 40; // 40°C
      
      // State 1: Saturated vapor at evaporator
      const h1 = props('H', 'R134a', { T: evapTemp, Q: 1 });
      const s1 = props('S', 'R134a', { T: evapTemp, Q: 1 });
      const p1 = props('P', 'R134a', { T: evapTemp, Q: 1 });
      
      // State 2: Superheated vapor after compression (isentropic)
      const p2 = props('P', 'R134a', { T: condTemp, Q: 1 });
      const h2 = props('H', 'R134a', { P: math.number(p2), S: math.number(s1) });
      
      // State 3: Saturated liquid at condenser
      const h3 = props('H', 'R134a', { T: condTemp, Q: 0 });
      
      // State 4: After throttling (h4 = h3)
      const h4 = h3;
      
      // Calculate COP
      const qEvap = math.number(h1) - math.number(h4);
      const wComp = math.number(h2) - math.number(h1);
      const cop = qEvap / wComp;
      
      console.log('Refrigeration Cycle Analysis:');
      console.log(`Evaporator heat absorption: ${qEvap/1000} kJ/kg`);
      console.log(`Compressor work: ${wComp/1000} kJ/kg`);
      console.log(`COP: ${cop.toFixed(2)}`);
      
      // Create P-h diagram data
      const enthalpy = [
        math.number(h4)/1000, 
        math.number(h1)/1000, 
        math.number(h2)/1000, 
        math.number(h3)/1000, 
        math.number(h4)/1000
      ];
      const pressure = [
        math.number(p1)/1000, 
        math.number(p1)/1000, 
        math.number(p2)/1000, 
        math.number(p2)/1000, 
        math.number(p1)/1000
      ];
      
      const phDiagram = plot(
        [{
          x: enthalpy,
          y: pressure,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'R134a Cycle',
          line: { color: '#ff7f0e', width: 3 },
          marker: { color: '#ff7f0e', size: 8 }
        }],
        {
          title: 'R134a Refrigeration Cycle - P-h Diagram',
          xaxis: { title: 'Specific Enthalpy (kJ/kg)' },
          yaxis: { title: 'Pressure (kPa)', type: 'log' }
        }
      );
      
      setPlotData(phDiagram);
      
    } catch (err) {
      console.error('Refrigerant calculation error:', err);
    }
  };

  const calculateCombustion = async () => {
    try {
      // Calculate combustion properties for methane
      const methane = MM('CH4');
      const co2 = MM('CO2');
      const h2o = MM('H2O');
      
      console.log('Combustion Analysis:');
      console.log(`Methane molar mass: ${methane.totalMass} g/mol`);
      console.log(`CO2 molar mass: ${co2.totalMass} g/mol`);
      console.log(`H2O molar mass: ${h2o.totalMass} g/mol`);
      
      // Stoichiometric combustion: CH4 + 2O2 → CO2 + 2H2O
      const fuelMass = 10; // kg of methane
      const co2Production = (fuelMass / methane.totalMass) * co2.totalMass;
      const h2oProduction = (fuelMass / methane.totalMass) * 2 * h2o.totalMass;
      
      console.log(`From ${fuelMass} kg CH4:`);
      console.log(`CO2 produced: ${co2Production.toFixed(2)} kg`);
      console.log(`H2O produced: ${h2oProduction.toFixed(2)} kg`);
      
    } catch (err) {
      console.error('Combustion calculation error:', err);
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Loading CoolProp...</h2>
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CoolProp Integration Example</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Properties */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Water Properties (25°C, 1 atm)</h2>
          {calculation && (
            <div className="space-y-2">
              <p><strong>Temperature:</strong> {calculation.temperature.toFixed(1)}°C</p>
              <p><strong>Pressure:</strong> {calculation.pressure.toFixed(1)} kPa</p>
              <p><strong>Density:</strong> {calculation.density?.toFixed(2)} kg/m³</p>
              <p><strong>Enthalpy:</strong> {calculation.enthalpy?.toFixed(2)} kJ/kg</p>
              <p><strong>Entropy:</strong> {calculation.entropy?.toFixed(3)} kJ/kg·K</p>
              <p><strong>Phase:</strong> {calculation.phase}</p>
            </div>
          )}
        </div>

        {/* Molecular Mass */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Molecular Mass (H₂O)</h2>
          {molecularMass && (
            <div className="space-y-2">
              <p><strong>Formula:</strong> {molecularMass.formula}</p>
              <p><strong>Total Mass:</strong> {molecularMass.totalMass.toFixed(3)} g/mol</p>
              <p><strong>Elements:</strong> {JSON.stringify(molecularMass.elements)}</p>
              <p><strong>Oxygen Fraction:</strong> {(molecularMass.fraction.O * 100).toFixed(1)}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-x-4">
        <button 
          onClick={calculateRefrigerantProperties}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate R134a Cycle
        </button>
        <button 
          onClick={calculateCombustion}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Combustion Analysis
        </button>
      </div>

      {/* Plot Display */}
      {plotData && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Plot Data</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(plotData, null, 2)}
            </pre>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This plot data can be used with Plotly.js or React-Plotly.js
          </p>
        </div>
      )}
    </div>
  );
};

export default CoolPropExample;
