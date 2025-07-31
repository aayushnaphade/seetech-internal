import React from 'react';
import { ChillerProposalData, CalculatedMetrics } from '../types';
import { calculateMetrics, formatters } from '../utils/calculations';
import { MetricsTable } from './MetricsTable';

// Standardized color scheme
const colors = {
  primaryBlue: '#09425d',
  secondaryGreen: '#1db56c',
  yellow: '#f7b500',
  red: '#e74c3c',
  blueLight: '#eaf3f7',
  greenLight: '#e6f9f2',
  text: '#18344a',
  textMuted: '#444',
  border: '#e3e8ee',
  white: '#fff',
};

// Typography system
const typography = {
  fontFamily: 'Inter, Arial, sans-serif',
  title: { fontSize: 22, fontWeight: 700, color: colors.primaryBlue, marginBottom: 28, marginTop: 0, textAlign: 'left' as const },
  page: { minHeight: '100vh', background: colors.white, padding: '48px 0 0 0', display: 'block', fontFamily: 'Inter, Arial, sans-serif' },
};

interface ExecutiveSummaryPageProps {
  data: ChillerProposalData;
}

export const ExecutiveSummaryPage: React.FC<ExecutiveSummaryPageProps> = ({ data }) => {
  // Generate dynamic summary text based on input data
  const generateSummaryText = (): JSX.Element => {
    const clientName = data.clientName || 'Ashirwad Pipes';
    
    // Use DBT/WBT if available, otherwise fall back to condenser temps
    const currentTemp = parseFloat(data.ambientDBT || data.currentCondenserTemp || data.condTemp || '47.7');
    const optimizedTemp = parseFloat(data.ambientWBT || data.optimizedCondenserTemp || data.optimizedCondTemp || '36.0');
    const tempReduction = currentTemp - optimizedTemp;
    
    const currentPower = parseFloat(data.currentPowerConsumption) || 210;
    const systemCapacity = data.systemCapacity || '255 TR';
    
    // Determine if we're showing DBT to WBT or condenser temps
    const isDBTWBT = data.ambientDBT && data.ambientWBT;
    const tempDescription = isDBTWBT 
      ? `ambient temperature from ${currentTemp}°C (DBT) to ${optimizedTemp}°C (WBT)` 
      : `condenser temperature by ${tempReduction.toFixed(1)}°C (from ${currentTemp}°C to ${optimizedTemp}°C)`;
    
    return (
      <div style={{ fontSize: 15, color: colors.text, marginBottom: 18, lineHeight: 1.7 }}>
        {clientName}'s <b>{systemCapacity} air-cooled chiller</b> currently operates with an average power consumption of <b>{currentPower} kW</b>. Our analysis using digital twin technology reveals an opportunity to substantially reduce energy consumption through <b>adiabatic cooling</b> technology.<br /><br />
        Our proposal recommends installing an <b>SEE-Tech Adiabatic Cooling System</b> to reduce <span style={{ fontWeight: 700, color: colors.primaryBlue }}>{tempDescription}</span>. This adiabatic cooling process utilizes evaporative cooling to lower the air temperature entering the condenser, effectively reducing the condensing temperature and improving system efficiency. Our digital twin technology has validated these projections through detailed simulation of your specific system, and our <b>IoT-enabled monitoring</b> will ensure continuous optimization and verification of savings.<br /><br />
        The implementation of this system is projected to deliver:
      </div>
    );
  };

  return (
    <div style={{ ...typography.page, paddingTop: 40, paddingLeft: 32, paddingRight: 32 }}>
      <h2 style={{ ...typography.title, fontSize: 20, display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: colors.primaryBlue, fontWeight: 700, fontSize: 20, marginRight: 8 }}>1. Executive Summary</span>
        <span style={{ flex: 1, height: 3, background: colors.primaryBlue, borderRadius: 2, marginLeft: 8, marginTop: 8 }} />
      </h2>
      
      {generateSummaryText()}
      
      <MetricsTable data={data} />
      
      <div style={{ fontSize: 14, color: colors.textMuted, marginTop: 18, lineHeight: 1.6 }}>
        The system's performance has been validated through detailed engineering analysis and digital twin simulation, ensuring accurate projections and minimal risk. SEE-Tech Solutions also offers a comprehensive maintenance package to ensure continued optimal performance.
      </div>
    </div>
  );
};



export default ExecutiveSummaryPage;