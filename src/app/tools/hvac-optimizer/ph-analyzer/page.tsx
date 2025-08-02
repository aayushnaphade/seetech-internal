'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { AlertCircle, Home, Wrench, Activity, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import our components and types
import { InputForm } from './components/InputForm';
import { PHDiagram } from './components/PHDiagram';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ProcessAnalysis } from './components/ProcessAnalysis';
import { 
  PHAnalyzerInputs, 
  CycleResults, 
  ValidationError, 
  CalculationState 
} from './types';
import { 
  validateInputs, 
  calculateBasicCycle 
} from './calculations';

declare global {
  interface Window {
    Module: any;
    Plotly: any;
  }
}

export default function PHAnalyzerPage() {
  // Input state
  const [inputs, setInputs] = useState<PHAnalyzerInputs>({
    refrigerant: 'R134a',
    systemType: 'cooling',
    evaporatorTemp: 5,
    condenserTemp: 40,
    subcooling: 5,
    superheating: 5,
    coolingCapacity: 100,
    compressorEfficiency: 0.85,
    volumetricEfficiency: 0.85,
    ambientTemp: 35,
    indoorTemp: 20,
    enableSubcooling: true,
    enableSuperheating: true,
    enableOptimization: false,
    showIsotherms: false,
    showIsobars: false,
    showQualityLines: false,
    detailedAnalysis: true,
    autoScale: true,
    forceLogScale: false,
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
            script.src = 'https://cdn.plot.ly/plotly-3.0.3.min.js';
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
  const handleInputChange = (field: keyof PHAnalyzerInputs, value: any) => {
    setInputs(prev => {
      const newInputs = { ...prev, [field]: value };
      
      // Reset dependent values when switches are toggled
      if (field === 'enableSuperheating' && !value) {
        newInputs.superheating = 0;
      }
      if (field === 'enableSubcooling' && !value) {
        newInputs.subcooling = 0;
      }
      
      // Clear previous results when inputs change
      setCalculationState(prev => ({ ...prev, results: null, error: null }));
      
      // Validate inputs
      const errors = validateInputs(newInputs);
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
    const errors = validateInputs(inputs);
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
      
      const results = calculateBasicCycle(inputs);
      
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
            <CardTitle>Loading P-H Analyzer</CardTitle>
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
            <BreadcrumbPage>P-H Analyzer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">P-H Analyzer</h1>
        <p className="text-muted-foreground text-lg">
          Pressure-Enthalpy diagram analysis for vapor compression refrigeration cycles
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
          <InputForm
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
            <>
              {/* P-H Diagram */}
              <PHDiagram
                results={calculationState.results}
                refrigerant={inputs.refrigerant}
                inputs={inputs}
                isLoading={calculationState.isCalculating}
              />

              {/* Results Display */}
              <ResultsDisplay
                results={calculationState.results}
                refrigerant={inputs.refrigerant}
                systemType={inputs.systemType}
              />

              {/* Process Analysis */}
              {inputs.detailedAnalysis && (
                <ProcessAnalysis
                  results={calculationState.results}
                  refrigerant={inputs.refrigerant}
                />
              )}
            </>
          )}

          {/* Placeholder when no results */}
          {!calculationState.results && !calculationState.isCalculating && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Ready for Analysis</h3>
                    <p className="text-muted-foreground">
                      Configure your cycle parameters and click "Calculate Cycle" to generate the P-H diagram and performance analysis.
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
          <CardTitle>How to Use the P-H Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Getting Started:</h4>
              <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li>Select your refrigerant and system type</li>
                <li>Set evaporator and condenser temperatures</li>
                <li>Configure superheat and subcooling settings</li>
                <li>Enter cooling capacity and compressor efficiency</li>
                <li>Click "Calculate Cycle" to analyze</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Understanding Results:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                <li>Interactive P-H diagram with cycle visualization</li>
                <li>Complete thermodynamic state point data</li>
                <li>Performance metrics (COP, EER, power consumption)</li>
                <li>Process analysis for each cycle step</li>
                <li>Exportable data and diagram downloads</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
