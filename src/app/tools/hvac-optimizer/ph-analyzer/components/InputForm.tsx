// P-H Analyzer Input Form Component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, AlertCircle } from 'lucide-react';
import { PHAnalyzerInputs, ValidationError, REFRIGERANTS, SYSTEM_TYPES } from '../types';

interface InputFormProps {
  inputs: PHAnalyzerInputs;
  onInputChange: (field: keyof PHAnalyzerInputs, value: any) => void;
  onCalculate: () => void;
  isCalculating: boolean;
  validationErrors: ValidationError[];
}

export function InputForm({ 
  inputs, 
  onInputChange, 
  onCalculate, 
  isCalculating, 
  validationErrors 
}: InputFormProps) {
  
  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  const hasError = (field: string) => {
    return validationErrors.some(error => error.field === field);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Cycle Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="refrigerant">Refrigerant</Label>
            <Select 
              value={inputs.refrigerant} 
              onValueChange={(value) => onInputChange('refrigerant', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select refrigerant" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Common Refrigerants</div>
                {REFRIGERANTS.filter(r => r.common).map((refrigerant) => (
                  <SelectItem key={refrigerant.value} value={refrigerant.value}>
                    {refrigerant.label}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-1">Other</div>
                {REFRIGERANTS.filter(r => !r.common).map((refrigerant) => (
                  <SelectItem key={refrigerant.value} value={refrigerant.value}>
                    {refrigerant.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemType">System Type</Label>
            <Select 
              value={inputs.systemType} 
              onValueChange={(value) => onInputChange('systemType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                {SYSTEM_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Temperature Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Temperature Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evaporatorTemp">
                Evaporator Temperature (°C)
              </Label>
              <Input
                id="evaporatorTemp"
                type="number"
                step="0.1"
                value={inputs.evaporatorTemp}
                onChange={(e) => onInputChange('evaporatorTemp', parseFloat(e.target.value))}
                className={hasError('evaporatorTemp') ? 'border-red-500' : ''}
              />
              {hasError('evaporatorTemp') && (
                <p className="text-sm text-red-600">{getFieldError('evaporatorTemp')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="condenserTemp">
                Condenser Temperature (°C)
              </Label>
              <Input
                id="condenserTemp"
                type="number"
                step="0.1"
                value={inputs.condenserTemp}
                onChange={(e) => onInputChange('condenserTemp', parseFloat(e.target.value))}
                className={hasError('condenserTemp') ? 'border-red-500' : ''}
              />
              {hasError('condenserTemp') && (
                <p className="text-sm text-red-600">{getFieldError('condenserTemp')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Superheat and Subcooling */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Superheat & Subcooling</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSuperheating"
                  checked={inputs.enableSuperheating}
                  onCheckedChange={(checked) => onInputChange('enableSuperheating', checked)}
                />
                <Label htmlFor="enableSuperheating" className="text-sm">Superheat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableSubcooling"
                  checked={inputs.enableSubcooling}
                  onCheckedChange={(checked) => onInputChange('enableSubcooling', checked)}
                />
                <Label htmlFor="enableSubcooling" className="text-sm">Subcooling</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="superheating">
                Superheating (K)
              </Label>
              <Input
                id="superheating"
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={inputs.superheating}
                onChange={(e) => onInputChange('superheating', parseFloat(e.target.value))}
                disabled={!inputs.enableSuperheating}
                className={hasError('superheating') ? 'border-red-500' : ''}
              />
              {hasError('superheating') && (
                <p className="text-sm text-red-600">{getFieldError('superheating')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcooling">
                Subcooling (K)
              </Label>
              <Input
                id="subcooling"
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={inputs.subcooling}
                onChange={(e) => onInputChange('subcooling', parseFloat(e.target.value))}
                disabled={!inputs.enableSubcooling}
                className={hasError('subcooling') ? 'border-red-500' : ''}
              />
              {hasError('subcooling') && (
                <p className="text-sm text-red-600">{getFieldError('subcooling')}</p>
              )}
            </div>
          </div>
        </div>

        {/* System Parameters */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">System Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coolingCapacity">
                Cooling Capacity (kW)
              </Label>
              <Input
                id="coolingCapacity"
                type="number"
                step="0.1"
                min="0.1"
                value={inputs.coolingCapacity}
                onChange={(e) => onInputChange('coolingCapacity', parseFloat(e.target.value))}
                className={hasError('coolingCapacity') ? 'border-red-500' : ''}
              />
              {hasError('coolingCapacity') && (
                <p className="text-sm text-red-600">{getFieldError('coolingCapacity')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compressorEfficiency">
                Compressor Efficiency (0-1)
              </Label>
              <Input
                id="compressorEfficiency"
                type="number"
                step="0.01"
                min="0.1"
                max="1"
                value={inputs.compressorEfficiency}
                onChange={(e) => onInputChange('compressorEfficiency', parseFloat(e.target.value))}
                className={hasError('compressorEfficiency') ? 'border-red-500' : ''}
              />
              {hasError('compressorEfficiency') && (
                <p className="text-sm text-red-600">{getFieldError('compressorEfficiency')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volumetricEfficiency">
                Volumetric Efficiency (0-1)
              </Label>
              <Input
                id="volumetricEfficiency"
                type="number"
                step="0.01"
                min="0.1"
                max="1"
                value={inputs.volumetricEfficiency}
                onChange={(e) => onInputChange('volumetricEfficiency', parseFloat(e.target.value))}
                className={hasError('volumetricEfficiency') ? 'border-red-500' : ''}
              />
              {hasError('volumetricEfficiency') && (
                <p className="text-sm text-red-600">{getFieldError('volumetricEfficiency')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Environmental Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ambientTemp">
                Ambient Temperature (°C)
              </Label>
              <Input
                id="ambientTemp"
                type="number"
                step="0.1"
                value={inputs.ambientTemp}
                onChange={(e) => onInputChange('ambientTemp', parseFloat(e.target.value))}
                className={hasError('ambientTemp') ? 'border-red-500' : ''}
              />
              {hasError('ambientTemp') && (
                <p className="text-sm text-red-600">{getFieldError('ambientTemp')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="indoorTemp">
                Indoor Temperature (°C)
              </Label>
              <Input
                id="indoorTemp"
                type="number"
                step="0.1"
                value={inputs.indoorTemp}
                onChange={(e) => onInputChange('indoorTemp', parseFloat(e.target.value))}
                className={hasError('indoorTemp') ? 'border-red-500' : ''}
              />
              {hasError('indoorTemp') && (
                <p className="text-sm text-red-600">{getFieldError('indoorTemp')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Analysis Options</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="showIsotherms"
                checked={inputs.showIsotherms}
                onCheckedChange={(checked) => onInputChange('showIsotherms', checked)}
              />
              <Label htmlFor="showIsotherms" className="text-sm">Show Isotherms</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showIsobars"
                checked={inputs.showIsobars}
                onCheckedChange={(checked) => onInputChange('showIsobars', checked)}
              />
              <Label htmlFor="showIsobars" className="text-sm">Show Isobars</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showQualityLines"
                checked={inputs.showQualityLines}
                onCheckedChange={(checked) => onInputChange('showQualityLines', checked)}
              />
              <Label htmlFor="showQualityLines" className="text-sm">Quality Lines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="detailedAnalysis"
                checked={inputs.detailedAnalysis}
                onCheckedChange={(checked) => onInputChange('detailedAnalysis', checked)}
              />
              <Label htmlFor="detailedAnalysis" className="text-sm">Detailed Analysis</Label>
            </div>
          </div>
        </div>

        {/* Diagram Scaling Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Diagram Scaling</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="autoScale"
                checked={inputs.autoScale}
                onCheckedChange={(checked) => onInputChange('autoScale', checked)}
              />
              <Label htmlFor="autoScale" className="text-sm font-medium">Auto-scale to cycle data</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="forceLogScale"
                checked={inputs.forceLogScale}
                onCheckedChange={(checked) => onInputChange('forceLogScale', checked)}
              />
              <Label htmlFor="forceLogScale" className="text-sm">Force logarithmic pressure scale</Label>
            </div>

            <div className="text-xs text-muted-foreground pl-4">
              <p>• Auto-scale automatically adjusts axes to your cycle data range</p>
              <p>• Uses linear scale for small pressure ratios (&lt;4) for better visibility</p>
              <p>• Force log scale maintains traditional P-H diagram format</p>
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the following errors before calculating:
              <ul className="list-disc list-inside mt-2">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Calculate Button */}
        <Button 
          onClick={onCalculate} 
          disabled={isCalculating || validationErrors.length > 0}
          className="w-full"
          size="lg"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Cycle
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
