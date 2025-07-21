// Results Display Component for P-H Analyzer

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Thermometer, Zap, Gauge, BarChart3, Download, Info } from 'lucide-react';
import { CycleResults, CyclePoint } from '../types';
import { formatters } from '../calculations';
import { Button } from '@/components/ui/button';

interface ResultsDisplayProps {
  results: CycleResults;
  refrigerant: string;
  systemType?: 'cooling' | 'heat_pump' | 'refrigeration';
}

export function ResultsDisplay({ results, refrigerant, systemType = 'cooling' }: ResultsDisplayProps) {
  const { points, performance } = results;

  // Determine which COP to display based on system type
  const primaryCOP = systemType === 'heat_pump' ? performance.cop_heating : performance.cop_cooling;
  const primaryCOPLabel = systemType === 'heat_pump' ? 'COP (Heating)' : 'COP (Cooling)';
  const primaryCapacity = systemType === 'heat_pump' ? performance.heatingCapacity : performance.coolingCapacity;
  const primaryCapacityLabel = systemType === 'heat_pump' ? 'Heating Capacity' : 'Cooling Capacity';

  // Performance metrics card data
  const performanceMetrics = [
    {
      label: primaryCapacityLabel,
      value: formatters.power(primaryCapacity),
      icon: Thermometer,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      label: 'Compressor Power',
      value: formatters.power(performance.compressorPower),
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      label: primaryCOPLabel,
      value: formatters.efficiency(primaryCOP),
      icon: Gauge,
      color: 'bg-green-100 text-green-800'
    },
    {
      label: 'EER',
      value: formatters.efficiency(performance.eer),
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const getPhaseColor = (phase: string | undefined) => {
    switch (phase) {
      case 'vapor': return 'bg-red-100 text-red-800';
      case 'liquid': return 'bg-blue-100 text-blue-800';
      case 'two-phase': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportResults = () => {
    const data = {
      refrigerant,
      timestamp: new Date().toISOString(),
      performance,
      points: points.map(point => ({
        id: point.id,
        name: point.name,
        temperature: point.temperature,
        pressure: point.pressure,
        enthalpy: point.enthalpy,
        entropy: point.entropy,
        phase: point.phase,
        quality: point.quality
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ph_analysis_${refrigerant}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Results</CardTitle>
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Badge className={metric.color}>
                      {metric.value}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{metric.label}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Performance Data */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatters.power(systemType === 'heat_pump' ? performance.coolingCapacity : performance.heatingCapacity)}
              </p>
              <p className="text-sm text-gray-600">
                {systemType === 'heat_pump' ? 'Cooling Capacity' : 'Heating Capacity'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatters.efficiency(systemType === 'heat_pump' ? performance.cop_cooling : performance.cop_heating)}
              </p>
              <p className="text-sm text-gray-600">
                {systemType === 'heat_pump' ? 'COP (Cooling)' : 'COP (Heating)'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatters.flowRate(performance.massFlowRate)}
              </p>
              <p className="text-sm text-gray-600">Mass Flow Rate</p>
            </div>
          </div>

          {/* COP Explanation */}
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>COP Display Logic:</strong> The primary COP shown is based on your system type selection. 
              {systemType === 'heat_pump' 
                ? ' Heat pumps prioritize heating performance (COP Heating = 6.86), with cooling as secondary mode (COP Cooling = 5.86).'
                : ' Cooling systems prioritize cooling performance (COP Cooling = 5.86), with heating capacity available for reference (COP Heating = 6.86).'
              } Both values are calculated from the same thermodynamic cycle.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* State Points Table */}
      <Card>
        <CardHeader>
          <CardTitle>Thermodynamic State Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Point</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Temperature (°C)</TableHead>
                  <TableHead>Pressure (bar)</TableHead>
                  <TableHead>Enthalpy (kJ/kg)</TableHead>
                  <TableHead>Entropy (kJ/kg·K)</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Quality</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {points.map((point, index) => (
                  <TableRow key={point.id}>
                    <TableCell className="font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>{point.name}</TableCell>
                    <TableCell>{formatters.temperature(point.temperature)}</TableCell>
                    <TableCell>{formatters.pressure(point.pressure)}</TableCell>
                    <TableCell>{point.enthalpy ? formatters.enthalpy(point.enthalpy) : '-'}</TableCell>
                    <TableCell>{point.entropy ? formatters.decimal(point.entropy, 3) : '-'}</TableCell>
                    <TableCell>
                      <Badge className={getPhaseColor(point.phase)}>
                        {point.phase || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {point.quality !== undefined ? formatters.percentage(point.quality) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Process Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Process Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">1→2: Compression</h4>
                <div className="space-y-1 text-sm">
                  <p>Process: Isentropic compression (ideal)</p>
                  <p>ΔH: {formatters.enthalpy((points[1].enthalpy || 0) - (points[0].enthalpy || 0))}</p>
                  <p>Work Input: {formatters.power(performance.compressorPower)}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">2→3: Condensation</h4>
                <div className="space-y-1 text-sm">
                  <p>Process: Isobaric heat rejection</p>
                  <p>ΔH: {formatters.enthalpy((points[2].enthalpy || 0) - (points[1].enthalpy || 0))}</p>
                  <p>Heat Rejected: {formatters.power(performance.heatingCapacity)}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">3→4: Expansion</h4>
                <div className="space-y-1 text-sm">
                  <p>Process: Isenthalpic throttling</p>
                  <p>ΔH: {formatters.enthalpy((points[3].enthalpy || 0) - (points[2].enthalpy || 0))}</p>
                  <p>Pressure Drop: {formatters.pressure(points[2].pressure - points[3].pressure)}</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">4→1: Evaporation</h4>
                <div className="space-y-1 text-sm">
                  <p>Process: Isobaric heat absorption</p>
                  <p>ΔH: {formatters.enthalpy((points[0].enthalpy || 0) - (points[3].enthalpy || 0))}</p>
                  <p>Cooling Effect: {formatters.power(performance.coolingCapacity)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
