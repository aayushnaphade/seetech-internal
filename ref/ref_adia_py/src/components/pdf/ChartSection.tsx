import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PlotlyChart with no SSR to avoid DOM mismatch issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ChartSectionProps {
  powerConsumptionData: {
    labels: string[];
    oem: number[];
    actual: number[];
    optimized: number[];
  };
  savingsData: {
    labels: string[];
    electricity: number[];
    water: number[];
    total: number[];
  };
}

/**
 * ChartSection component for the PDF report
 * Displays power consumption and savings charts
 */
const ChartSection: React.FC<ChartSectionProps> = ({
  powerConsumptionData,
  savingsData
}) => {
  const powerConsumptionConfig = {
    displayModeBar: false
  };
  
  const powerConsumptionLayout = {
    title: { text: 'Power Consumption Comparison' },
    height: 400,
    margin: { l: 50, r: 30, t: 50, b: 80 },
    legend: {
      orientation: 'h' as 'h',
      y: -0.2
    },
    font: {
      family: 'Arial, sans-serif'
    },
    barmode: 'group' as 'group',
    yaxis: {
      title: { text: 'Power (kW)' }
    }
  };

  const savingsLayout = {
    title: { text: 'Annual Savings Breakdown' },
    height: 400,
    margin: { l: 50, r: 30, t: 50, b: 80 },
    legend: {
      orientation: 'h' as 'h',
      y: -0.2
    },
    font: {
      family: 'Arial, sans-serif'
    },
    barmode: 'stack' as 'stack',
    yaxis: {
      title: { text: 'Savings (₹)' }
    }
  };

  return (
    <div className="avoid-break a4-section">
      <h2 className="text-2xl font-bold mb-6 text-primary">Performance Analysis</h2>
      
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-secondary">Power Consumption Comparison</h3>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <Plot
            data={[
              {
                x: powerConsumptionData.labels,
                y: powerConsumptionData.oem,
                type: 'bar',
                name: 'OEM Design',
                marker: { color: '#3182CE' }
              },
              {
                x: powerConsumptionData.labels,
                y: powerConsumptionData.actual,
                type: 'bar',
                name: 'Actual',
                marker: { color: '#DD6B20' }
              },
              {
                x: powerConsumptionData.labels,
                y: powerConsumptionData.optimized,
                type: 'bar',
                name: 'Optimized',
                marker: { color: '#38A169' }
              }
            ]}
            layout={powerConsumptionLayout}
            config={powerConsumptionConfig}
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-secondary">Annual Savings</h3>
        <div className="bg-white p-2 rounded-lg shadow-md">
          <Plot
            data={[
              {
                x: savingsData.labels,
                y: savingsData.electricity,
                type: 'bar',
                name: 'Electricity Savings',
                marker: { color: '#3182CE' }
              },
              {
                x: savingsData.labels,
                y: savingsData.water,
                type: 'bar',
                name: 'Water Savings',
                marker: { color: '#38A169' }
              }
            ]}
            layout={savingsLayout}
            config={powerConsumptionConfig}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
