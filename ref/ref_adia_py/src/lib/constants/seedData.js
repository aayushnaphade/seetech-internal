/**
 * Seed data for project constants
 * These values are extracted from the Python constants.py file
 */

export const refrigerationConstants = {
  // Project Parameters
  CLIENT_NAME: "SeeTech",
  CLIENT_LOCATION: "Plot 26, Attibele",
  REPORT_DATE: "July 1, 2025",
  PREPARED_BY: "System Generated",
  
  // Chiller specifications
  CHILLER_CAPACITY_TR: 255,
  CHILLER_TYPE: "Air-Cooled",
  WORKING_DAYS: 320,
  OPERATING_HOURS: 24,
  INITIAL_POWER_KW: 203.8,
  ACTUAL_POWER_KW: 210.0,
  EXPECTED_POWER_REDUCTION_PCT: 20.0,
  ELECTRICITY_TARIFF: 6.5, // INR per kWh
  WATER_COST: 45.0, // INR per 1000 liters
  TOTAL_CFM: 160000,
  WATER_CONSUMPTION: 4.0, // liters per 1000 CFM
  TDS_RECOMMENDATION: 200, // ppm
  
  // Adiabatic cooling system parameters
  TEMP_REDUCTION_C: 8.15, // From refrigeration_dash.py (Tcond_act - Tcond_practical)
  
  // Financial parameters
  PROJECT_COST: 2030000.0,
  MAINTENANCE_PCT: 2.0, // Annual maintenance cost as % of project cost
  GRID_EMISSION_FACTOR: 0.82, // kg CO2e/kWh
  INFLATION_RATE: 4.0,
  DISCOUNT_RATE: 8.0,
  PROJECT_LIFE: 15,
};

export const COLORS = {
  primary: '#0A435C',
  secondary: '#1D7AA3',
  accent: '#2E936E',
  warning: '#B23A48',
  neutral: '#F8FAFC',
  text: '#2D3B45',
  light_accent: '#7CDBD5',
  border: '#D9E2EC',
  highlight: '#F68D60',
  gradient_start: '#0A435C',
  gradient_end: '#1D7AA3',
  accent_gradient_start: '#2E936E',
  accent_gradient_end: '#7CDBD5',
  card_bg: '#FFFFFF',
  card_shadow: '0 2px 4px rgba(10, 67, 92, 0.1)',
  muted_text: '#64748B',
  table_header: '#0A435C',
  table_odd: '#F8FAFC',
  table_even: '#EDF2F7',
  pdf_friendly: {
    card_border: '1px solid rgba(10, 67, 92, 0.2)',
    card_border_accent: '1px solid rgba(46, 147, 110, 0.3)',
    light_shadow: '0 1px 2px rgba(10, 67, 92, 0.08)',
    medium_shadow: '0 2px 3px rgba(10, 67, 92, 0.1)',
  }
};
