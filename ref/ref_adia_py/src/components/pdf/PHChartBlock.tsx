import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PlotlyChart with no SSR to avoid DOM mismatch issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PHChartBlockProps {
  phChartData: {
    pressure: number[];
    enthalpyOEM: number[];
    enthalpyActual: number[];
    enthalpyOptimized: number[];
    points: {
      oem: { x: number[]; y: number[] };
      actual: { x: number[]; y: number[] };
      optimized: { x: number[]; y: number[] };
    };
  };
}

/**
 * PHChartBlock component for the PDF report
 * Displays the pressure-enthalpy chart for refrigeration cycle
 */
const PHChartBlock: React.FC<PHChartBlockProps> = ({
  phChartData
}) => {
  const chartConfig = {
    displayModeBar: false
  };
  
  const chartLayout = {
    title: { text: 'Pressure-Enthalpy Chart' },
    height: 500,
    margin: { l: 50, r: 30, t: 50, b: 80 },
    legend: {
      orientation: 'h' as 'h',
      y: -0.2
    },
    font: {
      family: 'Arial, sans-serif'
    },
    xaxis: {
      title: { text: 'Enthalpy (kJ/kg)' },
      zeroline: false
    },
    yaxis: {
      title: { text: 'Pressure (bar)' },
      type: 'log' as 'log',
      zeroline: false
    }
  };

  return (
    <div className="avoid-break a4-section">
      <h2 className="text-2xl font-bold mb-6 text-primary">Refrigeration Cycle Analysis</h2>
      
      <div className="mb-6">
        <p className="mb-4">
          The pressure-enthalpy (P-h) chart below illustrates the refrigeration cycle under different operating conditions.
          The chart shows how the adiabatic cooling solution optimizes the cycle efficiency by reducing the condenser 
          pressure and temperature.
        </p>
      </div>
      
      <div className="bg-white p-2 rounded-lg shadow-md">
        <Plot
          data={[
            // Refrigerant saturation curve
            {
              x: phChartData.enthalpyOEM,
              y: phChartData.pressure,
              type: 'scatter',
              mode: 'lines',
              name: 'Refrigerant Curve',
              line: { color: '#CBD5E0' }
            },
            // OEM cycle
            {
              x: phChartData.points.oem.x,
              y: phChartData.points.oem.y,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'OEM Design',
              line: { color: '#3182CE' }
            },
            // Actual cycle
            {
              x: phChartData.points.actual.x,
              y: phChartData.points.actual.y,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Actual',
              line: { color: '#DD6B20' }
            },
            // Optimized cycle
            {
              x: phChartData.points.optimized.x,
              y: phChartData.points.optimized.y,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Optimized',
              line: { color: '#38A169' }
            }
          ]}
          layout={chartLayout}
          config={chartConfig}
          className="w-full"
        />
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-center text-gray-600">
          Figure 2: Pressure-Enthalpy Diagram showing the refrigeration cycle under OEM, actual, and optimized conditions.
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-secondary">Key Observations</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>The optimized cycle shows a significant reduction in condenser pressure and temperature.</li>
          <li>Lower condenser pressure reduces compressor work, improving COP.</li>
          <li>The evaporator performance remains constant, ensuring cooling capacity is maintained.</li>
          <li>The optimized cycle results in lower power consumption while delivering the same cooling effect.</li>
        </ul>
      </div>
    </div>
  );
};

export default PHChartBlock;
