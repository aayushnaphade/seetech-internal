'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Loader2, AlertCircle, CheckCircle, Home, Wrench } from 'lucide-react';

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

export default function CompressorAnalysisPage() {
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
            // Check if script is already loading
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

        // Configure Module for CoolProp only if not already configured
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

        // Load CoolProp only if not already loaded
        if (!window.Module.PropsSI) {
          // Check if CoolProp script is already loading
          if (document.querySelector('script[src*="coolprop"]')) {
            return;
          }
          
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/coolprop.js';
            script.onload = () => {
              // Check if CoolProp is ready
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

    // Cleanup function
    return () => {
      // Don't remove scripts on unmount as they might be needed by other components
      // Just reset the ready state
      setCoolPropReady(false);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Create linear space array (like numpy's linspace)
  const linspace = (start: number, stop: number, num: number): number[] => {
    const step = (stop - start) / (num - 1);
    return Array.from({length: num}, (_, i) => start + i * step);
  };

  // Perform compressor analysis calculation
  const performCalculation = async () => {
    if (!coolPropReady || !window.Module || typeof window.Module.PropsSI !== 'function') {
      setError('CoolProp is not ready. Please wait for the library to load.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const {
        suctionPressure,
        dischargePressure,
        flowRate,
        efficiency,
        tempMin,
        tempMax,
        tempRef,
        fluid
      } = formData;

      // Convert units
      const pIn = suctionPressure * 100000; // bar to Pa
      const pOut = dischargePressure * 100000; // bar to Pa
      const tRefK = tempRef + 273.15; // °C to K

      // Calculate reference density and mass flow rate
      const stdTemp = 293.15; // 20°C in K
      let densityReference: number;
      try {
        densityReference = window.Module.PropsSI('D', 'T', stdTemp, 'P', pIn, fluid);
      } catch (err) {
        console.warn('Error calculating density reference:', err);
        densityReference = 1.2; // Approximate air density as fallback
      }
      
      const massFlowRate = flowRate * 0.000472 * densityReference; // CFM to kg/s

      // Calculate reference values
      const h1Ref = window.Module.PropsSI('H', 'T', tRefK, 'P', pIn, fluid);
      const s1Ref = window.Module.PropsSI('S', 'T', tRefK, 'P', pIn, fluid);
      const h2sRef = window.Module.PropsSI('H', 'P', pOut, 'S', s1Ref, fluid);
      const wRef = (h2sRef - h1Ref) / efficiency;
      const pRef = massFlowRate * wRef / 1000; // kW

      // Create temperature array
      const numPoints = 50;
      const tempC = linspace(tempMin, tempMax, numPoints);
      const tempK = tempC.map(t => t + 273.15);

      // Calculate power and savings for each temperature
      const powerKw: number[] = [];
      const savingsPercent: number[] = [];

      for (const t1 of tempK) {
        try {
          const h1 = window.Module.PropsSI('H', 'T', t1, 'P', pIn, fluid);
          const s1 = window.Module.PropsSI('S', 'T', t1, 'P', pIn, fluid);
          const h2s = window.Module.PropsSI('H', 'P', pOut, 'S', s1, fluid);
          const w = (h2s - h1) / efficiency;
          const power = massFlowRate * w / 1000; // kW
          
          powerKw.push(power);
          savingsPercent.push(100 * (1 - power / pRef));
        } catch (err) {
          console.error(`Error in calculation at T=${t1}K:`, err);
          powerKw.push(0);
          savingsPercent.push(0);
        }
      }

      // Find optimal operating point
      const minPowerIndex = powerKw.indexOf(Math.min(...powerKw));
      const optimalTemp = tempC[minPowerIndex];
      const optimalPower = powerKw[minPowerIndex];
      const maxSavings = savingsPercent[minPowerIndex];

      const results: CompressorResults = {
        temperatures: tempC,
        powerKw,
        savingsPercent,
        referenceTemp: tempRef,
        referencePower: pRef,
        optimalTemp,
        optimalPower,
        maxSavings
      };

      setResults(results);
      
      // Create the plot
      setTimeout(() => createPlot(results), 200);

    } catch (err) {
      console.error('Calculation error:', err);
      setError('Error in calculation. Please check your input parameters.');
    } finally {
      setIsLoading(false);
    }
  };

  // Create Plotly visualization
  const createPlot = (results: CompressorResults) => {
    if (!plotRef.current || !window.Plotly) return;

    const {
      temperatures,
      powerKw,
      savingsPercent,
      referenceTemp
    } = results;

    // Create traces
    const tracePower = {
      x: temperatures,
      y: powerKw,
      mode: 'lines+markers',
      name: 'Compressor Power (kW)',
      line: {color: 'blue'},
      type: 'scatter'
    };

    const traceSavings = {
      x: temperatures,
      y: savingsPercent,
      mode: 'lines+markers',
      name: `Power Saving vs ${referenceTemp}°C (%)`,
      line: {color: 'green', dash: 'dash'},
      yaxis: 'y2',
      type: 'scatter'
    };

    // Define layout
    const layout = {
      title: 'Compressor Power & Savings vs Suction Air Temperature',
      xaxis: {
        title: 'Suction Temperature (°C)'
      },
      yaxis: {
        title: 'Compressor Power (kW)',
        titlefont: {color: 'blue'},
        tickfont: {color: 'blue'},
        range: [0, Math.max(...powerKw) * 1.05]
      },
      yaxis2: {
        title: `Power Saving vs ${referenceTemp}°C (%)`,
        titlefont: {color: 'green'},
        tickfont: {color: 'green'},
        anchor: 'x',
        overlaying: 'y',
        side: 'right',
        range: [0, 15]
      },
      hovermode: 'closest',
      template: 'plotly_white',
      legend: {x: 0.01, y: 0.99},
      shapes: [
        {
          type: 'line',
          x0: referenceTemp,
          x1: referenceTemp,
          y0: 0,
          y1: Math.max(...powerKw) * 1.05,
          line: {color: 'red', dash: 'dot'}
        },
        {
          type: 'line',
          x0: referenceTemp,
          x1: referenceTemp,
          y0: 0,
          y1: 15,
          yref: 'y2',
          line: {color: 'red', dash: 'dot'}
        }
      ]
    };

    window.Plotly.newPlot(plotRef.current, [tracePower, traceSavings], layout);
  };

  // Generate summary data
  const getSummaryData = (): SummaryPoint[] => {
    if (!results) return [];

    const tempPoints = [10, 20, 30, results.referenceTemp];
    return tempPoints.map(temp => {
      const closestIndex = results.temperatures.reduce((prev, curr, idx) => 
        Math.abs(curr - temp) < Math.abs(results.temperatures[prev] - temp) ? idx : prev, 0);
      
      return {
        temp: results.temperatures[closestIndex],
        power: results.powerKw[closestIndex],
        savings: results.savingsPercent[closestIndex]
      };
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tools" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Engineering Tools
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Compressor Analysis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Air Compressor Analysis Tool
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Analyze compressor power consumption and energy savings at different suction temperatures
          </p>
        </CardHeader>
      </Card>

      {/* Status Alert */}
      {!coolPropReady && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Loading CoolProp library... Please wait for initialization to complete.
          </AlertDescription>
        </Alert>
      )}

      {coolPropReady && !results && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            System ready! Configure your compressor parameters and run the analysis.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suctionPressure">Suction Pressure (bar)</Label>
                <Input
                  id="suctionPressure"
                  type="number"
                  step="0.1"
                  value={formData.suctionPressure}
                  onChange={(e) => handleInputChange('suctionPressure', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dischargePressure">Discharge Pressure (bar)</Label>
                <Input
                  id="dischargePressure"
                  type="number"
                  step="0.1"
                  value={formData.dischargePressure}
                  onChange={(e) => handleInputChange('dischargePressure', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flowRate">Flow Rate (CFM)</Label>
                <Input
                  id="flowRate"
                  type="number"
                  step="1"
                  value={formData.flowRate}
                  onChange={(e) => handleInputChange('flowRate', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="efficiency">Compressor Efficiency (0-1)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.efficiency}
                  onChange={(e) => handleInputChange('efficiency', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempMin">Min Temperature (°C)</Label>
                <Input
                  id="tempMin"
                  type="number"
                  step="1"
                  value={formData.tempMin}
                  onChange={(e) => handleInputChange('tempMin', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempMax">Max Temperature (°C)</Label>
                <Input
                  id="tempMax"
                  type="number"
                  step="1"
                  value={formData.tempMax}
                  onChange={(e) => handleInputChange('tempMax', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempRef">Reference Temperature (°C)</Label>
                <Input
                  id="tempRef"
                  type="number"
                  step="1"
                  value={formData.tempRef}
                  onChange={(e) => handleInputChange('tempRef', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fluid">Working Fluid</Label>
                <Select value={formData.fluid} onValueChange={(value) => handleInputChange('fluid', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Air">Air</SelectItem>
                    <SelectItem value="Nitrogen">Nitrogen</SelectItem>
                    <SelectItem value="Oxygen">Oxygen</SelectItem>
                    <SelectItem value="CarbonDioxide">Carbon Dioxide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={performCalculation}
              disabled={!coolPropReady || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Calculate'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Plot */}
            <div ref={plotRef} className="w-full h-[600px] mb-6" />

            {/* Summary */}
            {results && (
              <div className="space-y-4">
                <h3 className="font-semibold">Power Savings Summary</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Temperature (°C)</TableHead>
                      <TableHead>Power (kW)</TableHead>
                      <TableHead>Savings (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSummaryData().map((point, index) => (
                      <TableRow key={index}>
                        <TableCell>{point.temp.toFixed(1)}</TableCell>
                        <TableCell>{point.power.toFixed(2)}</TableCell>
                        <TableCell>{point.savings.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Optimal Operating Point</h4>
                  <p className="text-sm">Lowest power consumption at {results.optimalTemp.toFixed(1)}°C: {results.optimalPower.toFixed(2)} kW</p>
                  <p className="text-sm">Maximum savings: {results.maxSavings.toFixed(2)}%</p>
                </div>
              </div>
            )}

            {!results && coolPropReady && (
              <p className="text-center text-muted-foreground py-8">
                Enter parameters and click Calculate to see results.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
