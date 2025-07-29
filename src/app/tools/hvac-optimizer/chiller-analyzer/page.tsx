'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { AlertCircle, Home, Wrench, Activity, CheckCircle, Loader2, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import components and utilities
import { ChillerInputForm } from './components/ChillerInputForm';
import { ChillerPHDiagram } from './components/ChillerPHDiagram';
import { ChillerResultsDisplay } from './components/ChillerResultsDisplay';
import { ChillerRecommendations } from './components/ChillerRecommendations';
import { 
  ChillerInputs, 
  ChillerResults, 
  ValidationError, 
  CalculationState 
} from './types';
import { 
  validateChillerInputs, 
  calculateChillerComparison 
} from './calculations';
import './test-calculations'; // Import test functions for debugging

declare global {
  interface Window {
    Module: any;
    Plotly: any;
  }
}



export default function ChillerAnalyzer() {
  // Input state
  const [inputs, setInputs] = useState<ChillerInputs>({
    // OEM Specifications (Daikin RWAD900CZ-XS)
    oemCOP: 2.87,
    oemCapacity: 897, // kW
    refrigerant: 'R134a',
    
    // Actual Sensor Data (sample values)
    evapPressure: 307.7, // kPa
    condPressure: 1244.0, // kPa
    suctionTemp: 15.6, // °C (7°C evap + 8.6K superheat)
    dischargeTemp: 65.0, // °C
    evapLWT: 12.0, // °C
    evapEWT: 7.0, // °C
    condApproach: 7.0, // K
    superheat: 8.6, // K
    subcooling: 0.0, // K
    
    // Environmental Conditions
    ambientDBT: 35.0, // °C
    ambientWBT: 23.0, // °C
    
    // System Parameters
    compressorEfficiency: 0.85,
    systemEfficiencyFactor: 0.42, // Accounts for real-world losses
    
    // Analysis Options
    showIsotherms: false,
    showIsobars: false,
    showQualityLines: false,
    autoScale: true,
    forceLogScale: false
  });

  // Calculation state
  const [calculationState, setCalculationState] = useState<CalculationState>({
    isCalculating: false,
    error: null,
    results: null
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // CoolProp loading state
  const [coolPropReady, setCoolPropReady] = useState(false);
  const [plotlyReady, setPlotlyReady] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Load external libraries
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        setLoadingError(null);

        // Load Plotly
        if (!window.Plotly) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="plotly"]');
            if (existingScript) {
              resolve();
              return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.plot.ly/plotly-3.0.1.min.js';
            script.onload = () => {
              setPlotlyReady(true);
              resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Plotly'));
            document.head.appendChild(script);
          });
        } else {
          setPlotlyReady(true);
        }

        // Configure CoolProp Module
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
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="coolprop"]');
            if (existingScript) {
              resolve();
              return;
            }
            
            const script = document.createElement('script');
            script.src = '/coolprop.js';
            script.onload = () => {
              // Wait for CoolProp to be ready
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
            script.onerror = () => reject(new Error('Failed to load CoolProp'));
            document.head.appendChild(script);
          });
        } else {
          setCoolPropReady(true);
        }

      } catch (error) {
        console.error('Error loading libraries:', error);
        setLoadingError(`Failed to load required libraries: ${error}`);
      }
    };

    loadLibraries();

    // Cleanup
    return () => {
      setCoolPropReady(false);
      setPlotlyReady(false);
    };
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof ChillerInputs, value: any) => {
    setInputs(prev => {
      const newInputs = { ...prev, [field]: value };
      
      // Only clear results for significant changes, not for display options
      const displayOptions = ['showIsotherms', 'showIsobars', 'showQualityLines', 'autoScale', 'forceLogScale'];
      if (!displayOptions.includes(field)) {
        setCalculationState(prev => ({ ...prev, results: null, error: null }));
      }
      
      // Validate inputs
      const errors = validateChillerInputs(newInputs);
      setValidationErrors(errors);
      
      return newInputs;
    });
  };

  // Handle calculation
  const handleCalculate = async () => {
    if (!coolPropReady) {
      setCalculationState(prev => ({ 
        ...prev, 
        error: 'CoolProp library not ready. Please wait a moment and try again.' 
      }));
      return;
    }

    // Validate inputs
    const errors = validateChillerInputs(inputs);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setCalculationState({
      isCalculating: true,
      error: null,
      results: null
    });

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = calculateChillerComparison(inputs);
      
      setCalculationState({
        isCalculating: false,
        error: null,
        results
      });
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculationState({
        isCalculating: false,
        error: `Calculation failed: ${error}`,
        results: null
      });
    }
  };

  // Loading state
  if (!coolPropReady || !plotlyReady) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Chiller Performance Analyzer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Initializing thermodynamic libraries...</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      {plotlyReady ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>Plotly visualization library</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {coolPropReady ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>CoolProp thermodynamic properties</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {loadingError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loadingError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
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
            <BreadcrumbLink href="/tools/hvac-optimizer" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              HVAC Optimizer
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chiller Performance Analyzer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chiller Performance Analyzer</h1>
        <p className="text-muted-foreground text-lg">
          Compare actual chiller performance with OEM specifications and identify optimization opportunities
        </p>
      </div>

      {/* Error Display */}
      {calculationState.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{calculationState.error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <ChillerInputForm
            inputs={inputs}
            onInputChange={handleInputChange}
            onCalculate={handleCalculate}
            isCalculating={calculationState.isCalculating}
            validationErrors={validationErrors}
          />
        </div>

        {/* Results and Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {calculationState.results && (
            <Tabs defaultValue="diagram" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diagram">P-H Diagram</TabsTrigger>
                <TabsTrigger value="results">Performance Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="diagram" className="space-y-6">
                <ChillerPHDiagram
                  results={calculationState.results}
                  refrigerant={inputs.refrigerant}
                  inputs={inputs}
                  isLoading={calculationState.isCalculating}
                />
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                <ChillerResultsDisplay
                  results={calculationState.results}
                  refrigerant={inputs.refrigerant}
                />
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <ChillerRecommendations
                  results={calculationState.results}
                  inputs={inputs}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Placeholder when no results */}
          {!calculationState.results && !calculationState.isCalculating && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Settings className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Ready for Chiller Analysis</h3>
                    <p className="text-muted-foreground">
                      Configure your chiller parameters and sensor data, then click "Analyze Chiller Performance" 
                      to generate the comparison analysis and optimization recommendations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use the Chiller Performance Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Getting Started:</h4>
              <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li>Enter OEM specifications from chiller datasheet</li>
                <li>Input actual sensor readings (pressures, temperatures)</li>
                <li>Set environmental conditions (ambient DBT/WBT)</li>
                <li>Configure system parameters and analysis options</li>
                <li>Click "Analyze Chiller Performance" to compare cycles</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Understanding Results:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Interactive P-H diagram with three-cycle comparison</li>
                <li>Performance degradation detection and alerts</li>
                <li>Energy savings quantification and recommendations</li>
                <li>Detailed thermodynamic state point analysis</li>
                <li>Implementation roadmap with prioritized actions</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Based on Real-World Analysis</h4>
            <p className="text-blue-700 text-sm">
              This tool implements proven methodology from analysis of the Daikin RWAD900CZ-XS air-cooled screw chiller, 
              incorporating real sensor data patterns and validated optimization strategies used in energy efficiency consulting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}