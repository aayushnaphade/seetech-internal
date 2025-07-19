"""
Business logic and calculations for the adiabatic cooling proposal system.
"""

import pandas as pd
from num2words import num2words
from babel.numbers import format_currency
import re
from data.constants import *
from refrigeration_dash_report import (
    Tcond_act, Tcond_practical, COP_act_calc, COP_practical,
    power_saved_pct_vs_oem_act, power_saved_pct_operating_to_practical
)

# Adiabatic cooling system parameters
TEMP_REDUCTION_C = Tcond_act - Tcond_practical  # Using our actual data 
POWER_SAVING_PCT = EXPECTED_POWER_REDUCTION_PCT  # Using value from constants.py
MAINTENANCE_PCT = 2  # Annual maintenance cost as % of project cost
GRID_EMISSION_FACTOR = 0.82  # kg CO2e/kWh
# PROJECT_COST is imported from data.constants

# Function for Indian number formatting and value in words
def format_indian_number(number, with_words=False):
    """Format number with Indian notation (e.g., 10,00,000 instead of 1,000,000) using Babel"""
    # Format the number in Indian style using Babel
    formatted = format_currency(number, 'INR', locale='en_IN')
    
    # Remove the ".00" if present for whole numbers
    formatted = re.sub(r'\.00$', '', formatted)
    
    # Add words for large numbers if requested
    if with_words:
        words = ""
        if number >= 10000000:  # 1 crore or more
            cr_value = number / 10000000
            words = f" ({cr_value:.2f} Cr)"
        elif number >= 100000:  # 1 lakh or more
            lakh_value = number / 100000
            words = f" ({lakh_value:.2f} L)"
            
        return f"{formatted}{words}"
    
    return formatted

def calculate_power_savings():
    """Calculate power savings from condenser temperature reduction"""
    # Using power saving value from constants.py
    return POWER_SAVING_PCT

def calculate_energy_savings(power_saving_pct):
    """Calculate annual energy and cost savings"""
    # Calculate annual energy consumption based on actual power consumption
    annual_energy_kwh = ACTUAL_POWER_KW * OPERATING_HOURS * WORKING_DAYS  # 210 kW * 24 hrs * 320 days = 1,612,800 kWh
    
    # Calculate energy savings using the fixed 20% power saving
    annual_energy_saving_kwh = annual_energy_kwh * (power_saving_pct/100)
    
    # Calculate annual monetary savings
    annual_monetary_saving = annual_energy_saving_kwh * ELECTRICITY_TARIFF
    
    return ACTUAL_POWER_KW, annual_energy_saving_kwh, annual_monetary_saving

def calculate_operating_costs():
    """Calculate water and maintenance costs"""
    # Water consumption and cost
    # Calculate based on formula: 4 liters per 1000 CFM
    # Total CFM is 160000
    hourly_water_consumption = (TOTAL_CFM/1000) * WATER_CONSUMPTION  # 4 liters per 1000 CFM = 640 liters per hour
    annual_water_consumption = hourly_water_consumption * OPERATING_HOURS * WORKING_DAYS  # liters per year
    annual_water_consumption_m3 = annual_water_consumption / 1000  # Convert to cubic meters
    annual_water_cost = annual_water_consumption_m3 * WATER_COST  # Cost at 45 INR per m³
    
    # Maintenance cost
    annual_maintenance_cost = PROJECT_COST * (MAINTENANCE_PCT / 100)
    
    # Total operating cost
    total_annual_operating_cost = annual_water_cost + annual_maintenance_cost
    
    return annual_water_consumption_m3, annual_water_cost, annual_maintenance_cost, total_annual_operating_cost

def calculate_roi(net_annual_savings):
    """Calculate simple payback period in months"""
    years = PROJECT_COST / net_annual_savings
    months = round(years * 12)
    return months  # Return months instead of years

def calculate_lcc(annual_monetary_saving, total_annual_operating_cost):
    """Perform life cycle cost analysis"""
    lcc_table = []
    cumulative_dcf = -PROJECT_COST  # Initial investment is negative cash flow
    
    # Year 0 (initial investment)
    lcc_table.append({
        "Year": 0,
        "Initial Investment": -PROJECT_COST,
        "Annual Savings (Nominal)": 0,
        "Annual O&M Cost (Nominal)": 0,
        "Net Annual Cash Flow (Nominal)": -PROJECT_COST,
        "Net Annual Cash Flow (Discounted)": -PROJECT_COST,
        "Cumulative Discounted Cash Flow": cumulative_dcf
    })
    
    # Calculate for each year
    for year in range(1, PROJECT_LIFE + 1):
        # Apply inflation to savings and costs
        inflation_factor = (1 + INFLATION_RATE/100) ** year
        discount_factor = 1 / ((1 + DISCOUNT_RATE/100) ** year)
        
        nominal_savings = annual_monetary_saving * inflation_factor
        nominal_om_cost = total_annual_operating_cost * inflation_factor
        nominal_cash_flow = nominal_savings - nominal_om_cost
        discounted_cash_flow = nominal_cash_flow * discount_factor
        
        cumulative_dcf += discounted_cash_flow
        
        lcc_table.append({
            "Year": year,
            "Initial Investment": 0,
            "Annual Savings (Nominal)": round(nominal_savings),
            "Annual O&M Cost (Nominal)": round(nominal_om_cost),
            "Net Annual Cash Flow (Nominal)": round(nominal_cash_flow),
            "Net Annual Cash Flow (Discounted)": round(discounted_cash_flow),
            "Cumulative Discounted Cash Flow": round(cumulative_dcf)
        })
    
    # Calculate NPV (Net Present Value)
    npv = cumulative_dcf
    
    return lcc_table, npv

def calculate_ghg_savings(annual_energy_saving_kwh):
    """Calculate greenhouse gas emission savings"""
    annual_ghg_saving_kg = annual_energy_saving_kwh * GRID_EMISSION_FACTOR
    annual_ghg_saving_tonnes = annual_ghg_saving_kg / 1000
    
    return annual_ghg_saving_kg, annual_ghg_saving_tonnes

def calculate_results():
    """Calculate all results for the proposal"""
    # Calculate key metrics
    power_saving_pct = calculate_power_savings()
    initial_power_kw, annual_energy_saving_kwh, annual_monetary_saving = calculate_energy_savings(power_saving_pct)
    annual_water_consumption, annual_water_cost, annual_maintenance_cost, total_annual_operating_cost = calculate_operating_costs()
    net_annual_savings = annual_monetary_saving - total_annual_operating_cost
    roi_period = calculate_roi(net_annual_savings)
    lcc_table, npv = calculate_lcc(annual_monetary_saving, total_annual_operating_cost)
    annual_ghg_saving_kg, annual_ghg_saving_tonnes = calculate_ghg_savings(annual_energy_saving_kwh)
    
    # Format the temperature reduction text nicely
    temp_reduction_text = f"{TEMP_REDUCTION_C:.1f}°C (from {Tcond_act-273.15:.1f}°C to {Tcond_practical-273.15:.1f}°C)"
    
    # Create summary table data
    summary_data = pd.DataFrame({
        'Metric': ['Chiller Capacity', 'Working Days', 'Working Hours', 'Initial Power Consumption', 'Actual Power Consumption', 
                'Expected Power Reduction', 'Annual Energy Savings', 'Annual Cost Savings', 'Annual Water Consumption', 
                'Project Cost', 'Simple Payback Period', 'NPV (15 Years)'],
        'Value': [f"{CHILLER_CAPACITY_TR} TR", f"{WORKING_DAYS} days", f"{OPERATING_HOURS} hours", 
                f"{INITIAL_POWER_KW:.1f} kW/hr", f"{ACTUAL_POWER_KW:.1f} kW/hr", f"{power_saving_pct:.1f}%", 
                f"{int(annual_energy_saving_kwh):,} kWh/year", format_indian_number(annual_monetary_saving, True) + "/year", 
                f"{annual_water_consumption:,.1f} m³/year",
                format_indian_number(PROJECT_COST, True), f"{roi_period} months", format_indian_number(npv, True)]
    })
    
    # LCC summary data for a more concise table
    lcc_summary = pd.DataFrame([
        {"Year": row["Year"],
        "Cash Flow": row["Net Annual Cash Flow (Nominal)"],
        "Discounted CF": row["Net Annual Cash Flow (Discounted)"],
        "Cumulative DCF": row["Cumulative Discounted Cash Flow"]} 
        for row in lcc_table if row["Year"] in [0, 1, 2, 3, 5, 10, 15]  # Show only key years
    ])
    
    # Environmental Impact Table
    environmental_data = pd.DataFrame({
        'Impact': ['Annual Energy Savings', 'Grid Emission Factor', 'Annual CO2e Reduction', 'Equivalent to Trees Planted'],
        'Value': [f"{int(annual_energy_saving_kwh):,} kWh/year", 
                f"{GRID_EMISSION_FACTOR} kg CO2e/kWh", 
                f"{annual_ghg_saving_tonnes:.1f} tonnes CO2e/year",
                f"{int(annual_ghg_saving_tonnes * 16.5):,} trees"]  # Approx 16.5 trees per tonne of CO2
    })
    
    # Return all calculated values
    return {
        "power_saving_pct": power_saving_pct,
        "initial_power_kw": initial_power_kw,
        "annual_energy_saving_kwh": annual_energy_saving_kwh,
        "annual_monetary_saving": annual_monetary_saving,
        "annual_water_consumption": annual_water_consumption,
        "annual_water_cost": annual_water_cost,
        "annual_maintenance_cost": annual_maintenance_cost,
        "total_annual_operating_cost": total_annual_operating_cost,
        "net_annual_savings": net_annual_savings,
        "roi_period": roi_period,
        "lcc_table": lcc_table,
        "lcc_summary": lcc_summary,
        "npv": npv,
        "annual_ghg_saving_kg": annual_ghg_saving_kg,
        "annual_ghg_saving_tonnes": annual_ghg_saving_tonnes,
        "temp_reduction_text": temp_reduction_text,
        "summary_data": summary_data,
        "environmental_data": environmental_data
    }
