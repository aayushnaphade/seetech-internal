// Excel Import Utility for Cool Vault Equipment Data
// This utility handles importing Excel files with 3 worksheets (Chiller, VRF, DX)

import type { CoolVaultEquipment, ChillerEquipment, VRFEquipment, DXEquipment } from '@/app/data-manager/page';

// Column mapping for Chiller worksheet
const CHILLER_COLUMN_MAP = {
  'Sr. no.': 'sr_no',
  'Chiller Make': 'make',
  'Chiller Model': 'model',
  'Refrigerant used': 'refrigerant_used',
  'Design DBT for TR capacity (OC)': 'design_dbt_for_tr_capacity_oc',
  'Cooling Capacity (TR)': 'cooling_capacity_tr',
  'Cooling Capacity (KW)': 'cooling_capacity_kw',
  'NO. of condenser fans': 'no_of_condenser_fans',
  'CFM / fan': 'cfm_per_fan',
  'Fan diameter (mm)': 'fan_diameter',
  'Motor power per fan (kw)': 'motor_power_per_fan_kw',
  'Total fan motor power (kw)': 'total_fan_motor_power_kw',
  'Fan (RPM)': 'fan_rpm',
  'Total Airflow (CFM)': 'total_airflow_cfm',
  'Chiller total Power Consumption at 100% loading (kW)': 'total_power_consumption_100_loading_kw',
  'Chiller Working hours (hrs)': 'working_hours_hrs',
  'Length (mm)': 'length_mm',
  'Width (mm)': 'width_mm',
  'Height (mm)': 'height_mm',
  'Pad area required (front - chiller panel face ) , (ft2)': 'pad_area_required_front_ft2',
  'Pad area required (left side) , (ft2)': 'pad_area_required_left_side_ft2',
  'Pad area required (right side) , (ft2)': 'pad_area_required_right_side_ft2',
  'Pad area required (back side ) (ft2)': 'pad_area_required_back_side_ft2',
  'Total Pad area (ft2)': 'total_pad_area_ft2',
  'Water consumption (liters/hr)': 'water_consumption_liters_hr',
  'Pump for pads water flow (lt/min)': 'pump_for_pads_water_flow_lt_min',
  'Pump head (m)': 'pump_head_m',
  'Pump motor (kw)': 'pump_motor_kw',
  'Pipe size': 'pipe_size',
  'Pipe length': 'pipe_length',
  'Other Plumbing material': 'other_plumbing_material',
  'Water tank (liters)': 'water_tank_liters'
};

// Column mapping for VRF worksheet
const VRF_COLUMN_MAP = {
  'Sr no.': 'sr_no',
  'VRV/VRF Make': 'make',
  'VRV/VRF Model': 'model',
  'Refrigerant used': 'refrigerant_used',
  'Design DBT for TR capacity (OC)': 'design_dbt_for_tr_capacity_oc',
  'Cooling Capacity (TR)': 'cooling_capacity_tr',
  'Cooling Capacity (KW)': 'cooling_capacity_kw',
  'NO. of condenser fans': 'no_of_condenser_fans',
  'CFM / fan': 'cfm_per_fan',
  'Fan diameter': 'fan_diameter',
  'Motor power per fan (kw)': 'motor_power_per_fan_kw',
  'Total Fan motor power (kw)': 'total_fan_motor_power_kw',
  'Fan (RPM)': 'fan_rpm',
  'Total Airflow (CFM)': 'total_airflow_cfm',
  'VRV total Power Consumption at 100% loading (kW)': 'total_power_consumption_100_loading_kw',
  'VRV Working hours (hrs)': 'working_hours_hrs',
  'Length (mm)': 'length_mm',
  'Width (mm)': 'width_mm',
  'Height (mm)': 'height_mm',
  'Pad area required (front - chiller panel face ) , (ft2)': 'pad_area_required_front_ft2',
  'Pad area required (left side) , (ft2)': 'pad_area_required_left_side_ft2',
  'Pad area required (right side) , (ft2)': 'pad_area_required_right_side_ft2',
  'Pad area required (back side ) (ft2)': 'pad_area_required_back_side_ft2',
  'Total Pad area (ft2)': 'total_pad_area_ft2',
  'Water consumption (liters/hr)': 'water_consumption_liters_hr',
  'Pump for pads water flow (lt/min)': 'pump_for_pads_water_flow_lt_min',
  'Pump head (m)': 'pump_head_m',
  'Pump motor (kw)': 'pump_motor_kw',
  'Pipe size': 'pipe_size',
  'Pipe length': 'pipe_length',
  'Other Plumbing material': 'other_plumbing_material',
  'Water tank (liters)': 'water_tank_liters'
};

// Column mapping for DX worksheet
const DX_COLUMN_MAP = {
  'Sr no.': 'sr_no',
  'Company Name': 'make',
  'DX Model': 'model',
  'Refrigerant used': 'refrigerant_used',
  'Design DBT for TR capacity (OC)': 'design_dbt_for_tr_capacity_oc',
  'Cooling Capacity (TR)': 'cooling_capacity_tr',
  'Cooling Capacity (KW)': 'cooling_capacity_kw',
  'No. of condenser fans': 'no_of_condenser_fans',
  'CFM / fan': 'cfm_per_fan',
  'Fan diameter': 'fan_diameter',
  'Motor power per fan (kw)': 'motor_power_per_fan_kw',
  'Total Fan motor power (kw)': 'total_fan_motor_power_kw',
  'Fan (RPM)': 'fan_rpm',
  'Total Airflow (CFM)': 'total_airflow_cfm',
  'DX total Power Consumption at 100% loading (kW)': 'total_power_consumption_100_loading_kw',
  'DX Working hours (hrs)': 'working_hours_hrs',
  'Length (mm)': 'length_mm',
  'Width (mm)': 'width_mm',
  'Height (mm)': 'height_mm',
  'Total Pad area (Back side) (ft2)': 'total_pad_area_back_side_ft2',
  'Water consumption (liters/hr)': 'water_consumption_liters_hr',
  'Pump for pads water flow (lt/min)': 'pump_for_pads_water_flow_lt_min',
  'Pump head (m)': 'pump_head_m',
  'Pump motor (kw)': 'pump_motor_kw',
  'Pipe size': 'pipe_size',
  'Pipe length': 'pipe_length',
  'Other Plumbing material': 'other_plumbing_material',
  'Water tank (liters)': 'water_tank_liters'
};

// Helper function to convert Excel row to equipment object
function mapRowToEquipment(row: any, columnMap: any, type: 'chiller' | 'vrf' | 'dx_unit'): CoolVaultEquipment {
  const baseEquipment: any = {
    id: `cv_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Map each column to the corresponding property
  Object.entries(columnMap).forEach(([excelColumn, propertyName]) => {
    const value = row[excelColumn];
    if (value !== undefined && value !== null && value !== '') {
      // Convert numeric values
      if (typeof value === 'string' && !isNaN(Number(value))) {
        baseEquipment[propertyName] = Number(value);
      } else {
        baseEquipment[propertyName] = value;
      }
    }
  });

  return baseEquipment as CoolVaultEquipment;
}

// Main function to parse Excel data
export function parseExcelData(workbookData: any): CoolVaultEquipment[] {
  const equipment: CoolVaultEquipment[] = [];

  try {
    // Process Chiller worksheet
    if (workbookData.chiller && Array.isArray(workbookData.chiller)) {
      workbookData.chiller.forEach((row: any) => {
        if (row['Sr. no.']) { // Only process rows with serial number
          const chillerEquipment = mapRowToEquipment(row, CHILLER_COLUMN_MAP, 'chiller');
          equipment.push(chillerEquipment);
        }
      });
    }

    // Process VRF worksheet
    if (workbookData.vrf && Array.isArray(workbookData.vrf)) {
      workbookData.vrf.forEach((row: any) => {
        if (row['Sr no.']) { // Only process rows with serial number
          const vrfEquipment = mapRowToEquipment(row, VRF_COLUMN_MAP, 'vrf');
          equipment.push(vrfEquipment);
        }
      });
    }

    // Process DX worksheet
    if (workbookData.dx && Array.isArray(workbookData.dx)) {
      workbookData.dx.forEach((row: any) => {
        if (row['Sr no.']) { // Only process rows with serial number
          const dxEquipment = mapRowToEquipment(row, DX_COLUMN_MAP, 'dx_unit');
          equipment.push(dxEquipment);
        }
      });
    }

  } catch (error) {
    console.error('Error parsing Excel data:', error);
    throw new Error('Failed to parse Excel data. Please check the format and try again.');
  }

  return equipment;
}

// Function to validate Excel structure
export function validateExcelStructure(workbookData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if required worksheets exist
  if (!workbookData.chiller) {
    errors.push('Missing "chiller" worksheet');
  }
  if (!workbookData.vrf) {
    errors.push('Missing "vrf" worksheet');
  }
  if (!workbookData.dx) {
    errors.push('Missing "dx" worksheet');
  }

  // Check if worksheets have data
  if (workbookData.chiller && (!Array.isArray(workbookData.chiller) || workbookData.chiller.length === 0)) {
    errors.push('Chiller worksheet is empty or invalid');
  }
  if (workbookData.vrf && (!Array.isArray(workbookData.vrf) || workbookData.vrf.length === 0)) {
    errors.push('VRF worksheet is empty or invalid');
  }
  if (workbookData.dx && (!Array.isArray(workbookData.dx) || workbookData.dx.length === 0)) {
    errors.push('DX worksheet is empty or invalid');
  }

  // Check for required columns in each worksheet
  if (workbookData.chiller && workbookData.chiller.length > 0) {
    const chillerColumns = Object.keys(workbookData.chiller[0]);
    const requiredChillerColumns = ['Sr. no.', 'Chiller Make', 'Chiller Model'];
    requiredChillerColumns.forEach(col => {
      if (!chillerColumns.includes(col)) {
        errors.push(`Missing required column "${col}" in chiller worksheet`);
      }
    });
  }

  if (workbookData.vrf && workbookData.vrf.length > 0) {
    const vrfColumns = Object.keys(workbookData.vrf[0]);
    const requiredVrfColumns = ['Sr no.', 'VRV/VRF Make', 'VRV/VRF Model'];
    requiredVrfColumns.forEach(col => {
      if (!vrfColumns.includes(col)) {
        errors.push(`Missing required column "${col}" in VRF worksheet`);
      }
    });
  }

  if (workbookData.dx && workbookData.dx.length > 0) {
    const dxColumns = Object.keys(workbookData.dx[0]);
    const requiredDxColumns = ['Sr no.', 'Company Name', 'DX Model'];
    requiredDxColumns.forEach(col => {
      if (!dxColumns.includes(col)) {
        errors.push(`Missing required column "${col}" in DX worksheet`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export column mappings for reference
export { CHILLER_COLUMN_MAP, VRF_COLUMN_MAP, DX_COLUMN_MAP };