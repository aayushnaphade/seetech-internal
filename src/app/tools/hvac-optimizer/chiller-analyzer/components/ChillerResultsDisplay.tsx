'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { ChillerResults } from '../types';

interface ChillerResultsDisplayProps {
  results: ChillerResults;
  refrigerant: string;
}

export function ChillerResultsDisplay({ results, refrigerant }: ChillerResultsDisplayProps) {
  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getPerformanceIcon = (energySavings: number) => {
    if (energySavings > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (energySavings < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <CheckCircle className="h-4 w-4 text-gray-600" />;
  };

  const getPerformanceBadge = (cycleName: string, energySavings: number) => {
    if (cycleName === 'OEM') return <Badge variant="secondary">Baseline</Badge>;
    if (energySavings > 10) return <Badge className="bg-green-600">Optimized</Badge>;
    if (energySavings < -5) return <Badge variant="destructive">Degraded</Badge>;
    return <Badge variant="outline">Current</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Performance Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* OEM Cycle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">OEM Cycle</CardTitle>
              {getPerformanceBadge('OEM', results.oem.energySavings)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">COP:</span>
              <span className="font-semibold text-lg">{formatNumber(results.oem.cop)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Power:</span>
              <span className="font-semibold">{formatNumber(results.oem.power, 1)} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Capacity:</span>
              <span>{formatNumber(results.oem.capacity, 0)} kW</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Evap Temp:</span>
              <span>{formatNumber(results.oem.evapTemp, 1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cond Temp:</span>
              <span>{formatNumber(results.oem.condTemp, 1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pressure Ratio:</span>
              <span>{formatNumber(results.oem.pressureRatio)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actual Cycle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Actual Cycle</CardTitle>
              {getPerformanceBadge('Actual', results.actual.energySavings)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">COP:</span>
              <span className="font-semibold text-lg">{formatNumber(results.actual.cop)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Power:</span>
              <span className="font-semibold">{formatNumber(results.actual.power, 1)} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">vs OEM:</span>
              <div className="flex items-center gap-1">
                {getPerformanceIcon(results.actual.energySavings)}
                <span className={`font-semibold ${results.actual.energySavings < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatPercentage(results.actual.energySavings)}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Evap Temp:</span>
              <span>{formatNumber(results.actual.evapTemp, 1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cond Temp:</span>
              <span>{formatNumber(results.actual.condTemp, 1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pressure Ratio:</span>
              <span>{formatNumber(results.actual.pressureRatio)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Optimized Cycle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Optimized Cycle</CardTitle>
              {getPerformanceBadge('Optimized', results.optimized.energySavings)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">COP:</span>
              <span className="font-semibold text-lg text-green-600">{formatNumber(results.optimized.cop)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Power:</span>
              <span className="font-semibold text-green-600">{formatNumber(results.optimized.power, 1)} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">vs Actual:</span>
              <div className="flex items-center gap-1">
                {getPerformanceIcon(results.optimized.energySavings)}
                <span className="font-semibold text-green-600">
                  {formatPercentage(results.optimized.energySavings)}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Evap Temp:</span>
              <span>{formatNumber(results.optimized.evapTemp, 1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cond Temp:</span>
              <span className="text-green-600">{formatNumber(results.optimized.condTemp, 1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pressure Ratio:</span>
              <span>{formatNumber(results.optimized.pressureRatio)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-center py-2">OEM</th>
                  <th className="text-center py-2">Actual</th>
                  <th className="text-center py-2">Optimized</th>
                  <th className="text-center py-2">Unit</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-2 font-medium">Cooling COP</td>
                  <td className="text-center py-2">{formatNumber(results.oem.performance.cop_cooling)}</td>
                  <td className="text-center py-2">{formatNumber(results.actual.performance.cop_cooling)}</td>
                  <td className="text-center py-2 text-green-600">{formatNumber(results.optimized.performance.cop_cooling)}</td>
                  <td className="text-center py-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Heating COP</td>
                  <td className="text-center py-2">{formatNumber(results.oem.performance.cop_heating)}</td>
                  <td className="text-center py-2">{formatNumber(results.actual.performance.cop_heating)}</td>
                  <td className="text-center py-2 text-green-600">{formatNumber(results.optimized.performance.cop_heating)}</td>
                  <td className="text-center py-2">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Compressor Power</td>
                  <td className="text-center py-2">{formatNumber(results.oem.performance.compressorPower, 1)}</td>
                  <td className="text-center py-2">{formatNumber(results.actual.performance.compressorPower, 1)}</td>
                  <td className="text-center py-2 text-green-600">{formatNumber(results.optimized.performance.compressorPower, 1)}</td>
                  <td className="text-center py-2">kW</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Mass Flow Rate</td>
                  <td className="text-center py-2">{formatNumber(results.oem.performance.massFlowRate, 3)}</td>
                  <td className="text-center py-2">{formatNumber(results.actual.performance.massFlowRate, 3)}</td>
                  <td className="text-center py-2">{formatNumber(results.optimized.performance.massFlowRate, 3)}</td>
                  <td className="text-center py-2">kg/s</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Volumetric Flow Rate</td>
                  <td className="text-center py-2">{formatNumber(results.oem.performance.volumetricFlowRate, 4)}</td>
                  <td className="text-center py-2">{formatNumber(results.actual.performance.volumetricFlowRate, 4)}</td>
                  <td className="text-center py-2">{formatNumber(results.optimized.performance.volumetricFlowRate, 4)}</td>
                  <td className="text-center py-2">m³/s</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Pressure Ratio</td>
                  <td className="text-center py-2">{formatNumber(results.oem.performance.pressureRatio)}</td>
                  <td className="text-center py-2">{formatNumber(results.actual.performance.pressureRatio)}</td>
                  <td className="text-center py-2">{formatNumber(results.optimized.performance.pressureRatio)}</td>
                  <td className="text-center py-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* State Points Table */}
      <Card>
        <CardHeader>
          <CardTitle>Thermodynamic State Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OEM Cycle Points */}
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">OEM Cycle</h4>
              <div className="space-y-2 text-sm">
                {results.oem.points.map((point, index) => (
                  <div key={point.id} className="p-2 bg-blue-50 rounded">
                    <div className="font-medium">{point.name}</div>
                    <div className="text-muted-foreground">
                      T: {formatNumber(point.temperature, 1)}°C, P: {formatNumber(point.pressure, 2)} bar
                    </div>
                    {point.enthalpy && (
                      <div className="text-muted-foreground">
                        h: {formatNumber(point.enthalpy, 1)} kJ/kg
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actual Cycle Points */}
            <div>
              <h4 className="font-semibold mb-3 text-red-600">Actual Cycle</h4>
              <div className="space-y-2 text-sm">
                {results.actual.points.map((point, index) => (
                  <div key={point.id} className="p-2 bg-red-50 rounded">
                    <div className="font-medium">{point.name}</div>
                    <div className="text-muted-foreground">
                      T: {formatNumber(point.temperature, 1)}°C, P: {formatNumber(point.pressure, 2)} bar
                    </div>
                    {point.enthalpy && (
                      <div className="text-muted-foreground">
                        h: {formatNumber(point.enthalpy, 1)} kJ/kg
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optimized Cycle Points */}
            <div>
              <h4 className="font-semibold mb-3 text-green-600">Optimized Cycle</h4>
              <div className="space-y-2 text-sm">
                {results.optimized.points.map((point, index) => (
                  <div key={point.id} className="p-2 bg-green-50 rounded">
                    <div className="font-medium">{point.name}</div>
                    <div className="text-muted-foreground">
                      T: {formatNumber(point.temperature, 1)}°C, P: {formatNumber(point.pressure, 2)} bar
                    </div>
                    {point.enthalpy && (
                      <div className="text-muted-foreground">
                        h: {formatNumber(point.enthalpy, 1)} kJ/kg
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Alert */}
      {results.degradationZone && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Performance Degradation Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              The actual chiller performance is below OEM specifications. This indicates potential 
              maintenance issues, fouling, or suboptimal operating conditions that should be addressed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}