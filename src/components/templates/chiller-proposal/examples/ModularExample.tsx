import React, { useState } from 'react';
import { ChillerProposalData } from '../types';
import ExecutiveSummaryPage from '../components/ExecutiveSummaryPage';
import { MetricsTable } from '../components/MetricsTable';
import ProposalForm from '../components/ProposalForm';

// Sample initial data
const initialData: ChillerProposalData = {
  // Project Information
  projectName: 'High-Efficiency Chiller Optimization Project',
  proposalNumber: 'SEE-001-2025',
  date: '15/1/2025',
  
  // Client Information
  clientName: 'Ashirwad Pipes',
  location: 'Mumbai, Maharashtra',
  contactPerson: 'Mr. Rajesh Kumar',
  contactEmail: 'rajesh@ashirwadpipes.com',
  contactPhone: '+91 98765 43210',
  
  // System Specifications
  systemCapacity: '255 TR',
  currentEfficiency: '3.2',
  proposedEfficiency: '2.8',
  expectedSaving: '20',
  
  // Financial Details
  investmentCost: '1150000',
  paybackPeriod: '7 months',
  roi: '35',
  
  // System Details
  operatingHours: '7680',
  currentPowerConsumption: '210',
  proposedPowerConsumption: '168',
  
  // P-H Chart Parameters
  refrigerant: 'R134a',
  evapPressure: '3.2',
  condPressure: '12.0',
  evapTemp: '7',
  condTemp: '47.7',
  superheat: '8.6',
  subcooling: '5.0',
  ambientTemp: '35',
  optimizedCondTemp: '36.0',
  compressorEfficiency: '0.85',
};

/**
 * 🎯 Modular Chiller Proposal Example
 * 
 * This example demonstrates how the Executive Summary and Metrics Table
 * components are now modular and connected to input form data.
 * 
 * Features:
 * - Real-time updates when form data changes
 * - Reusable MetricsTable component
 * - Dynamic calculations based on input
 * - Modular ExecutiveSummaryPage component
 */
export const ModularChillerProposalExample: React.FC = () => {
  const [proposalData, setProposalData] = useState<ChillerProposalData>(initialData);
  const [activeTab, setActiveTab] = useState<'form' | 'summary' | 'metrics'>('form');

  const handleDataChange = (newData: ChillerProposalData) => {
    setProposalData(newData);
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '12px 24px',
    backgroundColor: isActive ? '#09425d' : '#f8fafc',
    color: isActive ? '#fff' : '#09425d',
    border: '1px solid #e3e8ee',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    marginRight: '4px',
  });

  const contentStyle = {
    border: '1px solid #e3e8ee',
    borderRadius: '0 8px 8px 8px',
    padding: '24px',
    backgroundColor: '#fff',
    minHeight: '600px',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#09425d', marginBottom: '8px' }}>
          🔧 Modular Chiller Proposal Components
        </h1>
        <p style={{ fontSize: '16px', color: '#444', marginBottom: '20px' }}>
          Interactive example showing how Executive Summary and Metrics Table connect to form input data.
        </p>
        
        {/* Tab Navigation */}
        <div style={{ display: 'flex', marginBottom: '0' }}>
          <button
            style={tabStyle(activeTab === 'form')}
            onClick={() => setActiveTab('form')}
          >
            📝 Input Form
          </button>
          <button
            style={tabStyle(activeTab === 'summary')}
            onClick={() => setActiveTab('summary')}
          >
            📊 Executive Summary
          </button>
          <button
            style={tabStyle(activeTab === 'metrics')}
            onClick={() => setActiveTab('metrics')}
          >
            📈 Metrics Table Only
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={contentStyle}>
        {activeTab === 'form' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#09425d', marginBottom: '16px' }}>
              Configuration Form
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Modify the values below to see real-time updates in the Executive Summary and Metrics Table.
            </p>
            <ProposalForm 
              initialData={proposalData}
              onDataChange={handleDataChange}
            />
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#09425d', marginBottom: '16px' }}>
              Complete Executive Summary Page
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              This shows the full Executive Summary component with dynamic content based on form data.
            </p>
            <div style={{ border: '1px solid #e3e8ee', borderRadius: '8px', overflow: 'hidden' }}>
              <ExecutiveSummaryPage data={proposalData} />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#09425d', marginBottom: '16px' }}>
              Standalone Metrics Table
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              This shows just the MetricsTable component, which can be reused anywhere in the application.
            </p>
            
            {/* Example of custom metrics */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#09425d', marginBottom: '12px' }}>
                Auto-Generated from Form Data:
              </h3>
              <MetricsTable data={proposalData} title="System Performance Metrics" />
            </div>

            {/* Example of custom metrics */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#09425d', marginBottom: '12px' }}>
                Custom Metrics Example:
              </h3>
              <MetricsTable 
                metrics={[
                  { label: 'Custom Metric 1', value: '100%', highlight: true },
                  { label: 'Custom Metric 2', value: '₹50,000' },
                  { label: 'Custom Metric 3', value: '85 kW', highlight: true },
                ]}
                title="Custom Performance Indicators"
              />
            </div>
          </div>
        )}
      </div>

      {/* Real-time Data Display */}
      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0369a1', marginBottom: '8px' }}>
          🔄 Current Data State:
        </h3>
        <div style={{ fontSize: '12px', color: '#0369a1', fontFamily: 'monospace' }}>
          Project: {proposalData.projectName} | 
          Client: {proposalData.clientName} | 
          Capacity: {proposalData.systemCapacity} | 
          Current Power: {proposalData.currentPowerConsumption}kW | 
          Proposed Power: {proposalData.proposedPowerConsumption}kW
        </div>
      </div>
    </div>
  );
};

export default ModularChillerProposalExample;