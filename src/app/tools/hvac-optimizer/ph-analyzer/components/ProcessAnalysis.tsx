// Process Analysis Component - Enhanced cycle analysis display

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Thermometer, 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Droplets,
  Zap
} from 'lucide-react';
import { CycleResults } from '../types';
import { formatters } from '../calculations';

interface ProcessAnalysisProps {
  results: CycleResults;
  refrigerant: string;
}

export function ProcessAnalysis({ results, refrigerant }: ProcessAnalysisProps) {
  const { processAnalysis, performance } = results;

  return (
    <div className="space-y-6">
      {/* Process Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Thermodynamic Process Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Compression Process */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <h4 className="font-semibold">1 → 2: Compression ({processAnalysis.compression.process})</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Work Input</p>
                <p className="font-medium">{formatters.enthalpy(processAnalysis.compression.workInput)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Temperature Rise</p>
                <p className="font-medium">{formatters.temperature(processAnalysis.compression.temperatureRise).replace('°C', 'K')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pressure Ratio</p>
                <p className="font-medium">{formatters.efficiency(processAnalysis.compression.pressureRatio)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Condensation Process */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              <h4 className="font-semibold">2 → 3: Condensation ({processAnalysis.condensation.process})</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Heat Rejected</p>
                <p className="font-medium">{formatters.enthalpy(processAnalysis.condensation.heatRejected)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Subcooling</p>
                <p className="font-medium">{formatters.temperature(processAnalysis.condensation.subcooling).replace('°C', 'K')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Approach Temp</p>
                <p className="font-medium">{formatters.temperature(processAnalysis.condensation.approach).replace('°C', 'K')}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Expansion Process */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-orange-500" />
              <h4 className="font-semibold">3 → 4: Expansion ({processAnalysis.expansion.process})</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pressure Drop</p>
                <p className="font-medium">{formatters.pressure(processAnalysis.expansion.pressureDrop)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Quality After</p>
                <p className="font-medium">{formatters.percentage(processAnalysis.expansion.qualityAfter)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Process Type</p>
                <p className="font-medium">Throttling Valve</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Evaporation Process */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-cyan-500" />
              <h4 className="font-semibold">4 → 1: Evaporation ({processAnalysis.evaporation.process})</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cooling Effect</p>
                <p className="font-medium">{formatters.enthalpy(processAnalysis.evaporation.coolingEffect)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Superheating</p>
                <p className="font-medium">{formatters.temperature(processAnalysis.evaporation.superheating).replace('°C', 'K')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Approach Temp</p>
                <p className="font-medium">{formatters.temperature(processAnalysis.evaporation.approach).replace('°C', 'K')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Enhanced Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pressure Ratio</p>
              <p className="text-lg font-semibold">{formatters.efficiency(performance.pressureRatio)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">SEER</p>
              <p className="text-lg font-semibold">{formatters.efficiency(performance.seer)} BTU/Wh</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Volumetric Flow</p>
              <p className="text-lg font-semibold">{formatters.flowRate(performance.volumetricFlowRate)} m³/s</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Compressor Displacement</p>
              <p className="text-lg font-semibold">{formatters.flowRate(performance.compressorDisplacement)} m³/s</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Refrigerant Charge</p>
              <p className="text-lg font-semibold">{formatters.decimal(performance.refrigerantCharge, 1)} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Isentropic Efficiency</p>
              <p className="text-lg font-semibold">{formatters.percentage(performance.isentropicEfficiency)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Volumetric Efficiency</p>
              <p className="text-lg font-semibold">{formatters.percentage(performance.volumetricEfficiency)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Refrigerant</p>
              <p className="text-lg font-semibold text-blue-600">{refrigerant}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Good Performance Indicators</h4>
              <ul className="space-y-1 text-sm">
                {performance.cop_cooling > 3.5 && <li>• Excellent COP for cooling applications</li>}
                {performance.pressureRatio < 4 && <li>• Low pressure ratio reduces compressor stress</li>}
                {performance.isentropicEfficiency > 0.8 && <li>• Good compressor efficiency</li>}
                {processAnalysis.evaporation.superheating >= 5 && processAnalysis.evaporation.superheating <= 10 && 
                  <li>• Optimal superheating for compressor protection</li>}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-amber-600">Improvement Opportunities</h4>
              <ul className="space-y-1 text-sm">
                {performance.cop_cooling < 3 && <li>• Consider optimizing cycle temperatures</li>}
                {performance.pressureRatio > 5 && <li>• High pressure ratio - consider two-stage compression</li>}
                {processAnalysis.condensation.approach > 10 && <li>• Large condenser approach - improve heat transfer</li>}
                {processAnalysis.evaporation.approach > 8 && <li>• Large evaporator approach - optimize sizing</li>}
                {processAnalysis.evaporation.superheating > 15 && <li>• Excessive superheating reduces capacity</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
