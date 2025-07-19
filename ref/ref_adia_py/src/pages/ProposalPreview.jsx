/**
 * Main proposal preview page that recreates the Dash app layout
 */

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.jsx';
import { Footer, MaintenanceSection } from '../components/Footer.jsx';
import { SummaryCardsGrid, DataTable, BenefitsList } from '../components/SummaryCard.jsx';
import { 
  SavingsPieChart, 
  PowerComparisonChart, 
  TemperatureComparisonChart, 
  ROIChart 
} from '../components/ChartCard.jsx';
import { calculateResults, formatIndianNumber } from '../utils/businessLogic.js';
import { COLORS, CLIENT_NAME, CHILLER_CAPACITY_TR } from '../utils/constants.js';

export function ProposalPreview() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate results when component mounts
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setLoading(false);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-lg text-mutedText">Loading proposal...</p>
        </div>
      </div>
    );
  }

  const lccHeaders = [
    'Year',
    'Initial Investment',
    'Annual Savings (Nominal)',
    'Annual O&M Cost (Nominal)',
    'Net Annual Cash Flow (Nominal)',
    'Net Annual Cash Flow (Discounted)',
    'Cumulative Discounted Cash Flow'
  ];

  const benefits = [
    "Up to 25% reduction in energy consumption",
    "Significant reduction in carbon footprint",
    "Improved system reliability and lifespan",
    "Automated monitoring and control",
    "Professional maintenance and support",
    "Quick return on investment"
  ];

  const technicalBenefits = [
    "Reduced condenser temperature by 10°C",
    "Improved system COP (Coefficient of Performance)",
    "Lower compressor discharge temperatures",
    "Enhanced heat transfer efficiency",
    "Reduced mechanical stress on components",
    "Optimized refrigerant cycle performance"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="a4-page-container">
        {/* Header Section */}
        <Header onPrint={handlePrint} />

        {/* Executive Summary */}
        <div className="document-section">
          <h2 className="section-header text-2xl font-bold mb-6">
            1. Executive Summary
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-card mb-6">
            <p className="text-text leading-relaxed mb-4">
              This proposal presents a comprehensive adiabatic cooling solution for your {CHILLER_CAPACITY_TR} TR 
              air-cooled chiller system. Our advanced engineering approach combines cutting-edge technology 
              with proven performance to deliver substantial energy savings and operational benefits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Key Benefits</h4>
                <BenefitsList benefits={benefits} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary mb-3">Technical Advantages</h4>
                <BenefitsList benefits={technicalBenefits} />
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="document-section">
          <h2 className="section-header text-2xl font-bold mb-6">
            2. Key Performance Indicators
          </h2>
          <SummaryCardsGrid data={results.summaryData} />
        </div>

        {/* Financial Analysis */}
        <div className="document-section">
          <h2 className="section-header text-2xl font-bold mb-6">
            3. Financial Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SavingsPieChart 
              annualMonetarySaving={results.annualMonetarySaving}
              annualWaterCost={results.annualWaterCost}
              annualMaintenanceCost={results.annualMaintenanceCost}
              netAnnualSavings={results.netAnnualSavings}
            />
            <ROIChart lccTable={results.lccTable} />
          </div>

          {/* Financial Summary Table */}
          <div className="bg-white rounded-lg p-6 shadow-card mb-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Financial Summary (First Year)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-text font-medium">Annual Energy Savings:</span>
                    <span className="text-accent font-semibold">
                      {formatIndianNumber(results.annualMonetarySaving)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-text font-medium">Annual Water Cost:</span>
                    <span className="text-warning font-semibold">
                      {formatIndianNumber(results.annualWaterCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-text font-medium">Annual Maintenance:</span>
                    <span className="text-warning font-semibold">
                      {formatIndianNumber(results.annualMaintenanceCost)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-text font-medium">Net Annual Savings:</span>
                    <span className="text-accent font-semibold text-lg">
                      {formatIndianNumber(results.netAnnualSavings)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-text font-medium">Simple Payback Period:</span>
                    <span className="text-secondary font-semibold">
                      {Math.floor(results.roiPeriod / 12)}y {results.roiPeriod % 12}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-text font-medium">Net Present Value:</span>
                    <span className="text-accent font-semibold text-lg">
                      {formatIndianNumber(results.npv)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Performance */}
        <div className="document-section">
          <h2 className="section-header text-2xl font-bold mb-6">
            4. Technical Performance Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PowerComparisonChart 
              powerSavingPct={results.powerSavingPct}
              initialPowerKw={203.8}
            />
            <TemperatureComparisonChart />
          </div>

          {/* Technical Summary */}
          <div className="bg-white rounded-lg p-6 shadow-card mb-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Technical Performance Summary
            </h3>
            <SummaryCardsGrid data={results.environmentalData} />
          </div>
        </div>

        {/* Life Cycle Cost Analysis */}
        <div className="document-section">
          <h2 className="section-header text-2xl font-bold mb-6">
            5. Life Cycle Cost Analysis (15 Years)
          </h2>
          
          <DataTable 
            data={results.lccTable}
            headers={lccHeaders}
            title="Detailed Cash Flow Analysis"
          />
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mt-6">
            <h4 className="text-lg font-semibold text-primary mb-3">
              <i className="fas fa-chart-line mr-2"></i>
              LCC Analysis Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-mutedText">Total Investment</p>
                <p className="text-lg font-bold text-primary">
                  {formatIndianNumber(2030000)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-mutedText">15-Year NPV</p>
                <p className="text-lg font-bold text-accent">
                  {formatIndianNumber(results.npv)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-mutedText">IRR</p>
                <p className="text-lg font-bold text-secondary">
                  {((results.netAnnualSavings / 2030000) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="document-section">
          <h2 className="section-header text-2xl font-bold mb-6">
            6. Environmental Impact & Sustainability
          </h2>
          
          <div className="bg-white rounded-lg p-6 shadow-card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-primary mb-4">
                  <i className="fas fa-leaf mr-2"></i>
                  Carbon Footprint Reduction
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-arrow-down text-accent mr-3"></i>
                    <span className="text-text">
                      <strong>{results.annualGhgSavingTonnes.toFixed(1)} tonnes</strong> CO₂ reduction annually
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-tree text-accent mr-3"></i>
                    <span className="text-text">
                      Equivalent to planting <strong>{Math.round(results.annualGhgSavingTonnes * 45)}</strong> trees
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-car text-accent mr-3"></i>
                    <span className="text-text">
                      Equivalent to removing <strong>{Math.round(results.annualGhgSavingTonnes / 4.6)}</strong> cars from roads
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary mb-4">
                  <i className="fas fa-recycle mr-2"></i>
                  Resource Efficiency
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-bolt text-secondary mr-3"></i>
                    <span className="text-text">
                      <strong>{(results.annualEnergySavingKwh / 1000).toFixed(0)} MWh</strong> energy saved annually
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-tint text-secondary mr-3"></i>
                    <span className="text-text">
                      <strong>{results.annualWaterConsumption.toFixed(0)} m³</strong> water consumption for cooling
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-thermometer-half text-secondary mr-3"></i>
                    <span className="text-text">
                      <strong>10°C</strong> condenser temperature reduction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance and Conclusion */}
        <MaintenanceSection 
          powerSavingPct={results.powerSavingPct}
          annualMonetarySaving={results.annualMonetarySaving}
          roiPeriod={results.roiPeriod}
          annualGhgSavingTonnes={results.annualGhgSavingTonnes}
          clientName={CLIENT_NAME}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}