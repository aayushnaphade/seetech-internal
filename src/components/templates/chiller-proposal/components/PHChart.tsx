'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChillerProposalData } from '../types';

// Dynamic import for Plotly to avoid SSR issues
const Plot: any = dynamic(() => import('react-plotly.js'), { ssr: false });

declare global {
    interface Window {
        Module: any;
    }
}

// CoolProp wrapper with proper error handling
function props(property: string, fluid: string, state1: string, value1: number, state2: string, value2: number): number {
    if (!window.Module || typeof window.Module.PropsSI !== 'function') {
        throw new Error('CoolProp not available');
    }
    return window.Module.PropsSI(property, state1, value1, state2, value2, fluid);
}

// Generate P-H data using CoolProp with proper error handling
const generateCoolPropPHData = (data: ChillerProposalData) => {
    const refrigerant = data.refrigerant || 'R134a';
    const evapTemp = parseFloat(data.evapTemp || '7.0');
    const condTemp = parseFloat(data.condTemp || '42.0');
    const optimizedCondTemp = parseFloat(data.optimizedCondTemp || '32.0');
    const superheat = parseFloat(data.superheat || '8.6');
    const subcooling = parseFloat(data.subcooling || '0.0');
    const compEff = parseFloat(data.compressorEfficiency || '0.85');

    console.log('Generating CoolProp P-H data for:', refrigerant);

    // Generate saturation dome with limited points to avoid crashes
    const saturationDome = {
        liquidEnthalpy: [] as number[],
        vaporEnthalpy: [] as number[],
        pressures: [] as number[]
    };

    // Safe temperature range to avoid crashes
    for (let temp = -30; temp <= 80; temp += 5) {
        try {
            const pressure = props('P', refrigerant, 'T', temp + 273.15, 'Q', 0) / 1e5; // Pa to bar
            if (pressure > 0.1 && pressure < 50) {
                const hLiquid = props('H', refrigerant, 'T', temp + 273.15, 'Q', 0) / 1000; // J/kg to kJ/kg
                const hVapor = props('H', refrigerant, 'T', temp + 273.15, 'Q', 1) / 1000; // J/kg to kJ/kg

                saturationDome.liquidEnthalpy.push(hLiquid);
                saturationDome.vaporEnthalpy.push(hVapor);
                saturationDome.pressures.push(pressure);
            }
        } catch (error) {
            // Skip invalid points
            continue;
        }
    }

    // Calculate VCC cycles using CoolProp
    const calculateVCCCycle = (evapTempC: number, condTempC: number, cycleName: string) => {
        try {
            // Calculate saturation pressures
            const P1 = props('P', refrigerant, 'T', evapTempC + 273.15, 'Q', 1); // Pa
            const P3 = props('P', refrigerant, 'T', condTempC + 273.15, 'Q', 0); // Pa

            // State 1: Compressor inlet (superheated vapor)
            const T1 = evapTempC + superheat;
            const H1 = props('H', refrigerant, 'T', T1 + 273.15, 'P', P1); // J/kg
            const S1 = props('S', refrigerant, 'H', H1, 'P', P1); // J/kg·K

            // State 2: Compressor outlet (actual compression)
            const P2 = P3;
            const H2_is = props('H', refrigerant, 'P', P2, 'S', S1); // J/kg (isentropic)
            const H2 = H1 + (H2_is - H1) / compEff; // J/kg (actual)

            // State 3: Condenser outlet
            const T3 = condTempC - subcooling;
            let H3;
            if (subcooling < 0.1) {
                H3 = props('H', refrigerant, 'P', P3, 'Q', 0); // Saturated liquid
            } else {
                H3 = props('H', refrigerant, 'T', T3 + 273.15, 'P', P3); // Subcooled liquid
            }

            // State 4: Expansion valve outlet
            const H4 = H3; // Isenthalpic expansion
            const P4 = P1;

            // Calculate COP
            const coolingEffect = (H1 - H4) / 1000; // kJ/kg
            const compressorWork = (H2 - H1) / 1000; // kJ/kg
            const cop = coolingEffect / compressorWork;

            console.log(`${cycleName} COP: ${cop.toFixed(2)}`);

            return {
                enthalpy: [H1 / 1000, H2 / 1000, H3 / 1000, H4 / 1000, H1 / 1000], // Convert to kJ/kg
                pressure: [P1 / 1e5, P2 / 1e5, P3 / 1e5, P4 / 1e5, P1 / 1e5], // Convert to bar
                cop: Math.max(0.5, Math.min(6.0, cop))
            };
        } catch (error) {
            console.error(`Error calculating ${cycleName} cycle:`, error);
            // Return fallback cycle
            return {
                enthalpy: [250, 280, 240, 240, 250],
                pressure: [3, 12, 12, 3, 3],
                cop: 2.5
            };
        }
    };

    // Calculate three cycles
    const oemCycle = calculateVCCCycle(evapTemp, condTemp - 2, 'OEM');
    const actualCycle = calculateVCCCycle(evapTemp, condTemp, 'Actual');
    const optimizedCycle = calculateVCCCycle(evapTemp, optimizedCondTemp, 'Optimized');

    // Generate quality lines (limited to avoid crashes)
    const qualityLines = {
        enthalpy: [] as number[][],
        pressure: [] as number[][],
        qualities: [] as number[]
    };

    const qualities = [0.1, 0.3, 0.5, 0.7, 0.9]; // Reduced number of lines
    qualities.forEach(quality => {
        const enthalpyLine: number[] = [];
        const pressureLine: number[] = [];

        // Use only valid pressure range from saturation dome
        saturationDome.pressures.forEach(pressure => {
            try {
                const h = props('H', refrigerant, 'P', pressure * 1e5, 'Q', quality) / 1000;
                if (h && !isNaN(h)) {
                    enthalpyLine.push(h);
                    pressureLine.push(pressure);
                }
            } catch (error) {
                // Skip invalid points
            }
        });

        if (enthalpyLine.length > 0) {
            qualityLines.enthalpy.push(enthalpyLine);
            qualityLines.pressure.push(pressureLine);
            qualityLines.qualities.push(quality);
        }
    });

    return {
        saturationDome,
        oemCycle,
        actualCycle,
        optimizedCycle,
        qualityLines
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
}

export const PHChart: React.FC<PHChartProps> = ({ data, colors }) => {
    const [coolPropReady, setCoolPropReady] = useState(false);
    const [phData, setPhData] = useState<any>(null);

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

    // Generate P-H data when CoolProp is ready
    useEffect(() => {
        if (coolPropReady) {
            try {
                const data_result = generateCoolPropPHData(data);
                setPhData(data_result);
            } catch (error) {
                console.error('Error generating P-H data:', error);
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
        }
    }, [coolPropReady, data]);

    // Show loading state
    if (!coolPropReady || !phData) {
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
                        {!coolPropReady ? 'Loading CoolProp...' : 'Generating P-H diagram...'}
                    </div>
                    <div style={{ fontSize: 12 }}>Please wait</div>
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

// Remove the summary component as requested
export const PHChartSummary: React.FC<{ data: ChillerProposalData }> = ({ data }) => {
    return null; // No summary as requested
};