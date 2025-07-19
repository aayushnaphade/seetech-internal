import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import PlotlyChart with no SSR
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

import { formatCurrency } from '../../lib/utils/currencyFormatter';
import { CalculationResults } from '../../lib/calc/businessLogic';

/**
 * Project detail page showing project information and calculation results
 */
export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [project, setProject] = useState<any>(null);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);
  
  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        setError('Failed to fetch project data');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('An error occurred while fetching project data');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateResults = async () => {
    if (!project) return;
    
    setCalculating(true);
    try {
      const res = await fetch('/api/tools/adiabatic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      });
      
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      } else {
        setError('Failed to calculate results');
      }
    } catch (err) {
      console.error('Error calculating results:', err);
      setError('An error occurred while calculating results');
    } finally {
      setCalculating(false);
    }
  };
  
  const generatePDF = () => {
    if (!project) return;
    
    // Open PDF view in a new tab
    window.open(`/pdf/${project.id}`, '_blank');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading project data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link href="/projects" className="text-blue-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Project not found</p>
        <div className="mt-4">
          <Link href="/projects" className="text-blue-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        
        <div>
          <button
            onClick={calculateResults}
            disabled={calculating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-3"
          >
            {calculating ? 'Calculating...' : 'Calculate Results'}
          </button>
          
          <button
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Generate PDF
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Client:</span> {project.constants.clientName}
            </div>
            <div>
              <span className="font-medium">Location:</span> {project.constants.clientLocation}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Specifications</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Chiller Type:</span> {project.constants.chillerType}
            </div>
            <div>
              <span className="font-medium">Capacity:</span> {project.constants.chillerCapacityTR} TR
            </div>
            <div>
              <span className="font-medium">Operating Hours:</span> {project.constants.operatingHours} hours/day
            </div>
            <div>
              <span className="font-medium">Working Days:</span> {project.constants.workingDays} days/year
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Power Consumption</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">OEM Design:</span> {project.constants.initialPowerKW.toFixed(1)} kW
            </div>
            <div>
              <span className="font-medium">Actual:</span> {project.constants.actualPowerKW.toFixed(1)} kW
            </div>
            <div>
              <span className="font-medium">Expected Reduction:</span> {project.constants.expectedPowerReductionPct}%
            </div>
            <div>
              <span className="font-medium">Electricity Tariff:</span> ₹{project.constants.electricityTariff}/kWh
            </div>
          </div>
        </div>
      </div>
      
      {results && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Calculation Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Energy Savings</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Optimized Power:</span>
                  <span className="font-medium">{(project.constants.actualPowerKW * (1 - results.powerSavingPct / 100)).toFixed(1)} kW</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Energy Savings:</span>
                  <span className="font-medium">{results.annualEnergySavingKWh.toFixed(0)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Electricity Cost Savings:</span>
                  <span className="font-medium">{formatCurrency(results.annualMonerarySaving)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CO₂ Emission Reduction:</span>
                  <span className="font-medium">{((results.annualEnergySavingKWh * project.constants.gridEmissionFactor) / 1000).toFixed(2)} tons/year</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Financial Analysis</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Project Cost:</span>
                  <span className="font-medium">{formatCurrency(project.constants.projectCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Water Cost:</span>
                  <span className="font-medium">{formatCurrency(results.annualWaterCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Annual Savings:</span>
                  <span className="font-medium">{formatCurrency(results.netAnnualSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payback Period:</span>
                  <span className="font-medium">{results.roiPeriod.toFixed(1)} years</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Power Consumption Chart */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Power Consumption Comparison</h3>
            <Plot
              data={[
                {
                  x: ['OEM Design', 'Actual', 'Optimized'],
                  y: [
                    project.constants.initialPowerKW,
                    project.constants.actualPowerKW,
                    (project.constants.actualPowerKW * (1 - results.powerSavingPct / 100))
                  ],
                  type: 'bar',
                  marker: { color: ['#3182CE', '#DD6B20', '#38A169'] }
                }
              ]}
              layout={{
                height: 400,
                margin: { l: 50, r: 30, t: 50, b: 80 },
                yaxis: { title: { text: 'Power (kW)' } }
              }}
              config={{ displayModeBar: false }}
              className="w-full"
            />
          </div>
          
          {/* Annual Savings Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Annual Savings Breakdown</h3>
            <Plot
              data={[
                {
                  labels: ['Electricity', 'Water'],
                  values: [
                    results.annualMonerarySaving,
                    results.annualWaterCost
                  ],
                  type: 'pie',
                  marker: {
                    colors: ['#3182CE', '#38A169']
                  }
                }
              ]}
              layout={{
                height: 400,
                margin: { l: 10, r: 10, t: 30, b: 10 }
              }}
              config={{ displayModeBar: false }}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <Link href="/projects" className="text-blue-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
