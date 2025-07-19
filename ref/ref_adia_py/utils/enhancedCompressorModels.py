# -*- coding: utf-8 -*-
"""
Enhanced compressor models with system efficiency factors to account for real-world losses
"""

def myCompressor1(PR):
    """
    Original compressor model based on Ouadha et al., 2008
    """
    # input checking
    if PR < 1.5:
        print('Problem: this compressor model is not')
        print('defined for your specificed PR.')
        return

    n_vol = 1.95125 - 0.80946*PR + 0.17054*PR**2 - 0.01221*PR**3
    n_comp = 0.66768 + 0.0025*PR - 0.00303*PR**2
    
    return n_vol, n_comp

def myCompressor1_realistic(PR, include_system_losses=True):
    """
    Enhanced compressor model that accounts for real-world losses.
    
    Parameters:
    -----------
    PR : float
        Pressure ratio
    include_system_losses : bool, optional
        Whether to include system-level losses (default: True)
    
    Returns:
    --------
    n_vol : float
        Volumetric efficiency
    n_comp : float
        Isentropic efficiency (adjusted for real-world performance)
    """
    n_vol, n_comp_ideal = myCompressor1(PR)
    
    if include_system_losses:
        # Apply correction factors based on real-world data
        # Motor efficiency loss factor (typical ranges from 0.85 to 0.95)
        motor_efficiency = 0.90
        
        # Mechanical losses in transmission (typical ranges from 0.92 to 0.98)
        mechanical_efficiency = 0.95
        
        # System losses factor (additional losses not captured in the model)
        # Calibrated to make the model match observed COP values
        system_factor = 0.58
        
        # Apply combined efficiency factors
        n_comp = n_comp_ideal * motor_efficiency * mechanical_efficiency * system_factor
    else:
        n_comp = n_comp_ideal
    
    return n_vol, n_comp


def get_compressor_efficiency_factors():
    """
    Returns efficiency factors used to convert ideal to realistic COP
    
    Returns:
    --------
    factors : dict
        Dictionary containing efficiency factors
    """
    factors = {
        'motor_efficiency': 0.90,
        'mechanical_efficiency': 0.95,
        'system_factor': 0.58,
        'combined_factor': 0.90 * 0.95 * 0.58
    }
    return factors
