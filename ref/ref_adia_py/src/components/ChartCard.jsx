/**
 * Chart components for the adiabatic cooling proposal.
 * React version using react-plotly.js
 */

import React from 'react';
import Plot from 'react-plotly.js';
import { COLORS } from '../utils/constants.js';

/**
 * Create savings breakdown pie chart
 */
export function SavingsPieChart({ annualMonetarySaving, annualWaterCost, annualMaintenanceCost, netAnnualSavings }) {
  const labels = ['Electricity Savings', 'Water Costs', 'Maintenance Costs', 'Net Savings'];
  const values = [annualMonetarySaving, annualWaterCost, annualMaintenanceCost, netAnnualSavings];
  const colors = [COLORS.accent, COLORS.warning, COLORS.warning, COLORS.secondary];
  
  const data = [{
    type: 'pie',
    labels: labels,
    values: values.map(v => Math.abs(v)),
    hole: 0.4,
    marker: {
      colors: colors,
      line: {
        color: '#333',
        width: 1
      }
    },
    textinfo: 'label+percent',
    textposition: 'outside',
    pull: [0, 0, 0, 0.1]
  }];
  
  const layout = {
    title: {
      text: 'Annual Financial Impact Breakdown',
      font: {
        size: 18,
        family: 'Arial, sans-serif'
      }
    },
    height: 400,
    margin: { l: 50, r: 50, t: 50, b: 50 },
    showlegend: false,
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };
  
  return (
    <div className="chart-container">
      <Plot
        data={data}
        layout={layout}
        config={{
          displayModeBar: false,
          staticPlot: false,
          responsive: true
        }}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}

/**
 * Create power consumption comparison chart
 */
export function PowerComparisonChart({ powerSavingPct, initialPowerKw }) {
  const beforeKw = initialPowerKw;
  const afterKw = initialPowerKw * (1 - powerSavingPct / 100);
  const savingKw = beforeKw - afterKw;
  
  const data = [{
    type: 'bar',
    x: ['Before Adiabatic Cooling', 'After Adiabatic Cooling', 'Power Savings'],
    y: [beforeKw, afterKw, savingKw],
    text: [`${beforeKw.toFixed(1)} kW`, `${afterKw.toFixed(1)} kW`, `${savingKw.toFixed(1)} kW`],
    textposition: 'auto',
    marker: {
      color: [COLORS.warning, COLORS.accent, COLORS.secondary],
      line: {
        width: 1,
        color: '#333'
      },
      opacity: 0.9
    },
    width: [0.65, 0.65, 0.65],
    name: 'Power Consumption'
  }];
  
  const layout = {
    title: {
      text: 'Power Consumption Comparison With Adiabatic Cooling',
      font: {
        size: 18,
        family: 'Arial, sans-serif'
      },
      y: 0.95
    },
    yaxis: {
      title: {
        text: 'Power Consumption (kW)',
        font: { size: 14 }
      }
    },
    height: 400,
    margin: { l: 50, r: 50, t: 70, b: 50 },
    xaxis: {
      categoryorder: 'array',
      categoryarray: ['Before Adiabatic Cooling', 'After Adiabatic Cooling', 'Power Savings'],
      tickfont: { size: 12 }
    },
    showlegend: false,
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    shapes: [{
      type: 'line',
      line: {
        dash: 'dot',
        color: COLORS.warning,
        width: 2
      },
      x0: -0.5,
      y0: beforeKw,
      x1: 1.5,
      y1: beforeKw
    }],
    annotations: [{
      x: 0.5,
      y: (beforeKw + afterKw) / 2,
      text: `${powerSavingPct.toFixed(1)}% Reduction`,
      font: {
        size: 14,
        color: '#333',
        family: 'Arial, sans-serif'
      },
      showarrow: true,
      arrowhead: 2,
      arrowcolor: COLORS.secondary,
      arrowsize: 1.5,
      arrowwidth: 2,
      bgcolor: 'rgba(255, 255, 255, 0.8)',
      bordercolor: '#333',
      borderwidth: 1,
      borderpad: 4,
      opacity: 0.9
    }]
  };
  
  return (
    <div className="chart-container">
      <Plot
        data={data}
        layout={layout}
        config={{
          displayModeBar: false,
          staticPlot: false,
          responsive: true
        }}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}

/**
 * Create temperature comparison chart
 */
export function TemperatureComparisonChart() {
  const data = [{
    type: 'bar',
    x: ['Current Temperature', 'Optimized Temperature', 'Temperature Reduction'],
    y: [45, 35, 10], // Celsius values
    text: ['45°C', '35°C', '10°C'],
    textposition: 'auto',
    marker: {
      color: [COLORS.warning, COLORS.accent, COLORS.secondary],
      line: {
        width: 1,
        color: '#333'
      },
      opacity: 0.9
    },
    width: [0.6, 0.6, 0.6],
    name: 'Temperature'
  }];
  
  const layout = {
    title: {
      text: 'Condenser Temperature Comparison',
      font: {
        size: 18,
        family: 'Arial, sans-serif'
      }
    },
    yaxis: {
      title: {
        text: 'Temperature (°C)',
        font: { size: 14 }
      }
    },
    height: 400,
    margin: { l: 50, r: 50, t: 70, b: 50 },
    showlegend: false,
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };
  
  return (
    <div className="chart-container">
      <Plot
        data={data}
        layout={layout}
        config={{
          displayModeBar: false,
          staticPlot: false,
          responsive: true
        }}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}

/**
 * Create ROI chart from LCC table
 */
export function ROIChart({ lccTable }) {
  const years = lccTable.map(item => item.year);
  const cumulativeCashFlow = lccTable.map(item => item.cumulativeDiscountedCashFlow);
  
  const data = [{
    type: 'scatter',
    mode: 'lines+markers',
    x: years,
    y: cumulativeCashFlow,
    name: 'Cumulative Cash Flow',
    line: {
      color: COLORS.secondary,
      width: 3
    },
    marker: {
      color: COLORS.accent,
      size: 8
    }
  }];
  
  const layout = {
    title: {
      text: 'Return on Investment Over Time',
      font: {
        size: 18,
        family: 'Arial, sans-serif'
      }
    },
    xaxis: {
      title: {
        text: 'Years',
        font: { size: 14 }
      }
    },
    yaxis: {
      title: {
        text: 'Cumulative Cash Flow (INR)',
        font: { size: 14 }
      },
      tickformat: '.0f'
    },
    height: 400,
    margin: { l: 80, r: 50, t: 70, b: 50 },
    showlegend: false,
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    shapes: [{
      type: 'line',
      line: {
        dash: 'dot',
        color: '#666',
        width: 1
      },
      x0: 0,
      y0: 0,
      x1: Math.max(...years),
      y1: 0
    }]
  };
  
  return (
    <div className="chart-container">
      <Plot
        data={data}
        layout={layout}
        config={{
          displayModeBar: false,
          staticPlot: false,
          responsive: true
        }}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
}