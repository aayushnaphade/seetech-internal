/**
 * 📊 Sample Data for Adiabatic Cooling Proposal Template
 * Professional test data for development and demonstration
 */

import { AdiabaticCoolingProposalData } from './types';

export const sampleProposalData: AdiabaticCoolingProposalData = {
  // 🏢 Project Information
  projectName: "Corporate Office Complex - Cooling System Upgrade",
  clientName: "TechCorp Solutions Pvt. Ltd.",
  location: "Pune, Maharashtra, India",
  date: new Date().toISOString().split('T')[0],
  proposalNumber: "ST-AC-2025-001",
  engineerName: "Rajesh Kumar, P.E.",
  
  // 👤 Contact Information
  contactPerson: "Mr. Amit Sharma",
  contactEmail: "amit.sharma@techcorp.com",
  contactPhone: "+91 98765 43210",
  
  // ⚡ Current System Data
  currentPower: "180",              // kW
  currentEfficiency: "65",          // %
  currentOperatingCost: "2400000",  // Annual cost in Rs
  electricityRate: "8.50",          // Rs/kWh
  
  // 🎯 Proposed System Data
  expectedSaving: "28",             // % improvement
  proposedEfficiency: "85",         // %
  systemCapacity: "150",            // TR (Tons of Refrigeration)
  chillerType: "Air-Cooled Screw Chiller with Adiabatic Cooling",
  
  // 💰 Financial Data
  investmentCost: "3500000",        // Total investment in Rs
  paybackPeriod: "2.8",            // Years
  roi: "35.7",                     // %
  
  // 🌍 Environmental Data
  co2Reduction: "195600",          // kg CO2/year
  waterSaving: "450000",           // Liters/year
  
  // 📋 Technical Specifications
  ambientTemperature: "42",        // °C
  chillWaterTemperature: "7",      // °C
  wetBulbTemperature: "28",        // °C
  humidity: "65",                  // %
  
  // 📊 Operational Parameters
  operatingHours: "24",            // Hours/day
  operatingDays: "320",            // Days/year
  loadFactor: "75"                 // %
};

export const sampleProposalData2: AdiabaticCoolingProposalData = {
  // 🏢 Project Information
  projectName: "Manufacturing Facility - Energy Efficiency Retrofit",
  clientName: "IndoManufacturing Industries Ltd.",
  location: "Chennai, Tamil Nadu, India",
  date: new Date().toISOString().split('T')[0],
  proposalNumber: "ST-AC-2025-002",
  engineerName: "Priya Sharma, M.Tech",
  
  // 👤 Contact Information
  contactPerson: "Mr. Suresh Kumar",
  contactEmail: "suresh.kumar@indomfg.com",
  contactPhone: "+91 98765 12345",
  
  // ⚡ Current System Data
  currentPower: "350",              // kW
  currentEfficiency: "58",          // %
  currentOperatingCost: "4800000",  // Annual cost in Rs
  electricityRate: "9.20",          // Rs/kWh
  
  // 🎯 Proposed System Data
  expectedSaving: "32",             // % improvement
  proposedEfficiency: "88",         // %
  systemCapacity: "300",            // TR
  chillerType: "Centrifugal Chiller with Advanced Adiabatic Pre-Cooling",
  
  // 💰 Financial Data
  investmentCost: "7200000",        // Total investment in Rs
  paybackPeriod: "3.2",            // Years
  roi: "31.3",                     // %
  
  // 🌍 Environmental Data
  co2Reduction: "420800",          // kg CO2/year
  waterSaving: "750000",           // Liters/year
  
  // 📋 Technical Specifications
  ambientTemperature: "38",        // °C
  chillWaterTemperature: "6",      // °C
  wetBulbTemperature: "29",        // °C
  humidity: "70",                  // %
  
  // 📊 Operational Parameters
  operatingHours: "24",            // Hours/day
  operatingDays: "350",            // Days/year
  loadFactor: "85"                 // %
};

export const sampleProposalData3: AdiabaticCoolingProposalData = {
  // 🏢 Project Information
  projectName: "Hospital HVAC System - Critical Infrastructure Upgrade",
  clientName: "MediCare Super Specialty Hospital",
  location: "Bangalore, Karnataka, India",
  date: new Date().toISOString().split('T')[0],
  proposalNumber: "ST-AC-2025-003",
  engineerName: "Dr. Anand Patel, Ph.D",
  
  // 👤 Contact Information
  contactPerson: "Dr. Meera Singh",
  contactEmail: "meera.singh@medicare.com",
  contactPhone: "+91 98765 67890",
  
  // ⚡ Current System Data
  currentPower: "220",              // kW
  currentEfficiency: "62",          // %
  currentOperatingCost: "3200000",  // Annual cost in Rs
  electricityRate: "7.80",          // Rs/kWh
  
  // 🎯 Proposed System Data
  expectedSaving: "25",             // % improvement
  proposedEfficiency: "82",         // %
  systemCapacity: "180",            // TR
  chillerType: "Variable Speed Screw Chiller with Evaporative Pre-Cooling",
  
  // 💰 Financial Data
  investmentCost: "4500000",        // Total investment in Rs
  paybackPeriod: "3.5",            // Years
  roi: "28.6",                     // %
  
  // 🌍 Environmental Data
  co2Reduction: "205200",          // kg CO2/year
  waterSaving: "520000",           // Liters/year
  
  // 📋 Technical Specifications
  ambientTemperature: "35",        // °C
  chillWaterTemperature: "8",      // °C
  wetBulbTemperature: "26",        // °C
  humidity: "60",                  // %
  
  // 📊 Operational Parameters
  operatingHours: "24",            // Hours/day
  operatingDays: "365",            // Days/year (critical facility)
  loadFactor: "70"                 // %
};

/**
 * 🧪 Validation Test Data
 * Data with various edge cases for testing validation
 */
export const invalidProposalData: Partial<AdiabaticCoolingProposalData> = {
  projectName: "",                  // Empty - should fail validation
  clientName: "Test Client",
  currentPower: "-50",             // Negative - should fail validation
  expectedSaving: "150",           // Over 100% - should fail validation
  electricityRate: "0",            // Zero - should fail validation
  systemCapacity: "",              // Empty - should fail validation
  investmentCost: "abc",           // Non-numeric - should fail validation
};

/**
 * 📈 Performance Benchmark Data
 * Industry standard benchmarks for comparison
 */
export const industryBenchmarks = {
  typical_chiller_cop: 3.5,
  high_efficiency_cop: 5.5,
  excellent_efficiency_cop: 6.8,
  
  typical_efficiency_percent: 65,
  good_efficiency_percent: 75,
  excellent_efficiency_percent: 85,
  
  typical_payback_years: 4.0,
  good_payback_years: 3.0,
  excellent_payback_years: 2.0,
  
  co2_emission_factor_india: 0.82, // kg CO2 per kWh
  average_electricity_rate_commercial: 8.5, // Rs/kWh
};

/**
 * 📊 Chart Test Data
 * Pre-calculated data for chart testing
 */
export const chartTestData = {
  powerComparison: [
    { name: 'Current', value: 180, color: '#B23A48' },
    { name: 'Proposed', value: 130, color: '#2E936E' },
    { name: 'Savings', value: 50, color: '#1D7AA3' }
  ],
  
  monthlyConsumption: [
    { name: 'Jan', current: 18500, proposed: 13320, savings: 5180 },
    { name: 'Feb', current: 17200, proposed: 12384, savings: 4816 },
    { name: 'Mar', current: 19800, proposed: 14256, savings: 5544 },
    { name: 'Apr', current: 21500, proposed: 15480, savings: 6020 },
    { name: 'May', current: 23200, proposed: 16704, savings: 6496 },
    { name: 'Jun', current: 24100, proposed: 17352, savings: 6748 }
  ],
  
  efficiencyBreakdown: [
    { name: 'Cooling System', value: 45, color: '#2E936E' },
    { name: 'Air Handling', value: 25, color: '#1D7AA3' },
    { name: 'Controls', value: 15, color: '#F68D60' },
    { name: 'Distribution', value: 15, color: '#7CDBD5' }
  ]
};

export default sampleProposalData;
