"""
Helper module to export refrigeration cycle data for use in other applications.
This file imports values from refrigeration_dash.py and re-exports them.
"""

# Import necessary modules
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import all the required variables from refrigeration_dash.py
from refrigeration_dash import (
    # Circuits
    N_circuits,
    
    # COP values
    COP_oem, COP_oem_calc, COP_act_calc, COP_theoretical, COP_practical,
    
    # Power values
    W_oem_calc, W_act, W_theoretical, W_practical,
    
    # Temperature values
    Tevap_oem, Tevap_act, Tevap_practical,
    Tcond_oem, Tcond_act, Tcond_practical,
    
    # Temperature arrays
    T_oem, T_act, T_theoretical, T_practical,
    
    # Power savings percentages
    power_saved_pct_vs_oem_act,
    power_saved_pct_vs_oem_practical,
    power_saved_pct_operating_to_practical
)

# Export all variables (already done through the import)
