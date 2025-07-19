import React from 'react';
import { formatCurrency } from '../../lib/utils/currencyFormatter';

interface MaintenanceAndROIProps {
  projectCost: number;
  maintenancePct: number;
  totalAnnualSavings: number;
  paybackPeriod: number;
  roiData: {
    years: number[];
    cumulativeSavings: number[];
    cumulativeCosts: number[];
    netCashFlow: number[];
  };
}

/**
 * MaintenanceAndROI component for the PDF report
 * Displays maintenance requirements and return on investment analysis
 */
const MaintenanceAndROI: React.FC<MaintenanceAndROIProps> = ({
  projectCost,
  maintenancePct,
  totalAnnualSavings,
  paybackPeriod,
  roiData
}) => {
  const annualMaintenanceCost = projectCost * (maintenancePct / 100);

  return (
    <div className="avoid-break a4-section">
      <h2 className="text-2xl font-bold mb-6 text-primary">Maintenance & ROI</h2>
      
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-secondary">Maintenance Requirements</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Project Cost:</span>
                <span className="font-medium">{formatCurrency(projectCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Maintenance:</span>
                <span className="font-medium">{formatCurrency(annualMaintenanceCost)} ({maintenancePct}%)</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-3">Recommended Maintenance Schedule:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Weekly: Visual inspection and cleaning of adiabatic media</li>
                  <li>Monthly: Water quality check and system performance verification</li>
                  <li>Quarterly: Thorough cleaning of water distribution system</li>
                  <li>Bi-annually: Complete system maintenance and replacement of worn components</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-secondary">Return on Investment</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Annual Savings:</span>
                <span className="font-medium">{formatCurrency(totalAnnualSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payback Period:</span>
                <span className="font-medium">{paybackPeriod.toFixed(1)} years</span>
              </div>
              <div className="flex justify-between">
                <span>5-Year ROI:</span>
                <span className="font-medium">
                  {(((totalAnnualSavings * 5) - projectCost) / projectCost * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>10-Year ROI:</span>
                <span className="font-medium">
                  {(((totalAnnualSavings * 10) - projectCost) / projectCost * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Financial Benefits Summary:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Positive cash flow after {Math.ceil(paybackPeriod)} years</li>
              <li>Reduced operating costs from day one</li>
              <li>Extended equipment life provides additional savings</li>
              <li>Improved system reliability reduces unexpected downtime</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-right">Annual Savings</th>
              <th className="p-3 text-right">Maintenance Cost</th>
              <th className="p-3 text-right">Net Cash Flow</th>
              <th className="p-3 text-right">Cumulative Savings</th>
            </tr>
          </thead>
          <tbody>
            {roiData.years.map((year, index) => (
              <tr key={year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 border">{year}</td>
                <td className="p-3 text-right border">{formatCurrency(totalAnnualSavings)}</td>
                <td className="p-3 text-right border">{formatCurrency(annualMaintenanceCost)}</td>
                <td className="p-3 text-right border">{formatCurrency(roiData.netCashFlow[index])}</td>
                <td className="p-3 text-right border">{formatCurrency(roiData.cumulativeSavings[index])}</td>
              </tr>
            )).slice(0, 10)} {/* Limit to first 10 years */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceAndROI;
