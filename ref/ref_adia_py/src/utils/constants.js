/**
 * Constants and configuration data for the adiabatic cooling proposal system.
 * React version - converted from Python constants
 */

// Project Parameters
export const CLIENT_NAME = "SeeTech";
export const CLIENT_LOCATION = "Plot 26, Attibele";
export const REPORT_DATE = "July 1, 2025";
export const PREPARED_BY = "System Generated";

// Chiller specifications
export const CHILLER_CAPACITY_TR = 255.0;
export const CHILLER_TYPE = "Air-Cooled";
export const WORKING_DAYS = 320;
export const OPERATING_HOURS = 24;
export const INITIAL_POWER_KW = 203.8;
export const ACTUAL_POWER_KW = 210.0;
export const EXPECTED_POWER_REDUCTION_PCT = 20.0;
export const ELECTRICITY_TARIFF = 6.5;
export const WATER_COST = 45.0;
export const TOTAL_CFM = 160000;
export const WATER_CONSUMPTION = 4.0;
export const TDS_RECOMMENDATION = 200;

// Financial parameters
export const INFLATION_RATE = 4.0;
export const DISCOUNT_RATE = 8.0;
export const PROJECT_LIFE = 15;
export const PROJECT_COST = 2030000.0;

// Visual styling - Enhanced Modern Professional Palette
export const COLORS = {
  primary: '#0A435C',
  secondary: '#1D7AA3',
  accent: '#2E936E',
  warning: '#B23A48',
  neutral: '#F8FAFC',
  text: '#2D3B45',
  lightAccent: '#7CDBD5',
  border: '#D9E2EC',
  highlight: '#F68D60',
  gradientStart: '#0A435C',
  gradientEnd: '#1D7AA3',
  accentGradientStart: '#2E936E',
  accentGradientEnd: '#7CDBD5',
  cardBg: '#FFFFFF',
  cardShadow: '0 2px 4px rgba(10, 67, 92, 0.1)',
  mutedText: '#64748B',
  tableHeader: '#0A435C',
  tableOdd: '#F8FAFC',
  tableEven: '#EDF2F7',
  
  // PDF and print-friendly alternatives
  pdfFriendly: {
    cardBorder: '1px solid rgba(10, 67, 92, 0.2)',
    cardBorderAccent: '1px solid rgba(46, 147, 110, 0.3)',
    lightShadow: '0 1px 2px rgba(10, 67, 92, 0.08)',
    mediumShadow: '0 2px 3px rgba(10, 67, 92, 0.1)',
  },
};

// Thermodynamic constants (simplified - these would normally come from CoolProp calculations)
export const THERMODYNAMIC_DATA = {
  // Condenser temperatures (in Kelvin, converted from Python values)
  Tcond_act: 318.15,      // 45°C
  Tcond_practical: 308.15, // 35°C
  
  // COP values (simplified)
  COP_act_calc: 3.2,
  COP_practical: 4.0,
  
  // Power savings calculations
  power_saved_pct_vs_oem_act: 20.0,
  power_saved_pct_operating_to_practical: 25.0,
};

// Adiabatic cooling system parameters
export const TEMP_REDUCTION_C = THERMODYNAMIC_DATA.Tcond_act - THERMODYNAMIC_DATA.Tcond_practical;
export const POWER_SAVING_PCT = EXPECTED_POWER_REDUCTION_PCT;
export const MAINTENANCE_PCT = 2;
export const GRID_EMISSION_FACTOR = 0.82; // kg CO2e/kWh