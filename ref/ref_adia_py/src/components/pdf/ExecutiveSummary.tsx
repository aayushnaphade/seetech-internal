import React from 'react';
import { formatCurrency } from '../../lib/utils/currencyFormatter';
import { COLORS } from '../../lib/constants/seedData';

interface ExecutiveSummaryProps {
  clientName: string;
  clientLocation: string;
  initialPowerKW: number;
  actualPowerKW: number;
  optimizedPowerKW: number;
  electricitySavingsKWh: number;
  electricitySavingsAmount: number;
  waterSavingsLiters: number;
  waterSavingsAmount: number;
  totalAnnualSavings: number;
  paybackPeriod: number;
  co2ReductionKg: number;
}

/**
 * ExecutiveSummary component for the PDF report
 * Displays key financial and environmental benefits of the project
 */
const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  clientName,
  clientLocation,
  initialPowerKW,
  actualPowerKW,
  optimizedPowerKW,
  electricitySavingsKWh,
  electricitySavingsAmount,
  waterSavingsLiters,
  waterSavingsAmount,
  totalAnnualSavings,
  paybackPeriod,
  co2ReductionKg
}) => {
  return (
    <div className="avoid-break a4-section">
      <h2 className="text-2xl font-bold mb-6 text-primary">Executive Summary</h2>
      
      <p className="mb-4">
        This proposal outlines the implementation of an advanced adiabatic cooling solution for {clientName}'s 
        facility at {clientLocation}. Our analysis has identified significant opportunities for 
        energy optimization and cost reduction.
      </p>
      
      <div className="grid grid-cols-2 gap-6 my-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Energy Benefits</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Initial Power Consumption:</span>
              <span className="font-medium">{initialPowerKW.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between">
              <span>Current Power Consumption:</span>
              <span className="font-medium">{actualPowerKW.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between">
              <span>Optimized Power Consumption:</span>
              <span className="font-medium">{optimizedPowerKW.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between text-primary font-semibold">
              <span>Electricity Savings:</span>
              <span>{formatCurrency(electricitySavingsAmount)}/year</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Financial Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Water Savings:</span>
              <span className="font-medium">{formatCurrency(waterSavingsAmount)}/year</span>
            </div>
            <div className="flex justify-between font-semibold text-primary">
              <span>Total Annual Savings:</span>
              <span>{formatCurrency(totalAnnualSavings)}/year</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Payback Period:</span>
              <span>{paybackPeriod.toFixed(1)} years</span>
            </div>
            <div className="flex justify-between">
              <span>CO₂ Reduction:</span>
              <span className="font-medium">{(co2ReductionKg / 1000).toFixed(2)} tons/year</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-6">
        This proposal presents a comprehensive solution that will not only reduce your facility's 
        operational costs but also contribute to your sustainability goals by reducing carbon emissions 
        and conserving water resources.
      </p>
    </div>
  );
};

export default ExecutiveSummary;
