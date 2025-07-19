"""
Constants and configuration data for the adiabatic cooling proposal system.
"""
from datetime import datetime

# -----------------------------
# Project Parameters
# -----------------------------
CLIENT_NAME = "Ashirwad Pipes 26'"
CLIENT_LOCATION = "Plot 26, Attibele"
REPORT_DATE = datetime.now().strftime('%B %d, %Y')
PREPARED_BY = "System Generated"

# Chiller specifications
CHILLER_CAPACITY_TR = 255
CHILLER_TYPE = "Air-Cooled"
WORKING_DAYS = 320
OPERATING_HOURS = 24
INITIAL_POWER_KW = 203.8
ACTUAL_POWER_KW = 210  # Actual power consumption measured by the power meter
ELECTRICITY_TARIFF = 6.5  # INR per kWh
WATER_COST = 45  # INR per 1000 liters
TOTAL_CFM = 160000
WATER_CONSUMPTION = 4  # liters per 1000 CFM
TDS_RECOMMENDATION = 200  # ppm

# Financial parameters
INFLATION_RATE = 4  # Percent
DISCOUNT_RATE = 8  # Percent
PROJECT_LIFE = 15  # Years

# Visual styling - Enhanced Modern Professional Palette
COLORS = {
    'primary': '#0A435C',    # Deeper blue for headings (professional, authoritative)
    'secondary': '#1D7AA3',  # Medium blue for highlights and secondary elements
    'accent': '#2E936E',     # Rich teal-green for positive values (clean energy vibes)
    'warning': '#B23A48',    # Refined burgundy-red for warnings/negatives (less harsh)
    'neutral': '#F8FAFC',    # Very light blue-gray for backgrounds (fresh, clean)
    'text': '#2D3B45',       # Deep slate for text (easier on eyes than pure black)
    'light_accent': '#7CDBD5', # Vibrant teal accent (for highlights and graphical elements)
    'border': '#D9E2EC',     # Subtle border color (softer than previous)
    'highlight': '#F68D60',  # Warm orange for highlights (more sophisticated)
    'gradient_start': '#0A435C', # Primary gradient start
    'gradient_end': '#1D7AA3',   # Primary gradient end
    'accent_gradient_start': '#2E936E', # Accent gradient start
    'accent_gradient_end': '#7CDBD5',   # Accent gradient end
    'card_bg': '#FFFFFF',    # Card background color
    'card_shadow': '0 2px 4px rgba(10, 67, 92, 0.1)', # Simplified shadow for better PDF/print compatibility
    'muted_text': '#64748B',  # For secondary or less important text
    'table_header': '#0A435C', # Table header background (matches primary)
    'table_odd': '#F8FAFC',   # Table odd row background
    'table_even': '#EDF2F7',   # Table even row background for subtle zebra striping

    # PDF and print-friendly shadow alternatives
    'pdf_friendly': {
        # Using border-based alternatives that render well in PDFs and print
        'card_border': '1px solid rgba(10, 67, 92, 0.2)',  # Border alternative to shadow
        'card_border_accent': '1px solid rgba(46, 147, 110, 0.3)', # Accent border
        
        # Lightweight shadows that print better
        'light_shadow': '0 1px 2px rgba(10, 67, 92, 0.08)',
        'medium_shadow': '0 2px 3px rgba(10, 67, 92, 0.1)',
    },
}
