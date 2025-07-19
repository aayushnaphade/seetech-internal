"""
UI layout components for the adiabatic cooling proposal.
"""

from dash import html, dcc, dash_table
from data.constants import COLORS
from refrigeration_dash_report import COP_act_calc, COP_practical, Tcond_act, Tcond_practical

def create_ph_chart_explanation():
    """Create P-H chart explanation section with detailed technical information"""
    return html.Div([
        html.H3("P-H Chart Analysis"),
        html.P("The pressure-enthalpy (P-H) diagram below illustrates the refrigeration cycles under different operating conditions and demonstrates the impact of our proposed adiabatic cooling system:", 
               style={'marginBottom': '20px', 'fontSize': '16px'}),
        html.Div([
            html.Img(src='assets/refrigeration_cycle.png', style={'width': '100%', 'maxWidth': '800px', 'margin': '20px auto', 'display': 'block', 'border': f'1px solid {COLORS["neutral"]}'}),
            
            html.H4("Refrigeration Cycle Comparison", style={'marginTop': '30px', 'color': COLORS['primary']}),
            html.Table([
                html.Tr([
                    html.Th("Cycle Type", style={'background': COLORS['primary'], 'color': 'white', 'padding': '12px', 'width': '25%'}),
                    html.Th("Description", style={'background': COLORS['primary'], 'color': 'white', 'padding': '12px', 'width': '35%'}),
                    html.Th("Significance", style={'background': COLORS['primary'], 'color': 'white', 'padding': '12px', 'width': '40%'})
                ]),
                html.Tr([
                    html.Td("OEM Cycle", style={'padding': '12px', 'fontWeight': 'bold', 'color': '#1f77b4'}),
                    html.Td("Original equipment manufacturer's design cycle under ideal conditions", style={'padding': '12px'}),
                    html.Td("Represents baseline performance as per design specifications; optimal operating parameters established by manufacturer", style={'padding': '12px'})
                ]),
                html.Tr([
                    html.Td("Actual Cycle", style={'padding': '12px', 'fontWeight': 'bold', 'backgroundColor': COLORS['neutral'], 'color': '#ff7f0e'}),
                    html.Td("Current system performance under existing environmental conditions", style={'padding': '12px', 'backgroundColor': COLORS['neutral']}),
                    html.Td("Shows real-world performance deviation from design specifications; identifies efficiency losses and opportunities for improvement", style={'padding': '12px', 'backgroundColor': COLORS['neutral']})
                ]),
                html.Tr([
                    html.Td("Optimized Cycle", style={'padding': '12px', 'fontWeight': 'bold', 'color': '#2ca02c'}),
                    html.Td("Projected performance with adiabatic cooling implementation", style={'padding': '12px'}),
                    html.Td("Demonstrates expected performance gains through condenser temperature reduction; quantifies energy savings potential", style={'padding': '12px'})
                ])
            ], style={'width': '100%', 'borderCollapse': 'collapse', 'border': f'1px solid {COLORS["neutral"]}', 'margin': '20px 0', 'fontSize': '15px'}),
            
            html.H4("Degradation Zone Significance", style={'marginTop': '30px', 'color': COLORS['primary']}),
            html.P("The degradation zone represents the operational inefficiency due to suboptimal conditions:", style={'marginBottom': '15px'}),
            html.Table([
                html.Tr([
                    html.Th("Parameter", style={'background': COLORS['primary'], 'color': 'white', 'padding': '12px', 'width': '30%'}),
                    html.Th("Technical Impact", style={'background': COLORS['primary'], 'color': 'white', 'padding': '12px', 'width': '70%'})
                ]),
                html.Tr([
                    html.Td("High Condenser Temperature", style={'padding': '12px', 'fontWeight': 'bold'}),
                    html.Td("Increases condensing pressure, requiring higher compression ratios. Each 1°C temperature reduction typically yields 2-3% energy savings.", style={'padding': '12px'})
                ]),
                html.Tr([
                    html.Td("Increased Compressor Work", style={'padding': '12px', 'fontWeight': 'bold', 'backgroundColor': COLORS['neutral']}),
                    html.Td("Greater pressure differential between evaporator and condenser requires more electrical input power, reducing the Coefficient of Performance (COP).", style={'padding': '12px', 'backgroundColor': COLORS['neutral']})
                ]),
                html.Tr([
                    html.Td("System Reliability Impact", style={'padding': '12px', 'fontWeight': 'bold'}),
                    html.Td("Higher discharge temperatures and pressures increase mechanical stress on compressors and system components, leading to increased maintenance costs and reduced equipment lifespan.", style={'padding': '12px'})
                ]),
                html.Tr([
                    html.Td("Cooling Capacity Reduction", style={'padding': '12px', 'fontWeight': 'bold', 'backgroundColor': COLORS['neutral']}),
                    html.Td("Elevated condensing temperatures reduce mass flow rate of refrigerant, decreasing the system's ability to remove heat effectively from the process.", style={'padding': '12px', 'backgroundColor': COLORS['neutral']})
                ])
            ], style={'width': '100%', 'borderCollapse': 'collapse', 'border': f'1px solid {COLORS["neutral"]}', 'margin': '20px 0', 'fontSize': '15px'})
        ], style={'marginBottom': '30px'})
    ], style={'pageBreakInside': 'avoid', 'marginBottom': '30px'})

def create_a4_page_container(content, page_num=None, title=None):
    """Wrap content into a true A4-sized container."""
    children = []
    
    # Main content
    if isinstance(content, list):
        children.extend(content)
    else:
        children.append(content)
    
    # Outer A4 div with fixed dimensions
    return html.Div(
        html.Div(children, style={'position': 'relative', 'height': '100%'}),
        className='a4-page-container'
    )

def create_maintenance_section(power_saving_pct, annual_monetary_saving, roi_period, annual_ghg_saving_tonnes, CLIENT_NAME):
    """Create comprehensive maintenance service section with conclusion"""
    return html.Div([
        html.H2("7. Monthly Maintenance Service & Conclusion", className='section-header', 
               style={'marginBottom': '12px', 'marginTop': '10px'}),
        
        # Introduction with icon
        html.Div([
            html.I(className="fas fa-tools", style={
                'fontSize': '22px',
                'color': COLORS['secondary'],
                'marginRight': '12px'
            }),
            html.P([
                "Our commitment to your system's performance extends beyond installation with our comprehensive service program."
            ], style={'fontSize': '15px', 'lineHeight': '1.4', 'margin': '0', 'flex': '1'})
        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '15px', 'marginTop': '12px'}),
        
        html.H3("7.1 SEE-Tech Professional Maintenance Program", style={
            'color': COLORS['primary'], 
            'marginTop': '8px',
            'marginBottom': '12px',
            'fontSize': '17px'
        }),
        
        # Modern card-based layout for maintenance services
        html.Div([
            # Service Benefits Card
            html.Div([
                html.Div([
                    html.I(className="fas fa-star", style={
                        'fontSize': '20px',
                        'color': 'white',
                        'backgroundColor': COLORS['primary'],
                        'padding': '10px',
                        'borderRadius': '50%',
                        'marginBottom': '10px',
                        'display': 'inline-block'
                    }),
                    html.H4("Service Benefits", style={
                        'color': COLORS['primary'], 
                        'marginBottom': '10px', 
                        'marginTop': '0',
                        'borderBottom': f'2px solid {COLORS["accent"]}',
                        'paddingBottom': '6px',
                        'fontSize': '16px'
                    }),
                ], style={'textAlign': 'center'}),
                
                # Benefits in a more visual list format
                html.Div([
                    html.Div([
                        html.Div([
                            html.I(className="fas fa-check-circle", style={'color': COLORS['accent'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Regular system inspection and monitoring", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-check-circle", style={'color': COLORS['accent'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Preventive maintenance to avoid breakdowns", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-check-circle", style={'color': COLORS['accent'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Continuous optimization of system efficiency", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    ], style={'width': '48%'}),
                    html.Div([
                        html.Div([
                            html.I(className="fas fa-check-circle", style={'color': COLORS['accent'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Early detection of potential issues", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-check-circle", style={'color': COLORS['accent'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Extended equipment lifespan", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-check-circle", style={'color': COLORS['accent'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Guaranteed energy savings", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    ], style={'width': '48%'})
                ], style={'display': 'flex', 'justifyContent': 'space-between'}),
            ], style={
                'width': '48%',
                'padding': '15px', 
                'backgroundColor': '#f8f9fa',
                'borderRadius': '8px',
                'boxShadow': '0 2px 5px rgba(0,0,0,0.1)',
                'border': f'1px solid {COLORS["neutral"]}'
            }),
            
            # Service Components Card
            html.Div([
                html.Div([
                    html.I(className="fas fa-cogs", style={
                        'fontSize': '20px',
                        'color': 'white',
                        'backgroundColor': COLORS['secondary'],
                        'padding': '10px',
                        'borderRadius': '50%',
                        'marginBottom': '10px',
                        'display': 'inline-block'
                    }),
                    html.H4("Service Components", style={
                        'color': COLORS['primary'], 
                        'marginBottom': '10px', 
                        'marginTop': '0',
                        'borderBottom': f'2px solid {COLORS["accent"]}',
                        'paddingBottom': '6px',
                        'fontSize': '16px'
                    }),
                ], style={'textAlign': 'center'}),
                
                # Service components in a more visual list format
                html.Div([
                    html.Div([
                        html.Div([
                            html.I(className="fas fa-search", style={'color': COLORS['secondary'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Visual inspection of all components", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-chart-line", style={'color': COLORS['secondary'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Performance data analysis via IoT sensors", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-tint", style={'color': COLORS['secondary'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Water quality testing (TDS < 200 ppm)", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    ], style={'width': '48%'}),
                    html.Div([
                        html.Div([
                            html.I(className="fas fa-clipboard-check", style={'color': COLORS['secondary'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Media condition assessment", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-sliders-h", style={'color': COLORS['secondary'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Control system verification", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        html.Div([
                            html.I(className="fas fa-leaf", style={'color': COLORS['secondary'], 'marginRight': '8px', 'fontSize': '12px'}),
                            html.Span("Energy efficiency validation", style={'fontSize': '13px'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    ], style={'width': '48%'})
                ], style={'display': 'flex', 'justifyContent': 'space-between'}),
            ], style={
                'width': '48%', 
                'padding': '15px', 
                'backgroundColor': '#f8f9fa',
                'borderRadius': '8px',
                'boxShadow': '0 2px 5px rgba(0,0,0,0.1)',
                'border': f'1px solid {COLORS["neutral"]}'
            })
        ], style={'display': 'flex', 'justifyContent': 'space-between', 'gap': '20px', 'marginTop': '15px', 'marginBottom': '20px'}),
        
        # Conclusion with icon - modernized header style, left-aligned
        html.Div([
            html.Div([
                html.I(className="fas fa-flag-checkered", style={
                    'fontSize': '20px',
                    'color': 'white',
                    'backgroundColor': COLORS['primary'],
                    'padding': '10px',
                    'borderRadius': '50%',
                    'marginRight': '12px',
                    'display': 'inline-block'
                }),
                html.H3("7.2 Conclusion", style={
                    'color': COLORS['primary'], 
                    'margin': '0',
                    'fontSize': '17px'
                })
            ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '15px'}),
            
            html.P([
                "SEE-Tech Solutions' adiabatic cooling system offers a proven, cost-effective approach to optimize your chiller's performance and achieve significant energy savings. By implementing our solution, ",
                html.B(CLIENT_NAME), " will benefit from:"
            ], style={'fontSize': '15px', 'lineHeight': '1.5', 'marginBottom': '15px'}),
            
            # Benefits in a more visually appealing format with icons - modernized grid style
            html.Div([
                html.Div([
                    html.Div([
                        html.I(className="fas fa-bolt", style={
                            'color': COLORS['accent'],
                            'marginRight': '10px',
                            'fontSize': '16px'
                        }),
                        html.Span(f"Energy savings of {power_saving_pct:.1f}% on chiller power", style={'fontSize': '14px'})
                    ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    
                    html.Div([
                        html.I(className="fas fa-rupee-sign", style={
                            'color': COLORS['accent'],
                            'marginRight': '10px',
                            'fontSize': '16px'
                        }),
                        html.Span(f"Annual savings of {annual_monetary_saving:,.0f} rupees", style={'fontSize': '14px'})
                    ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    
                    html.Div([
                        html.I(className="fas fa-chart-line", style={
                            'color': COLORS['accent'],
                            'marginRight': '10px',
                            'fontSize': '16px'
                        }),
                        html.Span(f"ROI period of only {roi_period} months", style={'fontSize': '14px'})
                    ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'})
                ], style={'width': '48%'}),
                
                html.Div([
                    html.Div([
                        html.I(className="fas fa-leaf", style={
                            'color': COLORS['accent'],
                            'marginRight': '10px',
                            'fontSize': '16px'
                        }),
                        html.Span(f"Carbon footprint reduction of {annual_ghg_saving_tonnes:.1f} tonnes CO₂ annually", style={'fontSize': '14px'})
                    ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    
                    html.Div([
                        html.I(className="fas fa-clock", style={
                            'color': COLORS['accent'],
                            'marginRight': '10px',
                            'fontSize': '16px'
                        }),
                        html.Span("Extended equipment lifetime and improved reliability", style={'fontSize': '14px'})
                    ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                    
                    html.Div([
                        html.I(className="fas fa-headset", style={
                            'color': COLORS['accent'],
                            'marginRight': '10px',
                            'fontSize': '16px'
                        }),
                        html.Span("Ongoing technical support and optimization", style={'fontSize': '14px'})
                    ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'})
                ], style={'width': '48%'})
            ], style={
                'display': 'flex', 
                'justifyContent': 'space-between', 
                'backgroundColor': '#f8f9fa', 
                'padding': '15px', 
                'borderRadius': '8px',
                'border': f'1px solid {COLORS["neutral"]}',
                'boxShadow': '0 2px 5px rgba(0,0,0,0.1)',
                'marginBottom': '15px'
            }),
            
            html.Div([
                html.P([
                    "Our digital twin technology has validated these projections through detailed simulation of your specific system, and our IoT-enabled monitoring will ensure continuous optimization and verification of savings. ",
                    "We are confident that this solution will deliver exceptional value and look forward to partnering with you on this project."
                ], style={'fontSize': '15px', 'lineHeight': '1.5', 'marginBottom': '25px'})
                # Consultation button removed as requested
            ])
        ])
    ], style={'pageBreakInside': 'avoid'})

def create_expected_operating_parameters():
    """Create a table showing expected operating parameters before and after installation"""
    return html.Div([
        html.Table(
            # Header
            [html.Tr([
                html.Th("Parameter", style={'background': COLORS['primary'], 'color': 'white', 'padding': '6px', 'fontSize': '13px'}),
                html.Th("Before", style={'background': COLORS['primary'], 'color': 'white', 'padding': '6px', 'fontSize': '13px'}),
                html.Th("After", style={'background': COLORS['primary'], 'color': 'white', 'padding': '6px', 'fontSize': '13px'}),
                html.Th("Change", style={'background': COLORS['primary'], 'color': 'white', 'padding': '6px', 'fontSize': '13px'}),
            ])] + 
            # Rows
            [
                html.Tr([
                    html.Td("Condenser Temperature", style={'padding': '6px', 'fontWeight': 'bold', 'fontSize': '13px'}),
                    html.Td(f"{Tcond_act-273.15:.1f}°C", style={'padding': '6px', 'textAlign': 'center', 'fontSize': '13px'}),
                    html.Td(f"{Tcond_practical-273.15:.1f}°C", style={'padding': '6px', 'textAlign': 'center', 'fontSize': '13px'}),
                    html.Td(f"{-(Tcond_act-Tcond_practical):.1f}°C", style={'padding': '6px', 'textAlign': 'center', 'color': COLORS['accent'], 'fontSize': '13px'}),
                ]),
                html.Tr([
                    html.Td("System COP", style={'padding': '6px', 'fontWeight': 'bold', 'fontSize': '13px'}),
                    html.Td(f"{COP_act_calc:.2f}", style={'padding': '6px', 'textAlign': 'center', 'fontSize': '13px'}),
                    html.Td(f"{COP_practical:.2f}", style={'padding': '6px', 'textAlign': 'center', 'fontSize': '13px'}),
                    html.Td(f"+{(COP_practical-COP_act_calc):.2f}", style={'padding': '6px', 'textAlign': 'center', 'color': COLORS['accent'], 'fontSize': '13px'}),
                ]),
                html.Tr([
                    html.Td("Power Consumption", style={'padding': '6px', 'fontWeight': 'bold', 'fontSize': '13px'}),
                    html.Td(f"{210:.1f} kW", style={'padding': '6px', 'textAlign': 'center', 'fontSize': '13px'}),
                    html.Td(f"{210*(1-20/100):.1f} kW", style={'padding': '6px', 'textAlign': 'center', 'fontSize': '13px'}),
                    html.Td(f"{-20:.1f}%", style={'padding': '6px', 'textAlign': 'center', 'color': COLORS['accent'], 'fontSize': '13px'}),
                ])
            ],
            style={'width': '100%', 'borderCollapse': 'collapse', 'border': f'1px solid {COLORS["neutral"]}'}
        )
    ], style={'width': '100%', 'margin': 'auto', 'marginBottom': '5px', 'marginTop': '5px'})

def generate_print_css():
    """Generate the CSS for A4 page printing"""
    return """
/* Import Google Fonts - Enhanced selection with variable font weights */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

/* Base Typography */
body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #2D3B45;
    background-color: #f5f7fa;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: #0A435C;
}

p {
    margin-bottom: 1.2rem;
    font-size: 15px;
    color: #2D3B45;
}

/* Core A4 container rules with enhanced styling */
.a4-page-container {
    position: relative;
    width: 210mm;
    min-height: 297mm;
    height: auto;
    margin: 15mm auto;
    padding: 15mm 12mm;
    box-shadow: 0 10px 35px rgba(10, 67, 92, 0.12), 0 2px 10px rgba(10, 67, 92, 0.06);
    background-color: white;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 8px;
}

/* Screen-only guide with improved subtle styling */
@media screen {
    .a4-page-container::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        border: 1px dashed rgba(10, 67, 92, 0.15);
        pointer-events: none;
        border-radius: 8px;
    }
}

/* Print-specific adjustments to prevent browser headers/footers */
@page {
    size: A4;
    margin: 0;
}

@media print {
    body {
        margin: 0; 
        padding: 0; 
        background: white;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    /* Override any browser default headers/footers */
    @page {
        margin: 0;
        bleed: 0;
    }
    
    /* Ensure no browser-added content appears */
    html {
        margin: 0 !important;
        padding: 0 !important;
    }
    
    .a4-page-container {
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 10mm 12mm !important;
        box-shadow: none !important;
        border: none !important;
        page-break-after: always;
        overflow: hidden;
        border-radius: 0;
    }
    
    /* Hide any unwanted elements when printing */
    .print-control {
        display: none !important;
    }
    
    /* Ensure all backgrounds print */
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
}

/* Enhanced Typography Styles */
.section-header {
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 25px;
    font-weight: 600;
    color: #0A435C;
    font-size: 22px;
}

.section-header:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 70px;
    height: 4px;
    background: linear-gradient(to right, #0A435C, #1D7AA3);
    border-radius: 2px;
}

h3 {
    font-size: 18px;
    margin-top: 22px;
    margin-bottom: 12px;
    color: #1D7AA3;
}

h4 {
    font-size: 16px;
    color: #2E936E;
    margin-top: 18px;
    margin-bottom: 10px;
}

/* Modern Card Styles */
.card {
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(10, 67, 92, 0.08);
    border: 1px solid #D9E2EC;
    background-color: white;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    padding: 16px;
}

/* Cross-browser compatible card and shadow styles */
.card {
    border: 1px solid rgba(10, 67, 92, 0.15);  /* Fallback for box-shadow */
}

/* Fallbacks for browsers with limited box-shadow support */
.shadow-compat-light {
    box-shadow: 0 1px 3px rgba(10, 67, 92, 0.1);
    border: 1px solid rgba(10, 67, 92, 0.15);
}

.shadow-compat-medium {
    box-shadow: 0 2px 6px rgba(10, 67, 92, 0.12);
    border: 1px solid rgba(10, 67, 92, 0.15);
}

.shadow-compat-strong {
    box-shadow: 0 4px 12px rgba(10, 67, 92, 0.15);
    border: 1px solid rgba(10, 67, 92, 0.2);
}

/* Ensure smooth rendering in various browsers */
.card, .shadow-compat-light, .shadow-compat-medium, .shadow-compat-strong {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    transform: translateZ(0);
    perspective: 1000;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(10, 67, 92, 0.15);
}

.card-header {
    border-bottom: 1px solid #EDF2F7;
    padding-bottom: 12px;
    margin-bottom: 15px;
}

.card-title {
    font-weight: 600;
    margin: 0;
    color: #0A435C;
}

/* Professional Table Styling */
table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(10, 67, 92, 0.06);
    margin: 20px 0;
}

th {
    background: linear-gradient(135deg, #0A435C, #1D7AA3);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.5px;
    padding: 12px 15px;
}

td {
    padding: 10px 15px;
    font-size: 14px;
    border-bottom: 1px solid #EDF2F7;
}

/* For subtle zebra striping */
tr:nth-child(odd) {
    background-color: #F8FAFC;
}

tr:nth-child(even) {
    background-color: #EDF2F7;
}

/* Last row without bottom border */
tr:last-child td {
    border-bottom: none;
}

/* Button styles */
.btn {
    display: inline-block;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 15px;
    letter-spacing: 0.3px;
    text-align: center;
}

.btn-primary {
    background: linear-gradient(135deg, #0A435C, #1D7AA3);
    color: white;
    border: none;
    box-shadow: 0 3px 6px rgba(10, 67, 92, 0.2);
}

.btn-primary:hover {
    box-shadow: 0 5px 12px rgba(10, 67, 92, 0.3);
    transform: translateY(-2px);
}

/* List styling */
ul, ol {
    padding-left: 22px;
}

ul li, ol li {
    margin-bottom: 6px;
    line-height: 1.5;
}

/* Data metrics */
.metric-value {
    font-size: 20px;
    font-weight: 600;
    color: #0A435C;
    margin-bottom: 4px;
}

.metric-label {
    font-size: 13px;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Timeline styling */
.timeline-item {
    border: 1px solid #D9E2EC;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    background: linear-gradient(to bottom, #F8FAFC, #EDF2F7);
    box-shadow: 0 2px 6px rgba(10, 67, 92, 0.05);
}

/* Icons with circles */
.icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2E936E, #7CDBD5);
    color: white;
    margin-right: 12px;
}

/* Table of Contents specific styles */
.table-of-contents {
    padding: 20px 40px;
    font-size: 14px;
    color: #2D3B45;
    line-height: 1.6;
}

.table-of-contents h2 {
    margin-bottom: 25px;
    font-size: 24px;
    text-align: center;
    color: #0A435C;
}

.table-of-contents .section {
    display: flex;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px dotted #D9E2EC;
}

.table-of-contents .section:last-child {
    border-bottom: none;
}

.table-of-contents .section .number {
    width: 40px;
    font-weight: bold;
}

.table-of-contents .section .title {
    flex: 1;
    font-weight: bold;
}

.table-of-contents .section .page {
    margin-left: auto;
    text-align: right;
    min-width: 30px;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
    .table-of-contents {
        padding: 15px 20px;
    }

    .table-of-contents h2 {
        font-size: 20px;
    }

    .table-of-contents .section {
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 10px;
    }

    .table-of-contents .section .title {
        margin-bottom: 3px;
    }

    .table-of-contents .section .page {
        text-align: left;
        width: 100%;
    }
}

/* iOS-specific and PDF-friendly card styling */
.ios-pdf-friendly-card {
    border: 1px solid rgba(10, 67, 92, 0.15) !important;
    box-shadow: none !important;
    background-color: white !important; /* Ensure background is solid white */
}

/* Subtle border-based styling for depth instead of shadows */
.border-card {
    border: 1px solid #D9E2EC;
    border-bottom: 2px solid #D9E2EC;
    box-shadow: none;
}

/* Classes for iOS and PDF rendering - simplified visuals */
.pdf-friendly-shadow {
    box-shadow: none !important;
    border: 1px solid rgba(10, 67, 92, 0.15) !important;
}

.pdf-friendly-accent {
    border: 1px solid rgba(46, 147, 110, 0.3) !important;
    border-bottom: 2px solid rgba(46, 147, 110, 0.3) !important;
    box-shadow: none !important;
}

/* Enhanced printing optimizations */
@media print {
    /* Replace shadows with borders for better print rendering */
    [style*="box-shadow"] {
        box-shadow: none !important;
        border: 1px solid #D9E2EC !important;
    }
    
    /* Optimize SVG and images for print */
    img, svg {
        /* Ensure images don't get clipped in PDFs */
        overflow: visible !important;
        /* Force high-quality images in print */
        image-rendering: high-quality !important;
    }
    
    /* Force-disable problematic properties for PDF */
    .card, .shadow-compat-light, .shadow-compat-medium, .shadow-compat-strong {
        transform: none !important;
        perspective: none !important;
        backface-visibility: visible !important;
        -webkit-backface-visibility: visible !important;
    }
}

/* iOS and PDF-specific enhancements for better rendering */
@supports (-webkit-overflow-scrolling: touch) {
    /* Target iOS devices specifically */
    .card, .shadow-compat-light, .shadow-compat-medium, .shadow-compat-strong {
        box-shadow: none !important;
        border: 1px solid rgba(10, 67, 92, 0.15) !important;
    }
    
    /* Simplify graphics for better iOS compatibility */
    svg, img {
        filter: none !important;
        -webkit-filter: none !important;
    }
}

/* Fix for iPhone PDF rendering issues */
@media screen and (max-width: 480px), print {
    /* Simplified styles for small screens and print */
    [style*="box-shadow"] {
        box-shadow: none !important;
        border: 1px solid #D9E2EC !important;
    }
}
"""

def create_table_of_contents():
    """Create a table of contents page for the report."""
    return html.Div([
        html.H2("Table of Contents", style={
            'color': COLORS['primary'], 
            'marginTop': '20px',
            'marginBottom': '25px',
            'textAlign': 'center',
            'fontSize': '24px'
        }),
        
        # Section 1
        html.Div([
            html.Div("1.", style={'width': '40px', 'fontWeight': 'bold'}),
            html.Div("Executive Summary", style={'fontWeight': 'bold'})
        ], style={'display': 'flex', 'marginBottom': '15px', 'borderBottom': f'1px dotted {COLORS["neutral"]}', 'paddingBottom': '5px'}),
        
        # Section 2 with subsections
        html.Div([
            html.Div("2.", style={'width': '40px', 'fontWeight': 'bold'}),
            html.Div("Adiabatic Cooling Technology", style={'fontWeight': 'bold'})
        ], style={'display': 'flex', 'marginBottom': '10px'}),
        
        # Subsections with indent
        html.Div([
            html.Div("2.1", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Adiabatic Cooling Technology", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("2.2", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("System Components", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("2.3", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Expected Operating Parameters", style={})
        ], style={'display': 'flex', 'marginBottom': '15px', 'borderBottom': f'1px dotted {COLORS["neutral"]}', 'paddingBottom': '5px'}),
        
        # Section 3
        html.Div([
            html.Div("3.", style={'width': '40px', 'fontWeight': 'bold'}),
            html.Div("Technical Analysis", style={'fontWeight': 'bold'})
        ], style={'display': 'flex', 'marginBottom': '10px'}),
        
        html.Div([
            html.Div("3.1", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("P-H Chart Visualization", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("3.2", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Energy Savings Analysis", style={})
        ], style={'display': 'flex', 'marginBottom': '15px', 'borderBottom': f'1px dotted {COLORS["neutral"]}', 'paddingBottom': '5px'}),
        
        # Section 4
        html.Div([
            html.Div("4.", style={'width': '40px', 'fontWeight': 'bold'}),
            html.Div("Financial Analysis", style={'fontWeight': 'bold'})
        ], style={'display': 'flex', 'marginBottom': '10px'}),
        
        html.Div([
            html.Div("4.1", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Cost Benefit Summary", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("4.2", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Life Cycle Cost Analysis", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("4.3", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Return on Investment Analysis", style={})
        ], style={'display': 'flex', 'marginBottom': '15px', 'borderBottom': f'1px dotted {COLORS["neutral"]}', 'paddingBottom': '5px'}),
        
        # Section 5
        html.Div([
            html.Div("5.", style={'width': '40px', 'fontWeight': 'bold'}),
            html.Div("Environmental Impact", style={'fontWeight': 'bold'})
        ], style={'display': 'flex', 'marginBottom': '10px'}),
        
        html.Div([
            html.Div("5.1", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Carbon Footprint Reduction", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("5.2", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Sustainability Benefits", style={})
        ], style={'display': 'flex', 'marginBottom': '15px', 'borderBottom': f'1px dotted {COLORS["neutral"]}', 'paddingBottom': '5px'}),
        
        # Section 6
        html.Div([
            html.Div("6.", style={'width': '40px', 'fontWeight': 'bold'}),
            html.Div("Implementation", style={'fontWeight': 'bold'})
        ], style={'display': 'flex', 'marginBottom': '10px'}),
        
        html.Div([
            html.Div("6.1", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Project Timeline", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("6.2", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Installation Process", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("6.3", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Your Project Team", style={})
        ], style={'display': 'flex', 'marginBottom': '15px', 'borderBottom': f'1px dotted {COLORS["neutral"]}', 'paddingBottom': '5px'}),
        
        # Section 7
        html.Div([
            html.Div("7.", style={'width': '40px', 'fontWeight': 'bold'}),
            html.Div("Maintenance Service & Conclusion", style={'fontWeight': 'bold'})
        ], style={'display': 'flex', 'marginBottom': '10px'}),
        
        html.Div([
            html.Div("7.1", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("SEE-Tech Professional Maintenance Program", style={})
        ], style={'display': 'flex', 'marginBottom': '8px'}),
        
        html.Div([
            html.Div("7.2", style={'width': '40px', 'paddingLeft': '20px'}),
            html.Div("Conclusion", style={})
        ], style={'display': 'flex', 'marginBottom': '15px', 'borderBottom': f'1px dotted {COLORS["neutral"]}', 'paddingBottom': '5px'})
    ], style={
        'padding': '20px 40px',
        'fontSize': '14px',
        'color': COLORS['text'],
        'lineHeight': '1.4'
    })

def ensure_pdf_compatibility(content, is_card=False):
    """
    Wrap content with iOS and PDF-friendly styling to ensure compatibility
    when printing or viewing on iOS devices.
    
    Args:
        content: The Dash component to wrap
        is_card: Whether this content should be styled as a card
        
    Returns:
        Dash component with PDF-friendly styling added
    """
    wrapper_class = 'ios-pdf-friendly-card' if is_card else 'pdf-friendly-shadow'
    
    return html.Div(
        content,
        className=wrapper_class,
        style={
            # Inline styles that help with iOS PDF rendering
            'transform': 'none',
            'overflow': 'visible',
            'page-break-inside': 'avoid'
        }
    )
