'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChillerProposalData } from '@/components/templates/chiller-proposal/types';

declare global {
  interface Window {
    CoolProp?: any;
    Plotly?: any;
  }
}

interface PHChartProps {
  proposalData: ChillerProposalData;
  className?: string;
}

// Enhanced thermodynamic cycle calculation using CoolProp
const calculateThermodynamicCycle = async (proposalData: ChillerProposalData) => {
  if (!window.CoolProp) {
    throw new Error('CoolProp not available');
  }

  const CP = window.CoolProp;
  const refrigerant = proposalData.refrigerant || 'R410A';
  
  try {
    // Convert temperatures to Kelvin - with fallback values
    const tEvap = parseFloat(proposalData.evapTemp || '7') + 273.15;
    const tCond = parseFloat(proposalData.condTemp || '45') + 273.15;
    
    // Calculate saturation pressures
    const pEvap = CP.PropsSI('P', 'T', tEvap, 'Q', 1, refrigerant) / 1000; // Convert to kPa
    const pCond = CP.PropsSI('P', 'T', tCond, 'Q', 0, refrigerant) / 1000; // Convert to kPa
    
    // Calculate cycle state points with enhanced accuracy
    const calculateCyclePoints = (efficiency = 1.0, degradation = 0.0) => {
      // State 1: Evaporator exit (saturated vapor)
      const h1 = CP.PropsSI('H', 'T', tEvap, 'Q', 1, refrigerant) / 1000; // kJ/kg
      const s1 = CP.PropsSI('S', 'T', tEvap, 'Q', 1, refrigerant);
      
      // State 2: Compressor exit (with isentropic efficiency)
      const h2s = CP.PropsSI('H', 'P', pCond * 1000, 'S', s1, refrigerant) / 1000;
      const isentropicEff = parseFloat(proposalData.compressorEfficiency || '0.85') * efficiency * (1 - degradation);
      const h2 = h1 + (h2s - h1) / isentropicEff;
      
      // State 3: Condenser exit (saturated liquid)
      const h3 = CP.PropsSI('H', 'T', tCond, 'Q', 0, refrigerant) / 1000;
      
      // State 4: Expansion valve exit (constant enthalpy)
      const h4 = h3;
      
      // Additional intermediate points for better visualization
      const h1_2 = h1 + (h2 - h1) * 0.5; // Mid-compression
      const h2_3 = h2 + (h3 - h2) * 0.3; // Early condensation
      const h3_4 = h3 + (h4 - h3) * 0.1; // Start expansion
      const h4_1 = h4 + (h1 - h4) * 0.7; // Mid-evaporation
      
      // Pressures for intermediate points
      const p1_2 = pEvap + (pCond - pEvap) * 0.5;
      const p2_3 = pCond;
      const p3_4 = pCond;
      const p4_1 = pEvap;
      
      return {
        enthalpy: [h1, h1_2, h2, h2_3, h3, h3_4, h4, h4_1],
        pressure: [pEvap, p1_2, pCond, p2_3, pCond, p3_4, pEvap, p4_1],
        labels: ['1', '1-2', '2', '2-3', '3', '3-4', '4', '4-1']
      };
    };
    
    // Generate three cycles: OEM, Actual, and Optimized
    const oemCycle = calculateCyclePoints(1.0, 0.0);
    const actualCycle = calculateCyclePoints(0.9, 0.1); // 10% degradation
    const optimizedCycle = calculateCyclePoints(1.1, -0.05); // 5% improvement
    
    console.log('Calculated thermodynamic cycles:', {
      oemCycle,
      actualCycle,
      optimizedCycle,
      refrigerant,
      evapTemp: tEvap - 273.15,
      condTemp: tCond - 273.15,
      evapPressure: pEvap,
      condPressure: pCond
    });
    
    return { oemCycle, actualCycle, optimizedCycle };
    
  } catch (error) {
    console.error('Thermodynamic calculation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown calculation error';
    throw new Error(`Calculation failed: ${errorMessage}`);
  }
};

// Create comprehensive P-H plot data (adapted from working ChillerPHDiagram)
const createChillerPHPlotData = (phData: any): any[] => {
  const plotData: any[] = [];
  
  // Validate cycle data
  const validateCycleData = (cycle: any, cycleName: string) => {
    if (!cycle || !Array.isArray(cycle.enthalpy) || !Array.isArray(cycle.pressure)) {
      console.warn(`Invalid ${cycleName} cycle data:`, cycle);
      return null;
    }
    
    if (cycle.enthalpy.length !== cycle.pressure.length) {
      console.warn(`${cycleName} cycle enthalpy/pressure length mismatch`);
      return null;
    }
    
    // Check for valid numeric values
    const validEnthalpy = cycle.enthalpy.every((h: any) => typeof h === 'number' && !isNaN(h) && isFinite(h));
    const validPressure = cycle.pressure.every((p: any) => typeof p === 'number' && !isNaN(p) && isFinite(p) && p > 0);
    
    if (!validEnthalpy || !validPressure) {
      console.warn(`${cycleName} cycle contains invalid values`);
      return null;
    }
    
    return cycle;
  };

  // Add saturation dome (simplified version)
  const addSaturationDome = () => {
    // Simplified saturation dome for better performance
    const saturationPoints = [
      { h: 200, p: 100 }, { h: 250, p: 200 }, { h: 300, p: 400 },
      { h: 350, p: 800 }, { h: 400, p: 1500 }, { h: 450, p: 2500 }
    ];
    
    plotData.push({
      x: saturationPoints.map(p => p.h),
      y: saturationPoints.map(p => p.p),
      mode: 'lines',
      type: 'scatter',
      name: 'Saturation Dome',
      line: { color: '#6b7280', width: 1, dash: 'dot' },
      showlegend: true,
      hovertemplate: 'Saturation Line<br>H: %{x:.1f} kJ/kg<br>P: %{y:.1f} kPa<extra></extra>'
    });
  };

  // Add constant temperature lines (isotherms)
  const addIsotherms = () => {
    const temperatures = [-10, 0, 10, 20, 30, 40, 50]; // °C
    temperatures.forEach(temp => {
      const isothermPoints = [
        { h: 150 + temp * 2, p: 50 + temp * 20 },
        { h: 200 + temp * 3, p: 100 + temp * 30 },
        { h: 300 + temp * 4, p: 200 + temp * 50 }
      ];
      
      plotData.push({
        x: isothermPoints.map(p => p.h),
        y: isothermPoints.map(p => p.p),
        mode: 'lines',
        type: 'scatter',
        name: `${temp}°C`,
        line: { color: '#9ca3af', width: 0.5 },
        showlegend: false,
        hovertemplate: `${temp}°C Isotherm<br>H: %{x:.1f} kJ/kg<br>P: %{y:.1f} kPa<extra></extra>`
      });
    });
  };

  // Add background grid
  addSaturationDome();
  addIsotherms();

  // Plot VCC cycle with enhanced visualization
  const plotVCCCycle = (cycle: any, cycleName: string, color: string, includeLabels = false) => {
    const validatedCycle = validateCycleData(cycle, cycleName);
    if (!validatedCycle) return;

    const { enthalpy, pressure, labels } = validatedCycle;

    // Close the cycle by connecting last point to first
    const closedEnthalpy = [...enthalpy, enthalpy[0]];
    const closedPressure = [...pressure, pressure[0]];

    // Main cycle line
    plotData.push({
      x: closedEnthalpy,
      y: closedPressure,
      mode: 'lines+markers',
      type: 'scatter',
      name: `${cycleName} Cycle`,
      line: { 
        color: color, 
        width: cycleName === 'OEM' ? 4 : cycleName === 'Optimized' ? 3 : 2 
      },
      marker: { 
        size: cycleName === 'OEM' ? 10 : 8, 
        color: color,
        symbol: cycleName === 'OEM' ? 'circle' : cycleName === 'Optimized' ? 'diamond' : 'square'
      },
      connectgaps: true,
      hovertemplate: `${cycleName} Cycle<br>H: %{x:.1f} kJ/kg<br>P: %{y:.1f} kPa<extra></extra>`
    });

    // Add state point labels
    if (includeLabels && labels) {
      plotData.push({
        x: enthalpy,
        y: pressure,
        mode: 'text',
        type: 'scatter',
        text: labels,
        textposition: 'top center',
        textfont: { 
          size: 12, 
          color: color, 
          family: 'Arial Black, sans-serif' 
        },
        name: `${cycleName} Labels`,
        showlegend: false,
        hoverinfo: 'skip'
      });
    }

    console.log(`Added ${cycleName} cycle with ${enthalpy.length} points`);
  };

  // Plot all cycles
  plotVCCCycle(phData.oemCycle, 'OEM', '#2563eb', true);
  plotVCCCycle(phData.actualCycle, 'Actual', '#dc2626', false);
  plotVCCCycle(phData.optimizedCycle, 'Optimized', '#059669', false);

  // Add performance degradation zone
  const addDegradationZone = () => {
    const oemData = validateCycleData(phData.oemCycle, 'OEM');
    const actualData = validateCycleData(phData.actualCycle, 'Actual');

    if (oemData && actualData && oemData.enthalpy.length === actualData.enthalpy.length) {
      const degradationEnthalpy = [
        ...oemData.enthalpy,
        ...actualData.enthalpy.slice().reverse()
      ];

      const degradationPressure = [
        ...oemData.pressure,
        ...actualData.pressure.slice().reverse()
      ];

      plotData.push({
        x: degradationEnthalpy,
        y: degradationPressure,
        fill: 'toself',
        fillcolor: 'rgba(220, 38, 38, 0.1)',
        line: { color: 'rgba(220, 38, 38, 0)' },
        mode: 'lines',
        type: 'scatter',
        name: 'Performance Degradation',
        showlegend: true,
        hoverinfo: 'name',
        hovertemplate: 'Performance Degradation Zone<extra></extra>'
      });
    }
  };

  addDegradationZone();

  console.log('P-H diagram generation complete:', {
    totalTraces: plotData.length,
    cycleTraces: plotData.filter((trace: any) => trace.name?.includes('Cycle')).length
  });

  return plotData;
};

const PHChart: React.FC<PHChartProps> = ({ proposalData, className = '' }) => {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [librariesReady, setLibrariesReady] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const plotInitialized = useRef(false);

  // Check if libraries are loaded
  useEffect(() => {
    const checkLibraries = () => {
      const coolpropReady = typeof window !== 'undefined' && window.CoolProp;
      const plotlyReady = typeof window !== 'undefined' && window.Plotly;
      
      setLibrariesReady(!!coolpropReady && !!plotlyReady);
      
      if (coolpropReady && plotlyReady) {
        console.log('Both CoolProp and Plotly are ready');
      }
    };

    checkLibraries();
    const interval = setInterval(checkLibraries, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-generate chart when libraries are ready and data is available
  useEffect(() => {
    if (librariesReady && proposalData && !plotInitialized.current) {
      generateChart();
    }
  }, [librariesReady, proposalData]);

  const generateChart = async () => {
    if (!librariesReady) {
      setError('Required libraries are not loaded');
      return;
    }

    if (plotInitialized.current) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating P-H chart with data:', proposalData);
      
      // Calculate thermodynamic cycles
      const cycleData = await calculateThermodynamicCycle(proposalData);
      
      // Create plot data
      const newPlotData = createChillerPHPlotData(cycleData);
      setPlotData(newPlotData);
      
      // Render the plot
      if (chartRef.current && window.Plotly && newPlotData.length > 0) {
        const layout = {
          title: {
            text: `P-H Diagram - ${proposalData.refrigerant || 'R410A'} Refrigeration Cycle`,
            font: { size: 18, family: 'Arial, sans-serif' },
            x: 0.5
          },
          xaxis: {
            title: {
              text: 'Specific Enthalpy (kJ/kg)',
              font: { size: 14 }
            },
            type: 'linear' as const,
            showgrid: true,
            gridcolor: '#e5e7eb',
            gridwidth: 1,
            zeroline: false
          },
          yaxis: {
            title: {
              text: 'Pressure (kPa)',
              font: { size: 14 }
            },
            type: 'log' as const,
            showgrid: true,
            gridcolor: '#e5e7eb',
            gridwidth: 1,
            zeroline: false
          },
          showlegend: true,
          legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(255,255,255,0.9)',
            bordercolor: '#d1d5db',
            borderwidth: 1,
            font: { size: 12 }
          },
          margin: { l: 80, r: 50, t: 80, b: 80 },
          plot_bgcolor: '#fafafa',
          paper_bgcolor: '#ffffff',
          hovermode: 'closest' as const
        };

        const config = {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: [
            'pan2d', 'lasso2d', 'select2d', 'autoScale2d', 
            'hoverClosestCartesian', 'hoverCompareCartesian'
          ],
          displaylogo: false,
          toImageButtonOptions: {
            format: 'png' as const,
            filename: 'ph_diagram',
            height: 600,
            width: 800,
            scale: 2
          }
        };

        await window.Plotly.newPlot(chartRef.current, newPlotData, layout, config);
        plotInitialized.current = true;
        console.log('P-H chart rendered successfully');
      }
      
    } catch (err) {
      console.error('Error generating P-H chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate P-H chart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Pressure-Enthalpy (P-H) Diagram</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!librariesReady && (
          <Alert className="mb-4">
            <AlertDescription>
              Loading thermodynamic libraries (CoolProp and Plotly)...
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert className="mb-4">
            <AlertDescription>
              Calculating thermodynamic cycle and generating P-H diagram...
            </AlertDescription>
          </Alert>
        )}

        <div 
          ref={chartRef}
          className="w-full h-[600px] border border-gray-200 rounded-lg bg-white"
        />
        
        {!plotInitialized.current && !isLoading && librariesReady && (
          <div className="flex items-center justify-center h-[600px] text-gray-500">
            <div className="text-center">
              <p>P-H diagram will load automatically</p>
              <p className="text-sm mt-2">Thermodynamic analysis in progress...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PHChart;
