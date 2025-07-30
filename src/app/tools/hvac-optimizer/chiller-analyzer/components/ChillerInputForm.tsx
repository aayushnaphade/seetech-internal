'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calculator } from 'lucide-react';
import { ChillerInputs, ValidationError, CHILLER_REFRIGERANTS } from '../types';

interface ChillerInputFormProps {
  inputs: ChillerInputs;
  onInputChange: (field: keyof ChillerInputs, value: any) => void;
  onCalculate: () => void;
  isCalculating: boolean;
  validationErrors: ValidationError[];
}

export function ChillerInputForm({
  inputs,
  onInputChange,
  onCalculate,
  isCalculating,
  validationErrors
}: ChillerInputFormProps) {
  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  const hasErrors = validationErrors.length > 0;

  return (
    <div className="space-y-6">
      {/* OEM Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">OEM Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="refrigerant">Refrigerant</Label>
            <Select 
              value={inputs.refrigerant} 
              onValueChange={(value) => onInputChange('refrigerant', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHILLER_REFRIGERANTS.map((ref) => (
                  <SelectItem key={ref.value} value={ref.value}>
                    {ref.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="oemCOP">OEM COP</Label>
            <Input
              id="oemCOP"
              type="number"
              step="0.01"
              value={inputs.oemCOP}
              onChange={(e) => onInputChange('oemCOP', parseFloat(e.target.value))}
              className={getFieldError('oemCOP') ? 'border-red-500' : ''}
            />
            {getFieldError('oemCOP') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('oemCOP')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="oemCapacity">Capacity (kW)</Label>
            <Input
              id="oemCapacity"
              type="number"
              value={inputs.oemCapacity}
              onChange={(e) => onInputChange('oemCapacity', parseFloat(e.target.value))}
              className={getFieldError('oemCapacity') ? 'border-red-500' : ''}
            />
            {getFieldError('oemCapacity') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('oemCapacity')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sensor Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actual Sensor Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="evapPressure">Evap Pressure (kPa)</Label>
              <Input
                id="evapPressure"
                type="number"
                step="0.1"
                value={inputs.evapPressure}
                onChange={(e) => onInputChange('evapPressure', parseFloat(e.target.value))}
                className={getFieldError('evapPressure') ? 'border-red-500' : ''}
              />
              {getFieldError('evapPressure') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('evapPressure')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="condPressure">Cond Pressure (kPa)</Label>
              <Input
                id="condPressure"
                type="number"
                step="0.1"
                value={inputs.condPressure}
                onChange={(e) => onInputChange('condPressure', parseFloat(e.target.value))}
                className={getFieldError('condPressure') ? 'border-red-500' : ''}
              />
              {getFieldError('condPressure') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('condPressure')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="suctionTemp">Suction Temp (°C)</Label>
              <Input
                id="suctionTemp"
                type="number"
                step="0.1"
                value={inputs.suctionTemp}
                onChange={(e) => onInputChange('suctionTemp', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="dischargeTemp">Discharge Temp (°C)</Label>
              <Input
                id="dischargeTemp"
                type="number"
                step="0.1"
                value={inputs.dischargeTemp}
                onChange={(e) => onInputChange('dischargeTemp', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="evapLWT">Evap LWT (°C)</Label>
              <Input
                id="evapLWT"
                type="number"
                step="0.1"
                value={inputs.evapLWT}
                onChange={(e) => onInputChange('evapLWT', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="evapEWT">Evap EWT (°C)</Label>
              <Input
                id="evapEWT"
                type="number"
                step="0.1"
                value={inputs.evapEWT}
                onChange={(e) => onInputChange('evapEWT', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="superheat">Superheat (K)</Label>
              <Input
                id="superheat"
                type="number"
                step="0.1"
                value={inputs.superheat}
                onChange={(e) => onInputChange('superheat', parseFloat(e.target.value))}
                className={getFieldError('superheat') ? 'border-red-500' : ''}
              />
              {getFieldError('superheat') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('superheat')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="subcooling">Subcooling (K)</Label>
              <Input
                id="subcooling"
                type="number"
                step="0.1"
                value={inputs.subcooling}
                onChange={(e) => onInputChange('subcooling', parseFloat(e.target.value))}
                className={getFieldError('subcooling') ? 'border-red-500' : ''}
              />
              {getFieldError('subcooling') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('subcooling')}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Environmental Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ambientDBT">Ambient DBT (°C)</Label>
              <Input
                id="ambientDBT"
                type="number"
                step="0.1"
                value={inputs.ambientDBT}
                onChange={(e) => onInputChange('ambientDBT', parseFloat(e.target.value))}
                className={getFieldError('ambientDBT') ? 'border-red-500' : ''}
              />
              {getFieldError('ambientDBT') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('ambientDBT')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="relativeHumidity">Relative Humidity (%)</Label>
              <Input
                id="relativeHumidity"
                type="number"
                step="0.1"
                min="5"
                max="99"
                value={inputs.relativeHumidity}
                onChange={(e) => onInputChange('relativeHumidity', parseFloat(e.target.value))}
                className={getFieldError('relativeHumidity') ? 'border-red-500' : ''}
              />
              <p className="text-sm text-muted-foreground mt-1">
                WBT calculated automatically using Stull formula
              </p>
              {getFieldError('relativeHumidity') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('relativeHumidity')}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="condApproach">Condenser Approach (K)</Label>
            <Input
              id="condApproach"
              type="number"
              step="0.1"
              value={inputs.condApproach}
              onChange={(e) => onInputChange('condApproach', parseFloat(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="compressorEfficiency">Compressor Efficiency</Label>
            <Input
              id="compressorEfficiency"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={inputs.compressorEfficiency}
              onChange={(e) => onInputChange('compressorEfficiency', parseFloat(e.target.value))}
              className={getFieldError('compressorEfficiency') ? 'border-red-500' : ''}
            />
            {getFieldError('compressorEfficiency') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('compressorEfficiency')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="systemEfficiencyFactor">System Efficiency Factor</Label>
            <Input
              id="systemEfficiencyFactor"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={inputs.systemEfficiencyFactor}
              onChange={(e) => onInputChange('systemEfficiencyFactor', parseFloat(e.target.value))}
              className={getFieldError('systemEfficiencyFactor') ? 'border-red-500' : ''}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Accounts for motor, mechanical, and heat losses
            </p>
            {getFieldError('systemEfficiencyFactor') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('systemEfficiencyFactor')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analysis Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showIsotherms">Show Isotherms</Label>
            <Switch
              id="showIsotherms"
              checked={inputs.showIsotherms}
              onCheckedChange={(checked) => onInputChange('showIsotherms', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showIsobars">Show Isobars</Label>
            <Switch
              id="showIsobars"
              checked={inputs.showIsobars}
              onCheckedChange={(checked) => onInputChange('showIsobars', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showQualityLines">Show Quality Lines</Label>
            <Switch
              id="showQualityLines"
              checked={inputs.showQualityLines}
              onCheckedChange={(checked) => onInputChange('showQualityLines', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Label htmlFor="autoScale">Auto Scale Diagram</Label>
            <Switch
              id="autoScale"
              checked={inputs.autoScale}
              onCheckedChange={(checked) => onInputChange('autoScale', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="forceLogScale">Force Log Scale</Label>
            <Switch
              id="forceLogScale"
              checked={inputs.forceLogScale}
              onCheckedChange={(checked) => onInputChange('forceLogScale', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {hasErrors && (
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
        disabled={isCalculating || hasErrors}
        size="lg"
        className="w-full"
      >
        {isCalculating ? (
          <>
            <Calculator className="mr-2 h-4 w-4 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Calculator className="mr-2 h-4 w-4" />
            Analyze Chiller Performance
          </>
        )}
      </Button>
    </div>
  );
}