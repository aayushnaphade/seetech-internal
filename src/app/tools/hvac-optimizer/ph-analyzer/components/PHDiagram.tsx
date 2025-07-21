// P-H Diagram Visualization Component

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { CycleResults, PlotData, PlotLayout } from '../types';
import { createPHPlotData, createEnhancedPHPlotData } from '../calculations';

interface PHDiagramProps {
  results: CycleResults;
  refrigerant: string;
  inputs: any; // Add inputs to access scaling options
  isLoading?: boolean;
}

declare global {
  interface Window {
    Plotly: any;
  }
}

export function PHDiagram({ results, refrigerant, inputs, isLoading = false }: PHDiagramProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!results || !plotRef.current || !window.Plotly) return;

    try {
      // Create enhanced plot data with additional visualization features
      const plotData = createEnhancedPHPlotData(results.phDiagramData, refrigerant);
      
      // Calculate dynamic axis ranges based on cycle data and user preferences
      const cycleEnthalpies = results.phDiagramData.cycleEnthalpy.filter(h => h > 0);
      const cyclePressures = results.phDiagramData.cyclePressure.filter(p => p > 0);
      
      // Calculate enthalpy range
      const minEnthalpy = Math.min(...cycleEnthalpies);
      const maxEnthalpy = Math.max(...cycleEnthalpies);
      const enthalpyRange = maxEnthalpy - minEnthalpy;
      const enthalpyPadding = Math.max(enthalpyRange * 0.15, 20); // 15% padding or 20 kJ/kg minimum
      
      // Calculate pressure range
      const minPressure = Math.min(...cyclePressures);
      const maxPressure = Math.max(...cyclePressures);
      const pressureRatio = maxPressure / minPressure;
      
      // Determine axis configurations based on user settings
      let xAxisConfig: any = {
        title: 'Specific Enthalpy (kJ/kg)',
        type: 'linear'
      };
      
      let yAxisConfig: any = {
        title: 'Pressure (bar)',
        type: 'log'
      };
      
      // Apply custom enthalpy range if provided
      if (inputs.customEnthalpyRange && !inputs.autoScale) {
        xAxisConfig.range = [inputs.customEnthalpyRange.min, inputs.customEnthalpyRange.max];
      } else if (inputs.autoScale) {
        xAxisConfig.range = [
          minEnthalpy - enthalpyPadding,
          maxEnthalpy + enthalpyPadding
        ];
      }
      
      // Apply pressure scaling logic
      if (inputs.customPressureRange && !inputs.autoScale) {
        // User-defined range
        yAxisConfig.type = 'linear';
        yAxisConfig.range = [inputs.customPressureRange.min, inputs.customPressureRange.max];
      } else if (inputs.forceLogScale) {
        // Force logarithmic scale
        yAxisConfig.type = 'log';
        if (inputs.autoScale) {
          const logPadding = 0.2;
          yAxisConfig.range = [
            Math.log10(Math.max(0.1, minPressure / Math.pow(10, logPadding))),
            Math.log10(maxPressure * Math.pow(10, logPadding))
          ];
        }
      } else if (inputs.autoScale) {
        // Smart scaling: use linear for small pressure ratios, log for large ones
        if (pressureRatio < 4) {
          const pressureRange = maxPressure - minPressure;
          const pressurePadding = Math.max(pressureRange * 0.2, 0.5);
          
          yAxisConfig = {
            title: 'Pressure (bar)',
            type: 'linear',
            range: [
              Math.max(0.1, minPressure - pressurePadding),
              maxPressure + pressurePadding
            ]
          };
        } else {
          yAxisConfig.type = 'log';
          const logPadding = 0.15;
          yAxisConfig.range = [
            Math.log10(Math.max(0.1, minPressure / Math.pow(10, logPadding))),
            Math.log10(maxPressure * Math.pow(10, logPadding))
          ];
        }
      }
      
      // Create scale info for title
      const scaleInfo = `${yAxisConfig.type === 'linear' ? 'Linear' : 'Log'} Scale`;
      const rangeInfo = inputs.autoScale ? ' (Auto-scaled)' : ' (Manual)';
      
      // Configure layout with dynamic scaling
      const layout: PlotLayout = {
        title: `P-H Diagram (${refrigerant}) - ${scaleInfo}${rangeInfo}`,
        xaxis: {
          ...xAxisConfig,
          title: {
            text: 'Specific Enthalpy (kJ/kg)',
            font: {
              size: 14,
              color: '#374151'
            }
          },
          showgrid: true,
          gridcolor: '#e5e7eb',
          tickfont: {
            size: 12,
            color: '#6b7280'
          }
        },
        yaxis: {
          ...yAxisConfig,
          title: {
            text: 'Pressure (bar)',
            font: {
              size: 14,
              color: '#374151'
            }
          },
          showgrid: true,
          gridcolor: '#e5e7eb',
          tickfont: {
            size: 12,
            color: '#6b7280'
          }
        },
        showlegend: true,
        hovermode: 'closest',
        margin: {
          l: 80,
          r: 50,
          t: 90,
          b: 80
        },
        font: {
          family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          size: 12,
          color: '#374151'
        },
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#ffffff'
      };

      // Plot configuration
      const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
        toImageButtonOptions: {
          format: 'png',
          filename: `ph_diagram_${refrigerant}`,
          height: 600,
          width: 800,
          scale: 2
        }
      };

      // Create the plot
      window.Plotly.newPlot(plotRef.current, plotData, layout, config);

      // Add cycle point annotations with enhanced visibility
      const annotations = results.points.map((point, index) => ({
        x: point.enthalpy,
        y: point.pressure,
        text: `<b>${index + 1}</b>`,
        showarrow: true,
        arrowhead: 2,
        arrowsize: 1.5,
        arrowwidth: 2,
        arrowcolor: '#059669',
        ax: index % 2 === 0 ? 25 : -25, // Alternate arrow positions
        ay: index % 2 === 0 ? -25 : 25,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        bordercolor: '#059669',
        borderwidth: 2,
        font: {
          size: 12,
          color: '#059669',
          family: 'Inter, sans-serif'
        },
        opacity: 0.9
      }));

      // Add process labels between points
      const processLabels = [
        { from: 0, to: 1, label: 'Compression', color: '#dc2626' },
        { from: 1, to: 2, label: 'Condensation', color: '#2563eb' },
        { from: 2, to: 3, label: 'Expansion', color: '#ea580c' },
        { from: 3, to: 0, label: 'Evaporation', color: '#0891b2' }
      ];

      processLabels.forEach((process, idx) => {
        const fromPoint = results.points[process.from];
        const toPoint = results.points[process.to === results.points.length ? 0 : process.to];
        
        // Calculate midpoint for label placement
        const midH = (fromPoint.enthalpy! + toPoint.enthalpy!) / 2;
        const midP = (fromPoint.pressure + toPoint.pressure) / 2;
        
        annotations.push({
          x: midH,
          y: midP,
          text: `<i>${process.label}</i>`,
          showarrow: false,
          arrowhead: 0,
          arrowsize: 0,
          arrowwidth: 0,
          arrowcolor: 'transparent',
          ax: 0,
          ay: 0,
          font: {
            size: 10,
            color: process.color,
            family: 'Inter, sans-serif'
          },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          bordercolor: process.color,
          borderwidth: 1,
          opacity: 0.8
        });
      });

      window.Plotly.relayout(plotRef.current, {
        annotations: annotations
      });

    } catch (error) {
      console.error('Error creating P-H diagram:', error);
    }
  }, [results, refrigerant, inputs]);

  // Control functions for diagram manipulation
  const downloadDiagram = () => {
    if (!plotRef.current || !window.Plotly) return;
    
    window.Plotly.downloadImage(plotRef.current, {
      format: 'png',
      filename: `ph_diagram_${refrigerant}_${new Date().toISOString().slice(0, 10)}`,
      height: 600,
      width: 800,
      scale: 2
    });
  };

  const resetZoom = () => {
    if (!plotRef.current || !window.Plotly) return;
    window.Plotly.relayout(plotRef.current, {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });
  };

  const fitToCycle = () => {
    if (!plotRef.current || !window.Plotly || !results) return;
    
    const cycleEnthalpies = results.phDiagramData.cycleEnthalpy.filter(h => h > 0);
    const cyclePressures = results.phDiagramData.cyclePressure.filter(p => p > 0);
    
    const minH = Math.min(...cycleEnthalpies);
    const maxH = Math.max(...cycleEnthalpies);
    const minP = Math.min(...cyclePressures);
    const maxP = Math.max(...cyclePressures);
    
    const hPadding = (maxH - minH) * 0.1;
    const pPadding = (maxP - minP) * 0.1;
    
    window.Plotly.relayout(plotRef.current, {
      'xaxis.range': [minH - hPadding, maxH + hPadding],
      'yaxis.range': [Math.max(0.1, minP - pPadding), maxP + pPadding]
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            P-H Diagram
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            P-H Diagram
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fitToCycle}
              className="flex items-center gap-2"
              title="Fit diagram to cycle data"
            >
              <Maximize2 className="h-4 w-4" />
              Fit to Cycle
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetZoom}
              className="flex items-center gap-2"
              title="Reset zoom to show full range"
            >
              <ZoomOut className="h-4 w-4" />
              Reset Zoom
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadDiagram}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={plotRef} 
          className="w-full h-96"
          style={{ minHeight: '400px' }}
        />
        
        {/* Enhanced Legend */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-3 text-gray-800">Cycle State Points:</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
            {results.points.map((point, index) => (
              <div key={point.id} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-700">
                    Point {index + 1}: {point.name}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {point.phase}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">T:</span> {point.temperature.toFixed(1)}°C
                  </div>
                  <div>
                    <span className="font-medium">P:</span> {point.pressure.toFixed(2)} bar
                  </div>
                  <div>
                    <span className="font-medium">h:</span> {point.enthalpy?.toFixed(1)} kJ/kg
                  </div>
                  <div>
                    <span className="font-medium">s:</span> {point.entropy?.toFixed(3)} kJ/kg·K
                  </div>
                  {point.quality !== undefined && (
                    <div className="col-span-2">
                      <span className="font-medium">Quality (x):</span> {(point.quality * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
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
        </div>
      </CardContent>
    </Card>
  );
}
