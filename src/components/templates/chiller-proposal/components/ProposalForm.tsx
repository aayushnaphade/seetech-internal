import React, { useState } from 'react';
import { ChillerProposalData } from '../types';

interface ProposalFormProps {
  initialData?: Partial<ChillerProposalData>;
  onDataChange: (data: ChillerProposalData) => void;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({ 
  initialData = {}, 
  onDataChange 
}) => {
  const [formData, setFormData] = useState<ChillerProposalData>({
    // Project Information
    projectName: initialData.projectName || 'High-Efficiency Chiller Optimization Project',
    proposalNumber: initialData.proposalNumber || 'SEE-001-2025',
    date: initialData.date || new Date().toLocaleDateString('en-GB'),
    
    // Client Information
    clientName: initialData.clientName || 'Ashirwad Pipes',
    location: initialData.location || 'Mumbai, Maharashtra',
    contactPerson: initialData.contactPerson || 'Mr. Rajesh Kumar',
    contactEmail: initialData.contactEmail || 'rajesh@ashirwadpipes.com',
    contactPhone: initialData.contactPhone || '+91 98765 43210',
    
    // System Specifications
    systemCapacity: initialData.systemCapacity || '255 TR',
    currentEfficiency: initialData.currentEfficiency || '3.2',
    proposedEfficiency: initialData.proposedEfficiency || '2.8',
    expectedSaving: initialData.expectedSaving || '20',
    
    // Financial Details
    investmentCost: initialData.investmentCost || '1150000',
    paybackPeriod: initialData.paybackPeriod || '7 months',
    roi: initialData.roi || '35',
    
    // System Details
    operatingHours: initialData.operatingHours || '7680',
    currentPowerConsumption: initialData.currentPowerConsumption || '210',
    proposedPowerConsumption: initialData.proposedPowerConsumption || '168',
    
    // P-H Chart Parameters
    refrigerant: initialData.refrigerant || 'R134a',
    evapPressure: initialData.evapPressure || '3.2',
    condPressure: initialData.condPressure || '12.0',
    evapTemp: initialData.evapTemp || '7',
    condTemp: initialData.condTemp || '47.7',
    superheat: initialData.superheat || '8.6',
    subcooling: initialData.subcooling || '5.0',
    ambientTemp: initialData.ambientTemp || '35',
    optimizedCondTemp: initialData.optimizedCondTemp || '36.0',
    compressorEfficiency: initialData.compressorEfficiency || '0.85',
    
    // Adiabatic Cooling Parameters
    ambientDBT: initialData.ambientDBT || '42',
    ambientWBT: initialData.ambientWBT || '32',
    currentCondenserTemp: initialData.currentCondenserTemp || '47.7',
    optimizedCondenserTemp: initialData.optimizedCondenserTemp || '36.0',
  });

  const handleInputChange = (field: keyof ChillerProposalData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onDataChange(updatedData);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e3e8ee',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Inter, Arial, sans-serif',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#18344a',
  };

  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #e3e8ee',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#09425d',
    marginBottom: '12px',
    marginTop: 0,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#09425d', marginBottom: '24px' }}>
        Chiller Proposal Configuration
      </h2>

      {/* Project Information */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Project Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Project Name</label>
            <input
              type="text"
              style={inputStyle}
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Client Name</label>
            <input
              type="text"
              style={inputStyle}
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* System Specifications */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>System Specifications</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>System Capacity</label>
            <input
              type="text"
              style={inputStyle}
              value={formData.systemCapacity}
              onChange={(e) => handleInputChange('systemCapacity', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Current Power (kW)</label>
            <input
              type="number"
              style={inputStyle}
              value={formData.currentPowerConsumption}
              onChange={(e) => handleInputChange('currentPowerConsumption', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Proposed Power (kW)</label>
            <input
              type="number"
              style={inputStyle}
              value={formData.proposedPowerConsumption}
              onChange={(e) => handleInputChange('proposedPowerConsumption', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Financial Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Investment Cost (₹)</label>
            <input
              type="number"
              style={inputStyle}
              value={formData.investmentCost}
              onChange={(e) => handleInputChange('investmentCost', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Operating Hours/Year</label>
            <input
              type="number"
              style={inputStyle}
              value={formData.operatingHours}
              onChange={(e) => handleInputChange('operatingHours', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Adiabatic Cooling Parameters */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Adiabatic Cooling Parameters</h3>
        <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
          Configure the ambient air conditions for adiabatic cooling analysis (DBT → WBT)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Ambient DBT (Dry Bulb Temperature) °C</label>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={formData.ambientDBT}
              onChange={(e) => handleInputChange('ambientDBT', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Ambient WBT (Wet Bulb Temperature) °C</label>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={formData.ambientWBT}
              onChange={(e) => handleInputChange('ambientWBT', e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Current Condenser Inlet Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={formData.currentCondenserTemp}
              onChange={(e) => handleInputChange('currentCondenserTemp', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Optimized Condenser Inlet Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={formData.optimizedCondenserTemp}
              onChange={(e) => handleInputChange('optimizedCondenserTemp', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Additional Temperature Parameters */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Additional Temperature Parameters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Evaporator Temp (°C)</label>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={formData.evapTemp}
              onChange={(e) => handleInputChange('evapTemp', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Ambient Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              style={inputStyle}
              value={formData.ambientTemp}
              onChange={(e) => handleInputChange('ambientTemp', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Refrigerant</label>
            <input
              type="text"
              style={inputStyle}
              value={formData.refrigerant}
              onChange={(e) => handleInputChange('refrigerant', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ 
        padding: '16px', 
        backgroundColor: '#e6f9f2', 
        borderRadius: '8px', 
        fontSize: '14px', 
        color: '#059669' 
      }}>
        <strong>✅ Form Connected:</strong> Changes to these values will automatically update the Executive Summary and Metrics Table in real-time.
      </div>
    </div>
  );
};

export default ProposalForm;