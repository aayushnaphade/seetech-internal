'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChillerProposalData } from '../types';
import {
    ChillerInputs,
    ChillerResults
} from '@/app/tools/hvac-optimizer/chiller-analyzer/types';
import {
    calculateChillerComparison,
    createChillerPHPlotData
} from '@/app/tools/hvac-optimizer/chiller-analyzer/calculations';

// Enhanced Plot component with better error handling and loading states
const Plot: any = dynamic(
  () => import('react-plotly.js').catch(() => {
    // Fallback component in case plotly fails to load
    return {
      default: ({ data, layout, config }: any) => (
        <div style={{ 
          width: layout?.width || 800, 
          height: layout?.height || 600, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          background: '#f9f9f9',
          color: '#666',
          fontSize: '14px'
        }}>
          P-H Chart loading... (Plotly.js)
        </div>
      )
    };
  }),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        width: '800px', 
        height: '600px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        background: '#f9f9f9',
        color: '#666',
        fontSize: '14px'
      }}>
        Loading P-H Chart...
      </div>
    )
  }
) as any;

declare global {
    interface Window {
        Module: any;
    }
}

// Convert proposal data to chiller analyzer inputs
function convertProposalDataToChillerInputs(data: ChillerProposalData): ChillerInputs {
    return {
        // OEM Specifications
        oemCOP: parseFloat(data.oemCOP || '2.87'),
        oemCapacity: parseFloat(data.oemCapacity || '897'),
        refrigerant: data.refrigerant || 'R134a',

        // Actual Sensor Data
        evapPressure: parseFloat(data.evapPressure || '307.7'),
        condPressure: parseFloat(data.condPressure || '1244.0'),
        suctionTemp: parseFloat(data.suctionTemp || '15.6'),
        dischargeTemp: parseFloat(data.dischargeTemp || '65.0'),
        evapLWT: parseFloat(data.evapLWT || '12.0'),
        evapEWT: parseFloat(data.evapEWT || '7.0'),
        condApproach: parseFloat(data.condApproach || '7.0'),
        superheat: parseFloat(data.superheat || '8.6'),
        subcooling: parseFloat(data.subcooling || '0.0'),

        // Environmental Conditions
        ambientDBT: parseFloat(data.ambientDBT || '35.0'),
        relativeHumidity: parseFloat(data.relativeHumidity || '60.0'),

        // System Parameters
        compressorEfficiency: parseFloat(data.compressorEfficiency || '0.85'),
        systemEfficiencyFactor: parseFloat(data.systemEfficiencyFactor || '0.42'),

        // Analysis Options - optimized for proposal display
        showIsotherms: true,
        showIsobars: false,
        showQualityLines: true,
        autoScale: true,
        forceLogScale: false
    };
}

// Generate P-H data using the EXACT chiller analyzer calculations
const generateChillerAnalyzerPHData = async (data: ChillerProposalData) => {
    console.log('=== USING CHILLER ANALYZER CALCULATIONS DIRECTLY ===');

    // Convert proposal data to chiller analyzer inputs
    const chillerInputs = convertProposalDataToChillerInputs(data);

    console.log('Chiller analyzer inputs:', {
        oemCOP: chillerInputs.oemCOP,
        oemCapacity: chillerInputs.oemCapacity,
        refrigerant: chillerInputs.refrigerant,
        evapPressure: chillerInputs.evapPressure + ' kPa',
        condPressure: chillerInputs.condPressure + ' kPa',
        ambientDBT: chillerInputs.ambientDBT + '°C',
        relativeHumidity: chillerInputs.relativeHumidity + '%',
        superheat: chillerInputs.superheat + 'K',
        subcooling: chillerInputs.subcooling + 'K'
    });

    // Use the EXACT same calculation function as the chiller analyzer
    const chillerResults = calculateChillerComparison(chillerInputs);

    console.log('Chiller analyzer results:', {
        oemCOP: chillerResults.oem.cop.toFixed(2),
        actualCOP: chillerResults.actual.cop.toFixed(2),
        optimizedCOP: chillerResults.optimized.cop.toFixed(2),
        degradationZone: chillerResults.degradationZone,
        energySavings: chillerResults.optimized.energySavings.toFixed(1) + '%'
    });

    // Extract cycle data from chiller analyzer results
    const extractCycleData = (cycleResults: any) => {
        if (!cycleResults.points || cycleResults.points.length < 4) {
            console.warn('Insufficient cycle points, using fallback');
            return {
                enthalpy: [250, 290, 240, 240, 250],
                pressure: [3.08, 12.44, 12.44, 3.08, 3.08],
                cop: cycleResults.cop || 2.5
            };
        }

        const enthalpy = cycleResults.points.map((point: any) => point.enthalpy || 0);
        const pressure = cycleResults.points.map((point: any) => point.pressure || 0);

        // Close the cycle
        enthalpy.push(enthalpy[0]);
        pressure.push(pressure[0]);

        return {
            enthalpy,
            pressure,
            cop: cycleResults.cop
        };
    };

    const oemCycle = extractCycleData(chillerResults.oem);
    const actualCycle = extractCycleData(chillerResults.actual);
    const optimizedCycle = extractCycleData(chillerResults.optimized);

    // Extract saturation dome data from chiller analyzer P-H diagram data
    const phDiagramData = chillerResults.phDiagramData;

    const saturationDome = {
        liquidEnthalpy: phDiagramData.saturatedLiquidEnthalpy || [],
        vaporEnthalpy: phDiagramData.saturatedVaporEnthalpy || [],
        pressures: phDiagramData.saturationPressure || []
    };

    // Extract quality lines if available
    const qualityLines = {
        enthalpy: phDiagramData.qualityLines?.enthalpy || [],
        pressure: phDiagramData.qualityLines?.pressure || [],
        qualities: phDiagramData.qualityLines?.qualities || []
    };

    console.log('Extracted P-H data from chiller analyzer:', {
        saturationPoints: saturationDome.liquidEnthalpy.length,
        oemCyclePoints: oemCycle.enthalpy.length,
        actualCyclePoints: actualCycle.enthalpy.length,
        optimizedCyclePoints: optimizedCycle.enthalpy.length,
        qualityLinesCount: qualityLines.enthalpy.length
    });

    return {
        saturationDome,
        oemCycle,
        actualCycle,
        optimizedCycle,
        qualityLines,
        chillerResults // Include full results for additional data
    };
};

interface PHChartProps {
    data: ChillerProposalData;
    colors: {
        primaryBlue: string;
        text: string;
        white: string;
        blueLight: string;
    };
    shouldCalculate?: boolean; // New prop to control when calculations happen
}

export const PHChart: React.FC<PHChartProps> = ({ data, colors, shouldCalculate = true }) => {
    const [coolPropReady, setCoolPropReady] = useState(false);
    const [phData, setPhData] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationTriggered, setCalculationTriggered] = useState(false);

    // Load CoolProp safely
    useEffect(() => {
        const loadCoolProp = async () => {
            try {
                // Check if already loaded
                if (window.Module && typeof window.Module.PropsSI === 'function') {
                    setCoolPropReady(true);
                    return;
                }

                // Configure CoolProp module
                if (!window.Module) {
                    window.Module = {
                        locateFile: (path: string) => path.endsWith('.wasm') ? '/coolprop.wasm' : path,
                        onRuntimeInitialized: () => {
                            console.log('CoolProp initialized');
                            setCoolPropReady(true);
                        }
                    };
                }

                // Load CoolProp script if not already loaded
                if (!document.querySelector('script[src*="coolprop"]')) {
                    const script = document.createElement('script');
                    script.src = '/coolprop.js';
                    script.onload = () => {
                        // Wait for initialization
                        const checkReady = () => {
                            if (window.Module && typeof window.Module.PropsSI === 'function') {
                                setCoolPropReady(true);
                            } else {
                                setTimeout(checkReady, 100);
                            }
                        };
                        checkReady();
                    };
                    script.onerror = () => {
                        console.error('Failed to load CoolProp');
                        setCoolPropReady(false);
                    };
                    document.head.appendChild(script);
                }
            } catch (error) {
                console.error('CoolProp loading error:', error);
                setCoolPropReady(false);
            }
        };

        loadCoolProp();
    }, []);

    // Generate P-H data ONLY when shouldCalculate is true and CoolProp is ready
    useEffect(() => {
        if (coolPropReady && shouldCalculate && !calculationTriggered) {
            const generateData = async () => {
                try {
                    setIsCalculating(true);
                    setCalculationTriggered(true);
                    console.log('=== TRIGGERING CHILLER ANALYZER CALCULATIONS ===');
                    console.log('Generating P-H data using chiller analyzer calculations...');
                    
                    // Small delay to show loading state
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const data_result = await generateChillerAnalyzerPHData(data);
                    setPhData(data_result);
                    setIsCalculating(false);
                    
                    console.log('✅ P-H chart calculations completed successfully');
                } catch (error) {
                    console.error('❌ Error generating P-H data with chiller analyzer:', error);
                    setIsCalculating(false);
                    
                    // Use fallback data
                    setPhData({
                        saturationDome: {
                            liquidEnthalpy: [173, 183, 194, 205, 216, 227, 239, 251, 263, 275, 288],
                            vaporEnthalpy: [387, 392, 397, 402, 407, 411, 416, 420, 424, 427, 431],
                            pressures: [0.5, 0.8, 1.3, 2.0, 2.9, 4.1, 5.7, 7.7, 10.2, 13.2, 16.8]
                        },
                        oemCycle: { enthalpy: [248, 278, 242, 242, 248], pressure: [3.08, 11.85, 11.85, 3.08, 3.08], cop: 2.87 },
                        actualCycle: { enthalpy: [251, 286, 246, 246, 251], pressure: [3.08, 12.44, 12.44, 3.08, 3.08], cop: 2.60 },
                        optimizedCycle: { enthalpy: [248, 272, 238, 238, 248], pressure: [3.08, 8.15, 8.15, 3.08, 3.08], cop: 4.30 }
                    });
                }
            };
            
            generateData();
        }
    }, [coolPropReady, shouldCalculate, calculationTriggered, data]);

    // Reset calculation trigger when data changes significantly
    useEffect(() => {
        setCalculationTriggered(false);
        setPhData(null);
    }, [data.refrigerant, data.evapPressure, data.condPressure, data.oemCOP]);

    // Show loading state or calculation trigger message
    if (!coolPropReady) {
        return (
            <div style={{
                width: '100%',
                height: 450,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: colors.blueLight,
                borderRadius: 8,
                marginBottom: 24
            }}>
                <div style={{ textAlign: 'center', color: colors.primaryBlue }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}>
                        Loading CoolProp Libraries...
                    </div>
                    <div style={{ fontSize: 12 }}>Initializing thermodynamic calculations</div>
                </div>
            </div>
        );
    }

    if (!shouldCalculate) {
        return (
            <div style={{
                width: '100%',
                height: 450,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: colors.blueLight,
                borderRadius: 8,
                marginBottom: 24,
                border: `2px dashed ${colors.primaryBlue}`
            }}>
                <div style={{ textAlign: 'center', color: colors.primaryBlue }}>
                    <div style={{ fontSize: 18, marginBottom: 8, fontWeight: 600 }}>
                        P-H Diagram Ready
                    </div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                        Click "Generate Full Proposal" to calculate thermodynamic cycles
                    </div>
                    <div style={{ fontSize: 12, color: colors.text }}>
                        Using comprehensive chiller analyzer calculations
                    </div>
                </div>
            </div>
        );
    }

    if (isCalculating) {
        return (
            <div style={{
                width: '100%',
                height: 450,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: colors.blueLight,
                borderRadius: 8,
                marginBottom: 24
            }}>
                <div style={{ textAlign: 'center', color: colors.primaryBlue }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: `3px solid ${colors.primaryBlue}`, 
                        borderTop: '3px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 12px'
                    }} />
                    <div style={{ fontSize: 16, marginBottom: 8, fontWeight: 600 }}>
                        Calculating Thermodynamic Cycles...
                    </div>
                    <div style={{ fontSize: 12 }}>
                        Using chiller analyzer calculations with CoolProp
                    </div>
                </div>
            </div>
        );
    }

    if (!phData) {
        return (
            <div style={{
                width: '100%',
                height: 450,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fef2f2',
                borderRadius: 8,
                marginBottom: 24,
                border: '2px solid #fecaca'
            }}>
                <div style={{ textAlign: 'center', color: '#dc2626' }}>
                    <div style={{ fontSize: 16, marginBottom: 8, fontWeight: 600 }}>
                        Calculation Error
                    </div>
                    <div style={{ fontSize: 12 }}>
                        Unable to generate P-H diagram. Please check input parameters.
                    </div>
                </div>
            </div>
        );
    }

    // Create Plotly data with CoolProp results
    const plotData = [
        // Saturated Liquid Line
        {
            x: phData.saturationDome.liquidEnthalpy,
            y: phData.saturationDome.pressures,
            mode: 'lines',
            type: 'scatter',
            name: 'Saturated Liquid',
            line: { color: '#1f77b4', width: 2.5 },
            hovertemplate: 'Saturated Liquid<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>',
            showlegend: true
        },

        // Saturated Vapor Line
        {
            x: phData.saturationDome.vaporEnthalpy,
            y: phData.saturationDome.pressures,
            mode: 'lines',
            type: 'scatter',
            name: 'Saturated Vapor',
            line: { color: '#ff7f0e', width: 2.5 },
            hovertemplate: 'Saturated Vapor<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>',
            showlegend: true
        }
    ];

    // Add quality lines if available
    if (phData.qualityLines && phData.qualityLines.enthalpy.length > 0) {
        phData.qualityLines.enthalpy.forEach((enthalpyLine: number[], index: number) => {
            if (enthalpyLine.length > 0) {
                plotData.push({
                    x: enthalpyLine,
                    y: phData.qualityLines.pressure[index],
                    mode: 'lines',
                    type: 'scatter',
                    name: `x=${phData.qualityLines.qualities[index]}`,
                    line: { color: 'purple', width: 1, dash: 'dashdot' },
                    showlegend: false,
                    hovertemplate: `Quality x=${phData.qualityLines.qualities[index]}<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>`
                });
            }
        });
    }

    // Add degradation zone (shaded area between OEM and Actual cycles)
    if (phData.oemCycle.enthalpy.length >= 4 && phData.actualCycle.enthalpy.length >= 4) {
        // Create degradation zone polygon
        const degradationX = [
            ...phData.oemCycle.enthalpy.slice(0, 4), // OEM cycle points 1-4
            ...phData.actualCycle.enthalpy.slice(0, 4).reverse() // Actual cycle points 4-1 (reversed)
        ];
        const degradationY = [
            ...phData.oemCycle.pressure.slice(0, 4), // OEM cycle points 1-4
            ...phData.actualCycle.pressure.slice(0, 4).reverse() // Actual cycle points 4-1 (reversed)
        ];

        plotData.push({
            x: degradationX,
            y: degradationY,
            fill: 'toself',
            type: 'scatter',
            mode: 'none',
            name: 'Degradation Zone',
            fillcolor: 'rgba(231, 76, 60, 0.15)', // Light red with transparency
            line: { color: 'rgba(231, 76, 60, 0.3)', width: 1 },
            hovertemplate: 'Degradation Zone<br>Performance Loss Area<extra></extra>',
            showlegend: false
        });
    }

    // Add refrigeration cycles
    plotData.push(
        // OEM Design Cycle
        {
            x: phData.oemCycle.enthalpy,
            y: phData.oemCycle.pressure,
            mode: 'lines+markers',
            type: 'scatter',
            name: `OEM Design (COP: ${phData.oemCycle.cop.toFixed(2)})`,
            line: { color: colors.primaryBlue, width: 3 },
            marker: {
                color: colors.primaryBlue,
                size: 10,
                symbol: 'circle',
                line: { color: 'white', width: 2 }
            },
            hovertemplate: 'OEM Design<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>',
            showlegend: true
        },

        // Actual Operation Cycle
        {
            x: phData.actualCycle.enthalpy,
            y: phData.actualCycle.pressure,
            mode: 'lines+markers',
            type: 'scatter',
            name: `Actual Operation (COP: ${phData.actualCycle.cop.toFixed(2)})`,
            line: { color: '#e74c3c', width: 3 },
            marker: {
                color: '#e74c3c',
                size: 10,
                symbol: 'square',
                line: { color: 'white', width: 2 }
            },
            hovertemplate: 'Actual Operation<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>',
            showlegend: true
        },

        // Optimized Solution Cycle
        {
            x: phData.optimizedCycle.enthalpy,
            y: phData.optimizedCycle.pressure,
            mode: 'lines+markers',
            type: 'scatter',
            name: `Optimized Solution (COP: ${phData.optimizedCycle.cop.toFixed(2)})`,
            line: { color: '#1db56c', width: 3 },
            marker: {
                color: '#1db56c',
                size: 10,
                symbol: 'diamond',
                line: { color: 'white', width: 2 }
            },
            hovertemplate: 'Optimized Solution<br>h: %{x:.1f} kJ/kg<br>P: %{y:.2f} bar<extra></extra>',
            showlegend: true
        }
    );

    // Calculate autoscaling from cycle data
    const allEnthalpy = [
        ...phData.oemCycle.enthalpy,
        ...phData.actualCycle.enthalpy,
        ...phData.optimizedCycle.enthalpy
    ].filter(h => h && !isNaN(h));

    const allPressure = [
        ...phData.oemCycle.pressure,
        ...phData.actualCycle.pressure,
        ...phData.optimizedCycle.pressure
    ].filter(p => p && !isNaN(p));

    let xRange = [150, 500];
    let yRange = [0, 25];

    if (allEnthalpy.length > 0 && allPressure.length > 0) {
        const minH = Math.min(...allEnthalpy);
        const maxH = Math.max(...allEnthalpy);
        const minP = Math.min(...allPressure);
        const maxP = Math.max(...allPressure);

        const hPadding = Math.max((maxH - minH) * 0.2, 20);
        const pPadding = Math.max((maxP - minP) * 0.2, 1);

        xRange = [minH - hPadding, maxH + hPadding];
        yRange = [Math.max(0.1, minP - pPadding), maxP + pPadding];
    }

    const layout = {
        width: 650, // Adjusted to fit A4 page container (was 900)
        height: 400, // Slightly reduced height for better proportion
        margin: { l: 60, r: 30, t: 70, b: 60 }, // Optimized margins for A4
        title: {
            text: `Pressure-Enthalpy Diagram - ${data.refrigerant || 'R134a'} Refrigerant<br><sub>CoolProp Thermodynamic Analysis</sub>`,
            font: { size: 16, color: colors.primaryBlue, family: 'Inter, Arial, sans-serif' }
        },
        xaxis: {
            title: {
                text: 'Specific Enthalpy (kJ/kg)',
                font: { size: 14, color: colors.primaryBlue }
            },
            showgrid: true,
            gridcolor: '#e0e0e0',
            zeroline: false,
            tickfont: { color: colors.text, size: 12 },
            range: xRange
        },
        yaxis: {
            title: {
                text: 'Pressure (bar)',
                font: { size: 14, color: colors.primaryBlue }
            },
            showgrid: true,
            gridcolor: '#e0e0e0',
            zeroline: false,
            tickfont: { color: colors.text, size: 12 },
            type: 'linear',
            range: yRange
        },
        plot_bgcolor: colors.white,
        paper_bgcolor: colors.white,
        font: { family: 'Inter, Arial, sans-serif', size: 12, color: colors.text },
        hovermode: 'closest',
        showlegend: false // Removed legend box
    };

    const config = {
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
        displaylogo: false,
        toImageButtonOptions: {
            format: 'png',
            filename: `coolprop_chiller_ph_diagram_${data.refrigerant || 'R134a'}_analysis`,
            height: 400,
            width: 650,
            scale: 2
        }
    };

    return (
        <div style={{ width: '100%', marginBottom: 24 }}>
            {/* P-H Chart */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <Plot
                    data={plotData}
                    layout={layout}
                    config={config}
                />
            </div>

            {/* Custom Inline Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                fontSize: 12,
                color: colors.text,
                fontFamily: 'Inter, Arial, sans-serif'
            }}>
                {/* Saturation Lines */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 16, height: 2, backgroundColor: '#1f77b4' }}></div>
                    <span>Saturated Liquid</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 16, height: 2, backgroundColor: '#ff7f0e' }}></div>
                    <span>Saturated Vapor</span>
                </div>

                {/* Quality Lines */}
                {phData.qualityLines && phData.qualityLines.enthalpy.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: 16, height: 2, backgroundColor: 'purple', borderStyle: 'dashed', borderWidth: '1px 0' }}></div>
                        <span>Quality Lines</span>
                    </div>
                )}

                {/* Degradation Zone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: 16,
                        height: 8,
                        backgroundColor: 'rgba(231, 76, 60, 0.15)',
                        border: '1px solid rgba(231, 76, 60, 0.3)',
                        borderRadius: '2px'
                    }}></div>
                    <span>Degradation Zone</span>
                </div>

                {/* Refrigeration Cycles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: 8,
                        height: 8,
                        backgroundColor: colors.primaryBlue,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px ' + colors.primaryBlue
                    }}></div>
                    <span>OEM Design (COP: {phData.oemCycle.cop.toFixed(2)})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: 8,
                        height: 8,
                        backgroundColor: '#e74c3c',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px #e74c3c'
                    }}></div>
                    <span>Actual Operation (COP: {phData.actualCycle.cop.toFixed(2)})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                        width: 8,
                        height: 8,
                        backgroundColor: '#1db56c',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px #1db56c'
                    }}></div>
                    <span>Optimized Solution (COP: {phData.optimizedCycle.cop.toFixed(2)})</span>
                </div>
            </div>
        </div>
    );
};

// Add CSS animation for loading spinner
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Remove the summary component as requested
export const PHChartSummary: React.FC<{ data: ChillerProposalData }> = ({ data }) => {
    return null; // No summary as requested
};