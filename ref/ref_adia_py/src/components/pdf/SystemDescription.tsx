import React from 'react';

interface SystemDescriptionProps {
  chillerType: string;
  chillerCapacityTR: number;
  operatingHours: number;
  workingDays: number;
  tempReductionC: number;
  copOem: number;
  copActual: number;
  copOptimized: number;
  diagramUrl: string;
}

/**
 * SystemDescription component for the PDF report
 * Describes the chiller system and adiabatic cooling solution
 */
const SystemDescription: React.FC<SystemDescriptionProps> = ({
  chillerType,
  chillerCapacityTR,
  operatingHours,
  workingDays,
  tempReductionC,
  copOem,
  copActual,
  copOptimized,
  diagramUrl
}) => {
  return (
    <div className="avoid-break a4-section">
      <h2 className="text-2xl font-bold mb-6 text-primary">System Description</h2>
      
      <div className="grid grid-cols-2 gap-x-12">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-secondary">Current System</h3>
          <p className="mb-4">
            The facility currently operates a {chillerCapacityTR} TR {chillerType} chiller system, 
            running for {operatingHours} hours per day, {workingDays} days per year.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Current System Specifications:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Chiller Type: {chillerType}</li>
              <li>Capacity: {chillerCapacityTR} TR</li>
              <li>OEM COP: {copOem.toFixed(2)}</li>
              <li>Actual COP: {copActual.toFixed(2)}</li>
              <li>Operating Hours: {operatingHours} hours/day</li>
              <li>Working Days: {workingDays} days/year</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-secondary">Proposed Solution</h3>
          <p className="mb-4">
            Our proposed adiabatic cooling solution will reduce the condenser inlet temperature 
            by approximately {tempReductionC.toFixed(1)}°C, significantly improving system efficiency.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2">Solution Benefits:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Temperature Reduction: {tempReductionC.toFixed(1)}°C</li>
              <li>Optimized COP: {copOptimized.toFixed(2)}</li>
              <li>COP Improvement: {((copOptimized - copActual) / copActual * 100).toFixed(1)}%</li>
              <li>Reduced Strain on Equipment</li>
              <li>Extended Equipment Life</li>
              <li>Lower Maintenance Costs</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-secondary">System Diagram</h3>
        <div className="flex justify-center">
          <img 
            src={diagramUrl} 
            alt="Refrigeration Cycle Diagram" 
            className="max-w-full h-auto border rounded-lg" 
          />
        </div>
        <p className="mt-4 text-sm text-center text-gray-600">
          Figure 1: Refrigeration Cycle with Adiabatic Cooling System
        </p>
      </div>
    </div>
  );
};

export default SystemDescription;
