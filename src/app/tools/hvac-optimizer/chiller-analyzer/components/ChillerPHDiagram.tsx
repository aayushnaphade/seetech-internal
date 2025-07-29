'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ZoomIn, RotateCcw, Loader2 } from 'lucide-react';
import { ChillerResults, ChillerInputs, PlotLayout } from '../types';
import { createChillerPHPlotData } from '../calculations';

declare global {
  interface Window {
    Plotly: any;
  }
}

interface ChillerPHDiagramProps {
  results: ChillerResults;
  refrigerant: string;
  inputs: ChillerInputs;
  isLoading?: boolean;
}

export function ChillerPHDiagram({ results, refrigerant, inputs, isLoading = false }: ChillerPHDiagramProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const plotInitialized = useRef(false);

  useEffect(() => {
    if (!results || !window.Plotly || !plotRef.current || isLoading) return;

    const createPlot = async () => {
      try {
        // Create plot data
        const plotData = createChillerPHPlotData(results.phDiagramData, refrigerant);

        // Determine axis ranges from cycle data
        const cycleEnthalpy = results.phDiagramData.cycleEnthalpy || [];
        const cyclePressure = results.phDiagramData.cyclePressure || [];

        const minEnthalpy = Math.min(...cycleEnthalpy.filter(h => h && !isNaN(h)));
        const maxEnthalpy = Math.max(...cycleEnthalpy.filter(h => h && !isNaN(h)));
        const minPressure = Math.min(...cyclePressure.filter(p => p && !isNaN(p)));
        const maxPressure = Math.max(...cyclePressure.filter(p => p && !isNaN(p)));

        // Calculate pressure ratio for scaling decision
        const pressureRatio = maxPressure / minPressure;

        // Layout configuration
        const layout: PlotLayout = {
          title: {
            text: `Chiller Performance Comparison - ${refrigerant}<br><sub>OEM: ${results.oem.cop.toFixed(2)} COP | Actual: ${results.actual.cop.toFixed(2)} COP | Optimized: ${results.optimized.cop.toFixed(2)} COP</sub>`,
            font: { size: 16, color: '#2c3e50' }
          },
          xaxis: {
            title: { text: 'Specific Enthalpy (kJ/kg)', font: { size: 14 } },
            showgrid: true,
            gridcolor: '#e0e0e0',
            tickfont: { size: 12 }
          },
          yaxis: {
            title: { text: 'Pressure (bar)', font: { size: 14 } },
            showgrid: true,
            gridcolor: '#e0e0e0',
            tickfont: { size: 12 }
          },
          showlegend: true,
          hovermode: 'closest',
          margin: { l: 80, r: 50, t: 100, b: 80 },
          font: { family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', size: 12, color: '#2c3e50' },
          plot_bgcolor: '#ffffff',
          paper_bgcolor: 'white'
        };

        // Apply scaling logic
        if (inputs.autoScale && cycleEnthalpy.length > 0 && cyclePressure.length > 0) {
          const enthalpyPadding = Math.max((maxEnthalpy - minEnthalpy) * 0.15, 20);
          layout.xaxis!.range = [minEnthalpy - enthalpyPadding, maxEnthalpy + enthalpyPadding];

          if (inputs.forceLogScale || pressureRatio >= 4) {
            layout.yaxis!.type = 'log';
            const logPadding = 0.2;
            layout.yaxis!.range = [
              Math.log10(Math.max(0.1, minPressure / Math.pow(10, logPadding))),
              Math.log10(maxPressure * Math.pow(10, logPadding))
            ];
          } else {
            layout.yaxis!.type = 'linear';
            const pressurePadding = Math.max((maxPressure - minPressure) * 0.2, 0.5);
            layout.yaxis!.range = [
              Math.max(0.1, minPressure - pressurePadding), 
              maxPressure + pressurePadding
            ];
          }
        }

        // Configuration
        const config = {
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
          displaylogo: false,
          toImageButtonOptions: {
            format: 'png',
            filename: `chiller_ph_diagram_${refrigerant}_${new Date().toISOString().split('T')[0]}`,
            height: 600,
            width: 1000,
            scale: 2
          }
        };

        // Create or update plot
        if (!plotInitialized.current) {
          await window.Plotly.newPlot(plotRef.current, plotData, layout, config);
          plotInitialized.current = true;
        } else {
          await window.Plotly.react(plotRef.current, plotData, layout, config);
        }

        // Add cycle point annotations
        const addAnnotations = () => {
          const annotations: any[] = [];
          
          // Add annotations for each cycle
          const cycles = [
            { results: results.oem, color: '#2563eb', name: 'OEM' },
            { results: results.actual, color: '#dc2626', name: 'Actual' },
            { results: results.optimized, color: '#059669', name: 'Optimized' }
          ];

          cycles.forEach((cycle, cycleIndex) => {
            cycle.results.points.forEach((point, pointIndex) => {
              if (point.enthalpy && point.pressure) {
                annotations.push({
                  x: point.enthalpy,
                  y: point.pressure,
                  text: `<b>${pointIndex + 1}</b>`,
                  showarrow: true,
                  arrowhead: 2,
                  arrowsize: 1,
                  arrowwidth: 2,
                  arrowcolor: cycle.color,
                  ax: (pointIndex % 2 === 0 ? 20 : -20) + (cycleIndex * 5),
                  ay: (pointIndex % 2 === 0 ? -20 : 20) + (cycleIndex * 5),
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  bordercolor: cycle.color,
                  borderwidth: 1,
                  font: {
                    size: 10,
                    color: cycle.color,
                    family: 'Inter, sans-serif'
                  },
                  opacity: 0.8
                });
              }
            });
          });

          if (annotations.length > 0) {
            window.Plotly.relayout(plotRef.current, { annotations });
          }
        };

        // Add annotations after a short delay to ensure plot is rendered
        setTimeout(addAnnotations, 100);

      } catch (error) {
        console.error('Error creating P-H diagram:', error);
      }
    };

    createPlot();
  }, [results, refrigerant, inputs, isLoading]);

  const handleFitToCycle = () => {
    if (!window.Plotly || !plotRef.current || !results) return;

    const cycleEnthalpy = results.phDiagramData.cycleEnthalpy || [];
    const cyclePressure = results.phDiagramData.cyclePressure || [];

    if (cycleEnthalpy.length === 0 || cyclePressure.length === 0) return;

    const minH = Math.min(...cycleEnthalpy.filter(h => h && !isNaN(h)));
    const maxH = Math.max(...cycleEnthalpy.filter(h => h && !isNaN(h)));
    const minP = Math.min(...cyclePressure.filter(p => p && !isNaN(p)));
    const maxP = Math.max(...cyclePressure.filter(p => p && !isNaN(p)));

    const hPadding = Math.max((maxH - minH) * 0.1, 10);
    const pPadding = Math.max((maxP - minP) * 0.1, 0.2);

    window.Plotly.relayout(plotRef.current, {
      'xaxis.range': [minH - hPadding, maxH + hPadding],
      'yaxis.range': [Math.max(0.1, minP - pPadding), maxP + pPadding],
      'yaxis.type': 'linear'
    });
  };

  const handleResetZoom = () => {
    if (!window.Plotly || !plotRef.current) return;
    window.Plotly.relayout(plotRef.current, {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  };

  const handleDownload = () => {
    if (!window.Plotly || !plotRef.current) return;
    window.Plotly.downloadImage(plotRef.current, {
      format: 'png',
      filename: `chiller_ph_diagram_${refrigerant}_${new Date().toISOString().split('T')[0]}`,
      height: 600,
      width: 1000,
      scale: 2
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Pressure-Enthalpy Diagram
              <Badge variant="outline">{refrigerant}</Badge>
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToCycle}
              disabled={isLoading}
            >
              <ZoomIn className="h-4 w-4 mr-1" />
              Fit to Cycles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset Zoom
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-muted-foreground">Generating P-H diagram...</p>
            </div>
          </div>
        ) : (
          <>
            <div ref={plotRef} className="w-full h-96" />
            
            {/* Enhanced Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold mb-3 text-gray-800">Cycle Comparison:</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                {/* OEM Cycle */}
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-700">OEM Cycle</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Baseline
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    {results.oem.points.map((point, index) => (
                      <div key={point.id}>
                        <span className="font-medium">{index + 1}:</span> {point.name}
                        <div className="text-gray-500 ml-3">
                          T: {point.temperature.toFixed(1)}°C, P: {point.pressure.toFixed(2)} bar
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actual Cycle */}
                <div className="bg-white p-3 rounded border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-700">Actual Cycle</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      results.degradationZone 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {results.degradationZone ? 'Degraded' : 'Normal'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    {results.actual.points.map((point, index) => (
                      <div key={point.id}>
                        <span className="font-medium">{index + 1}:</span> {point.name}
                        <div className="text-gray-500 ml-3">
                          T: {point.temperature.toFixed(1)}°C, P: {point.pressure.toFixed(2)} bar
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimized Cycle */}
                <div className="bg-white p-3 rounded border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-700">Optimized Cycle</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Improved
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    {results.optimized.points.map((point, index) => (
                      <div key={point.id}>
                        <span className="font-medium">{index + 1}:</span> {point.name}
                        <div className="text-gray-500 ml-3">
                          T: {point.temperature.toFixed(1)}°C, P: {point.pressure.toFixed(2)} bar
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Process Legend */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h5 className="text-sm font-semibold mb-2 text-gray-800">Thermodynamic Processes:</h5>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>1→2: Compression</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>2→3: Condensation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>3→4: Expansion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                    <span>4→1: Evaporation</span>
                  </div>
                </div>
              </div>

              {results.degradationZone && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700 text-xs">
                    ⚠️ Performance degradation detected - actual COP below OEM specifications
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}