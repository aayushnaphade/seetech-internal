'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Loader2, AlertCircle, CheckCircle, Home, Wrench, BarChart3, ArrowLeft } from 'lucide-react';

// Define types for our data
interface CompressorResults {
  temperatures: number[];
  powerKw: number[];
  savingsPercent: number[];
  referenceTemp: number;
  referencePower: number;
  optimalTemp: number;
  optimalPower: number;
  maxSavings: number;
}

interface SummaryPoint {
  temp: number;
  power: number;
  savings: number;
}

declare global {
  interface Window {
    Module: any;
    Plotly: any;
  }
}

export default function PerformanceAnalyzerPage() {
  // Form state
  const [formData, setFormData] = useState({
    suctionPressure: 1.0,
    dischargePressure: 7.0,
    flowRate: 100,
    efficiency: 0.9,
    tempMin: 10,
    tempMax: 40,
    tempRef: 35,
    fluid: 'Air'
  });

  // Component state
  const [isLoading, setIsLoading] = useState(false);
  const [coolPropReady, setCoolPropReady] = useState(false);
  const [results, setResults] = useState<CompressorResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  // Load external scripts
  useEffect(() => {
    const loadScripts = async () => {
      try {
        // Load Plotly
        if (!window.Plotly) {
          await new Promise<void>((resolve, reject) => {
            if (document.querySelector('script[src*="plotly"]')) {
              resolve();
              return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.plot.ly/plotly-3.0.1.min.js';
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Configure Module for CoolProp
        if (!window.Module) {
          window.Module = {
            locateFile: function(path: string) {
              if (path.endsWith('.wasm')) {
                return '/coolprop.wasm';
              }
              return path;
            },
            onRuntimeInitialized: function() {
              console.log('CoolProp WASM module initialized');
              setCoolPropReady(true);
            },
            print: function(text: string) {
              console.log('CoolProp stdout:', text);
            },
            printErr: function(text: string) {
              console.error('CoolProp stderr:', text);
            }
          };
        }

        // Load CoolProp
        if (!window.Module.PropsSI) {
          if (document.querySelector('script[src*="coolprop"]')) {
            return;
          }
          
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/coolprop.js';
            script.onload = () => {
              const checkReady = () => {
                if (window.Module && typeof window.Module.PropsSI === 'function') {
                  setCoolPropReady(true);
                  resolve();
                } else {
                  setTimeout(checkReady, 100);
                }
              };
              checkReady();
            };
            script.onerror = reject;
            document.head.appendChild(script);
          });
        } else {
          setCoolPropReady(true);
        }

      } catch (err) {
        console.error('Error loading scripts:', err);
        setError('Failed to load required libraries. Please refresh the page.');
      }
    };

    loadScripts();
  }, []);

  // Create temperature range array
  const linspace = (start: number, stop: number, num: number): number[] => {
    const result = [];
    const step = (stop - start) / (num - 1);
    for (let i = 0; i < num; i++) {
      result.push(start + step * i);
    }
    return result;
  };

  // Perform calculation
  const performCalculation = async () => {
    if (!coolPropReady) {
      setError('CoolProp is not ready yet. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { suctionPressure, dischargePressure, flowRate, efficiency, tempMin, tempMax, tempRef, fluid } = formData;
      
      // Convert units
      const pIn = suctionPressure * 100000; // bar to Pa
      const pOut = dischargePressure * 100000; // bar to Pa
      
      // Convert CFM to kg/s
      const stdTemp = 293.15; // 20°C in K
      let densityReference;
      try {
        densityReference = window.Module.PropsSI('D', 'T', stdTemp, 'P', pIn, fluid);
      } catch (err) {
        console.error('Error calculating density reference:', err);
        densityReference = 1.2; // Fallback for air
      }
      const massFlowRate = flowRate * 0.000472 * densityReference; // CFM to kg/s

      // Create temperature array
      const numPoints = 50;
      const tempInletC = linspace(tempMin, tempMax, numPoints);
      const tempInletK = tempInletC.map(t => t + 273.15);
      
      // Convert reference temperature to Kelvin
      const tRefK = tempRef + 273.15;
      
      // Calculate reference values
      const h1Ref = window.Module.PropsSI('H', 'T', tRefK, 'P', pIn, fluid);
      const s1Ref = window.Module.PropsSI('S', 'T', tRefK, 'P', pIn, fluid);
      const h2sRef = window.Module.PropsSI('H', 'P', pOut, 'S', s1Ref, fluid);
      const wRef = (h2sRef - h1Ref) / efficiency;
      const pRef = massFlowRate * wRef / 1000; // in kW
      
      // Storage arrays
      const powerKw: number[] = [];
      const savingsPercent: number[] = [];
      
      // Loop through temperature values
      for (const t1 of tempInletK) {
        try {
          const h1 = window.Module.PropsSI('H', 'T', t1, 'P', pIn, fluid);
          const s1 = window.Module.PropsSI('S', 'T', t1, 'P', pIn, fluid);
          const h2s = window.Module.PropsSI('H', 'P', pOut, 'S', s1, fluid);
          const w = (h2s - h1) / efficiency;
          const power = massFlowRate * w / 1000; // in kW
          
          powerKw.push(power);
          savingsPercent.push(100 * (1 - power / pRef));
        } catch (err) {
          console.error(`Error in calculation at T=${t1}K:`, err);
          powerKw.push(0);
          savingsPercent.push(0);
        }
      }

      // Find optimal conditions
      const minPowerIndex = powerKw.indexOf(Math.min(...powerKw));
      const maxSavingsIndex = savingsPercent.indexOf(Math.max(...savingsPercent));

      const results: CompressorResults = {
        temperatures: tempInletC,
        powerKw,
        savingsPercent,
        referenceTemp: tempRef,
        referencePower: pRef,
        optimalTemp: tempInletC[minPowerIndex],
        optimalPower: powerKw[minPowerIndex],
        maxSavings: savingsPercent[maxSavingsIndex]
      };

      setResults(results);
      setTimeout(() => createPlot(results), 100);

    } catch (err) {
      console.error('Calculation error:', err);
      setError('Error in calculation. Please check your input values and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create Plotly chart with design standards
  const createPlot = (results: CompressorResults) => {
    if (!window.Plotly || !plotRef.current) return;

    const { temperatures, powerKw, savingsPercent, referenceTemp } = results;

    // Power consumption trace with orange theme
    const tracePower = {
      x: temperatures,
      y: powerKw,
      mode: 'lines+markers',
      name: 'Compressor Power (kW)',
      line: { 
        color: '#ea580c', // Orange-600 
        width: 3,
        shape: 'spline'
      },
      marker: {
        color: '#ea580c',
        size: 6,
        line: {
          color: '#ffffff',
          width: 2
        }
      },
      type: 'scatter',
      hovertemplate: '<b>%{fullData.name}</b><br>' +
                    'Temperature: %{x}°C<br>' +
                    'Power: %{y:.2f} kW<br>' +
                    '<extra></extra>'
    };

    // Energy savings trace with green theme
    const traceSaving = {
      x: temperatures,
      y: savingsPercent,
      mode: 'lines+markers',
      name: `Power Saving vs ${referenceTemp}°C (%)`,
      line: { 
        color: '#16a34a', // Green-600
        width: 3,
        dash: 'dash',
        shape: 'spline'
      },
      marker: {
        color: '#16a34a',
        size: 6,
        line: {
          color: '#ffffff',
          width: 2
        }
      },
      yaxis: 'y2',
      type: 'scatter',
      hovertemplate: '<b>%{fullData.name}</b><br>' +
                    'Temperature: %{x}°C<br>' +
                    'Savings: %{y:.1f}%<br>' +
                    '<extra></extra>'
    };

    // Enhanced layout with professional styling
    const layout = {
      title: {
        text: 'Compressor Performance Analysis',
        font: {
          family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          size: 18,
          color: '#1f2937',
          weight: 600
        },
        x: 0.5,
        y: 0.95
      },
      xaxis: {
        title: {
          text: 'Suction Temperature (°C)',
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            size: 14,
            color: '#374151'
          }
        },
        showgrid: true,
        gridcolor: '#e5e7eb',
        gridwidth: 1,
        tickfont: {
          family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          size: 12,
          color: '#6b7280'
        },
        linecolor: '#d1d5db',
        linewidth: 1,
        mirror: true
      },
      yaxis: {
        title: {
          text: 'Compressor Power (kW)',
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            size: 14,
            color: '#ea580c'
          }
        },
        titlefont: { color: '#ea580c' },
        tickfont: { 
          family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          size: 12,
          color: '#ea580c' 
        },
        showgrid: true,
        gridcolor: '#f3f4f6',
        gridwidth: 1,
        linecolor: '#d1d5db',
        linewidth: 1,
        mirror: true
      },
      yaxis2: {
        title: {
          text: `Power Saving vs ${referenceTemp}°C (%)`,
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            size: 14,
            color: '#16a34a'
          }
        },
        titlefont: { color: '#16a34a' },
        tickfont: { 
          family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          size: 12,
          color: '#16a34a' 
        },
        anchor: 'x',
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        linecolor: '#d1d5db',
        linewidth: 1,
        mirror: true
      },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: '#ffffff',
        bordercolor: '#e5e7eb',
        font: {
          family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          size: 12,
          color: '#374151'
        }
      },
      showlegend: false,
      margin: {
        l: 80,
        r: 80,
        t: 80,
        b: 80
      },
      font: {
        family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        size: 12,
        color: '#374151'
      },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff',
      shapes: [
        {
          type: 'line',
          x0: referenceTemp,
          x1: referenceTemp,
          y0: 0,
          y1: Math.max(...powerKw) * 1.05,
          line: { 
            color: '#dc2626', // Red-600
            width: 2,
            dash: 'dot' 
          },
          name: `Reference (${referenceTemp}°C)`
        }
      ],
      annotations: [
        {
          x: referenceTemp,
          y: Math.max(...powerKw) * 0.9,
          text: `Reference<br>${referenceTemp}°C`,
          showarrow: true,
          arrowhead: 2,
          arrowsize: 1,
          arrowwidth: 2,
          arrowcolor: '#dc2626',
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            size: 11,
            color: '#dc2626'
          },
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          bordercolor: '#dc2626',
          borderwidth: 1
        }
      ]
    };

    // Professional plot configuration
    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: [
        'pan2d', 
        'lasso2d', 
        'select2d',
        'autoScale2d',
        'hoverClosestCartesian',
        'hoverCompareCartesian'
      ],
      toImageButtonOptions: {
        format: 'png',
        filename: 'compressor_performance_analysis',
        height: 600,
        width: 1000,
        scale: 2
      },
      displaylogo: false
    };

    window.Plotly.newPlot(plotRef.current, [tracePower, traceSaving], layout, config);
  };

  // Get summary data for key points
  const getSummaryData = (): SummaryPoint[] => {
    if (!results) return [];

    const { temperatures, powerKw, savingsPercent, referenceTemp } = results;

    // Find index closest to reference temperature
    const closestIndex = temperatures.reduce((prev: any, curr: any, idx: any) =>
      Math.abs(curr - referenceTemp) < Math.abs(temperatures[prev] - referenceTemp) ? idx : prev, 0
    );

    const keyPoints = [10, 15, 20, 25, 30, 35, 40].map(temp => {
      const index = temperatures.findIndex(t => Math.abs(t - temp) < 0.5);
      if (index === -1) return null;
      return {
        temp: temperatures[index],
        power: powerKw[index],
        savings: savingsPercent[index]
      };
    }).filter(Boolean) as SummaryPoint[];

    return keyPoints;
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Tools
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools/compressor-analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Compressor Analysis
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Performance Analyzer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/tools/compressor-analysis">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compressor Performance Analyzer</h1>
          <p className="text-muted-foreground text-sm">
            Analyze compressor power consumption and energy savings using CoolProp thermodynamics
          </p>
        </div>
      </div>

      {/* Status Alerts - Compact */}
      {!coolPropReady && (
        <Alert className="mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription className="text-sm">Loading CoolProp library...</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {coolPropReady && !error && (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">CoolProp ready for calculations.</AlertDescription>
        </Alert>
      )}

      {/* Main Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pressure Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="suctionPressure" className="text-sm">Suction Pressure (bar)</Label>
                  <Input
                    id="suctionPressure"
                    type="number"
                    step="0.1"
                    className="text-sm"
                    value={formData.suctionPressure}
                    onChange={(e) => setFormData({...formData, suctionPressure: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dischargePressure" className="text-sm">Discharge Pressure (bar)</Label>
                  <Input
                    id="dischargePressure"
                    type="number"
                    step="0.1"
                    className="text-sm"
                    value={formData.dischargePressure}
                    onChange={(e) => setFormData({...formData, dischargePressure: Number(e.target.value)})}
                  />
                </div>
              </div>

              {/* Flow Rate and Efficiency */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="flowRate" className="text-sm">Flow Rate (CFM)</Label>
                  <Input
                    id="flowRate"
                    type="number"
                    step="1"
                    className="text-sm"
                    value={formData.flowRate}
                    onChange={(e) => setFormData({...formData, flowRate: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="efficiency" className="text-sm">Efficiency</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="1.0"
                    className="text-sm"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({...formData, efficiency: Number(e.target.value)})}
                  />
                </div>
              </div>

              {/* Temperature Range */}
              <div className="space-y-2">
                <Label className="text-sm">Temperature Range (°C)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    className="text-sm"
                    value={formData.tempMin}
                    onChange={(e) => setFormData({...formData, tempMin: Number(e.target.value)})}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    className="text-sm"
                    value={formData.tempMax}
                    onChange={(e) => setFormData({...formData, tempMax: Number(e.target.value)})}
                  />
                  <Input
                    placeholder="Ref"
                    type="number"
                    className="text-sm"
                    value={formData.tempRef}
                    onChange={(e) => setFormData({...formData, tempRef: Number(e.target.value)})}
                  />
                </div>
              </div>

              {/* Fluid Selection */}
              <div className="space-y-2">
                <Label htmlFor="fluid" className="text-sm">Working Fluid</Label>
                <Select value={formData.fluid} onValueChange={(value) => setFormData({...formData, fluid: value})}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select fluid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Air">Air</SelectItem>
                    <SelectItem value="Nitrogen">Nitrogen</SelectItem>
                    <SelectItem value="Oxygen">Oxygen</SelectItem>
                    <SelectItem value="CarbonDioxide">Carbon Dioxide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={performCalculation} 
                disabled={!coolPropReady || isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate Performance'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2 space-y-4">
          {results ? (
            <>
              {/* Performance Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="text-center">
                  <CardContent className="p-3">
                    <div className="text-lg font-bold text-blue-600">{results.referencePower.toFixed(2)} kW</div>
                    <div className="text-xs text-muted-foreground">Reference Power at {results.referenceTemp}°C</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-3">
                    <div className="text-lg font-bold text-green-600">{results.optimalPower.toFixed(2)} kW</div>
                    <div className="text-xs text-muted-foreground">Optimal Power at {results.optimalTemp.toFixed(1)}°C</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-3">
                    <div className="text-lg font-bold text-orange-600">{results.maxSavings.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Maximum Savings</div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Performance Analysis Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={plotRef} className="w-full h-80" />
                  
                  {/* Custom Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-orange-600 rounded"></div>
                      <span className="text-sm text-gray-700">Compressor Power (kW)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-green-600 border-dashed border-t-2 border-green-600"></div>
                      <span className="text-sm text-gray-700">Power Saving vs {results.referenceTemp}°C (%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 border-dashed border-t-2 border-red-600"></div>
                      <span className="text-sm text-gray-700">Reference ({results.referenceTemp}°C)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Table */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm">Temperature (°C)</TableHead>
                        <TableHead className="text-sm">Power (kW)</TableHead>
                        <TableHead className="text-sm">Savings (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSummaryData().map((point, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-sm">{point.temp.toFixed(1)}</TableCell>
                          <TableCell className="text-sm">{point.power.toFixed(2)}</TableCell>
                          <TableCell className={`text-sm ${point.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {point.savings.toFixed(1)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Ready for Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your compressor parameters on the left and click "Calculate Performance" to generate detailed analysis and charts.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
