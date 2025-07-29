'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Settings, 
  Wrench, 
  Clock,
  Target
} from 'lucide-react';
import { ChillerResults, ChillerInputs } from '../types';

interface ChillerRecommendationsProps {
  results: ChillerResults;
  inputs: ChillerInputs;
}

export function ChillerRecommendations({ results, inputs }: ChillerRecommendationsProps) {
  const getPriorityIcon = (recommendation: string) => {
    if (recommendation.includes('below OEM') || recommendation.includes('High pressure')) {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
    if (recommendation.includes('energy savings') || recommendation.includes('Reduce condenser')) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    if (recommendation.includes('maintenance') || recommendation.includes('efficiency factor')) {
      return <Wrench className="h-4 w-4 text-orange-600" />;
    }
    return <Settings className="h-4 w-4 text-blue-600" />;
  };

  const getPriorityBadge = (recommendation: string) => {
    if (recommendation.includes('below OEM') || recommendation.includes('High pressure')) {
      return <Badge variant="destructive">High Priority</Badge>;
    }
    if (recommendation.includes('energy savings') || recommendation.includes('Reduce condenser')) {
      return <Badge className="bg-green-600">Optimization</Badge>;
    }
    if (recommendation.includes('maintenance') || recommendation.includes('efficiency factor')) {
      return <Badge variant="secondary">Maintenance</Badge>;
    }
    return <Badge variant="outline">Implementation</Badge>;
  };

  const getImplementationTimeframe = (recommendation: string) => {
    if (recommendation.includes('Reduce condenser') || recommendation.includes('variable speed')) {
      return 'Immediate - Short Term';
    }
    if (recommendation.includes('expansion valve') || recommendation.includes('Maintain evaporator')) {
      return 'Short - Medium Term';
    }
    if (recommendation.includes('maintenance') || recommendation.includes('efficiency factor')) {
      return 'Medium - Long Term';
    }
    return 'Ongoing';
  };

  // Calculate potential savings
  const potentialSavings = results.optimized.energySavings;
  const annualSavings = (results.actual.power - results.optimized.power) * 8760 * 0.12; // Assuming $0.12/kWh, 8760 hours/year

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Optimization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {potentialSavings.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Energy Savings Potential</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${annualSavings.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Estimated Annual Savings</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {results.recommendations.length}
              </div>
              <div className="text-sm text-muted-foreground">Action Items</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(recommendation)}
                    <span className="font-medium">Recommendation {index + 1}</span>
                  </div>
                  {getPriorityBadge(recommendation)}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {recommendation}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{getImplementationTimeframe(recommendation)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Immediate Actions */}
            <div>
              <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Immediate Actions (0-1 months)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <div className="font-medium">Condenser Fan Control Optimization</div>
                  <div className="text-muted-foreground">
                    Implement WBT-based condenser approach control to achieve {inputs.ambientWBT + inputs.condApproach}°C condenser temperature
                  </div>
                  <div className="text-green-600 font-medium mt-1">
                    Expected savings: {potentialSavings.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <div className="font-medium">Performance Monitoring Setup</div>
                  <div className="text-muted-foreground">
                    Establish baseline monitoring of key performance indicators (COP, pressures, temperatures)
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Short-term Actions */}
            <div>
              <h4 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Short-term Actions (1-3 months)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                  <div className="font-medium">Expansion Valve Calibration</div>
                  <div className="text-muted-foreground">
                    Optimize superheat control to maintain {inputs.superheat}K superheat consistently
                  </div>
                </div>
                
                {results.degradationZone && (
                  <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                    <div className="font-medium">Performance Degradation Investigation</div>
                    <div className="text-muted-foreground">
                      Address {((results.oem.cop - results.actual.cop) / results.oem.cop * 100).toFixed(1)}% COP degradation through maintenance and system optimization
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Medium-term Actions */}
            <div>
              <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Medium-term Actions (3-6 months)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <div className="font-medium">Variable Speed Drive Installation</div>
                  <div className="text-muted-foreground">
                    Install VFDs on condenser fans for enhanced temperature control and energy savings
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                  <div className="font-medium">System Efficiency Optimization</div>
                  <div className="text-muted-foreground">
                    Address mechanical losses to improve system efficiency factor from {inputs.systemEfficiencyFactor} to target 0.6+
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Long-term Actions */}
            <div>
              <h4 className="font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Long-term Actions (6+ months)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-500">
                  <div className="font-medium">Heat Exchanger Maintenance</div>
                  <div className="text-muted-foreground">
                    Schedule comprehensive cleaning and inspection of evaporator and condenser heat exchangers
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded border-l-4 border-indigo-500">
                  <div className="font-medium">Advanced Control System</div>
                  <div className="text-muted-foreground">
                    Consider implementing advanced control algorithms for optimal part-load operation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Logic Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Business Logic Applied</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• <strong>OEM Baseline:</strong> COP {inputs.oemCOP} from Daikin RWAD900CZ-XS datasheet</li>
                <li>• <strong>System Efficiency Factor:</strong> {inputs.systemEfficiencyFactor} accounts for real-world losses (motor, mechanical, heat)</li>
                <li>• <strong>Optimization Method:</strong> WBT + {inputs.condApproach}K approach temperature control</li>
                <li>• <strong>Thermodynamic Calculations:</strong> CoolProp-based property calculations for {inputs.refrigerant}</li>
                <li>• <strong>Performance Validation:</strong> Sensor-based actual performance vs. manufacturer specifications</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Key Assumptions</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Constant cooling capacity maintained across all scenarios</li>
                <li>• Environmental conditions: {inputs.ambientDBT}°C DBT, {inputs.ambientWBT}°C WBT</li>
                <li>• Compressor isentropic efficiency: {inputs.compressorEfficiency}</li>
                <li>• Operating hours: 8760 hours/year for savings calculations</li>
                <li>• Energy cost: $0.12/kWh (adjust based on local rates)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}