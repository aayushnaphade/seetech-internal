"""
Thermodynamic calculation logic for the P-H chart.
"""

import CoolProp.CoolProp as CP
import numpy as np
from scipy.optimize import fsolve

def calculate_wbt(dbt, rh):
    """
    Calculate Wet Bulb Temperature (WBT) from Dry Bulb Temperature (DBT) and Relative Humidity (RH).
    Uses the Stull formula.
    
    Args:
        dbt (float): Dry Bulb Temperature in Celsius.
        rh (float): Relative Humidity in percent (0-100).
        
    Returns:
        float: Wet Bulb Temperature in Celsius.
    """
    dbt_k = dbt + 273.15
    rh_frac = rh / 100.0
    
    # Magnus-Tetens formula for saturation vapor pressure
    e_s = 6.112 * np.exp((17.67 * dbt) / (dbt + 243.5))
    # Actual vapor pressure
    e = rh_frac * e_s
    
    # Stull's formula for WBT
    def equation(wbt):
        e_s_wbt = 6.112 * np.exp((17.67 * wbt) / (wbt + 243.5))
        return e_s_wbt - e - 0.00066 * (1 + 0.00115 * wbt) * 1013.25 * (dbt - wbt)

    # Initial guess for WBT is DBT
    wbt_initial_guess = dbt
    wbt_solution = fsolve(equation, wbt_initial_guess)
    
    return wbt_solution[0]

def get_saturation_dome(fluid):
    """
    Calculates the saturation dome for a given fluid.
    """
    P_crit = CP.PropsSI(fluid, 'pcrit')
    P_min = CP.PropsSI('P', 'T', 223.15, 'Q', 0, fluid)
    
    pressures = np.linspace(P_min, P_crit * 0.99, 100)
    h_liq = [CP.PropsSI('H', 'P', p, 'Q', 0, fluid) for p in pressures]
    h_vap = [CP.PropsSI('H', 'P', p, 'Q', 1, fluid) for p in pressures]
    
    return pressures, h_liq, h_vap

def calculate_oem_cycle(fluid, te_oem, tc_oem, sh_oem, sc_oem):
    """
    Calculates the OEM cycle based on provided parameters.
    """
    p1 = CP.PropsSI('P', 'T', te_oem + 273.15, 'Q', 1, fluid)
    t1 = te_oem + sh_oem + 273.15
    h1 = CP.PropsSI('H', 'T', t1, 'P', p1, fluid)
    s1 = CP.PropsSI('S', 'T', t1, 'P', p1, fluid)
    
    p2 = CP.PropsSI('P', 'T', tc_oem + 273.15, 'Q', 0, fluid)
    h2 = CP.PropsSI('H', 'S', s1, 'P', p2, fluid)
    
    t3 = tc_oem - sc_oem + 273.15
    h3 = CP.PropsSI('H', 'T', t3, 'P', p2, fluid)
    
    h4 = h3
    
    H = [h1, h2, h3, h4, h1]
    P = [p1, p2, p2, p1, p1]
    
    return H, P

def calculate_actual_cycle(fluid, p_suction, p_condenser, sh_act, sc_act):
    """
    Calculates the actual cycle based on sensor readings.
    """
    te_act = CP.PropsSI('T', 'P', p_suction * 1000, 'Q', 1, fluid) - 273.15
    t1 = te_act + sh_act + 273.15
    h1 = CP.PropsSI('H', 'T', t1, 'P', p_suction * 1000, fluid)
    s1 = CP.PropsSI('S', 'T', t1, 'P', p_suction * 1000, fluid)
    
    h2 = CP.PropsSI('H', 'S', s1, 'P', p_condenser * 1000, fluid)
    
    tc_act = CP.PropsSI('T', 'P', p_condenser * 1000, 'Q', 0, fluid) - 273.15
    t3 = tc_act - sc_act + 273.15
    h3 = CP.PropsSI('H', 'T', t3, 'P', p_condenser * 1000, fluid)
    
    h4 = h3
    
    H = [h1, h2, h3, h4, h1]
    P = [p_suction * 1000, p_condenser * 1000, p_condenser * 1000, p_suction * 1000, p_suction * 1000]
    
    return H, P

def calculate_optimized_cycle(fluid, p_suction, sh_act, sc_act, dbt, rh, approach):
    """
    Calculates the optimized cycle based on environmental conditions.
    """
    wbt = calculate_wbt(dbt, rh)
    tc_opt = wbt + approach
    
    p_condenser_opt = CP.PropsSI('P', 'T', tc_opt + 273.15, 'Q', 0, fluid)
    
    te_act = CP.PropsSI('T', 'P', p_suction * 1000, 'Q', 1, fluid) - 273.15
    t1 = te_act + sh_act + 273.15
    h1 = CP.PropsSI('H', 'T', t1, 'P', p_suction * 1000, fluid)
    s1 = CP.PropsSI('S', 'T', t1, 'P', p_suction * 1000, fluid)
    
    h2 = CP.PropsSI('H', 'S', s1, 'P', p_condenser_opt, fluid)
    
    t3 = tc_opt - sc_act + 273.15
    h3 = CP.PropsSI('H', 'T', t3, 'P', p_condenser_opt, fluid)
    
    h4 = h3
    
    H = [h1, h2, h3, h4, h1]
    P = [p_suction * 1000, p_condenser_opt, p_condenser_opt, p_suction * 1000, p_suction * 1000]
    
    return H, P
