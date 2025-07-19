"""
Main application for the adiabatic cooling proposal generator.

This script generates a professional static proposal report for adiabatic cooling system
using the refrigeration cycle data from our dashboard.
"""

import pandas as pd
from dash import Dash, html, dcc, dash_table, Input, Output, clientside_callback

# Import our modules
from data.constants import *
from calculations.business_logic import calculate_results, format_indian_number
from components.charts import (
    create_savings_pie, create_power_comparison_chart, 
    create_temperature_comparison, create_roi_chart
)
from components.layout import (
    create_ph_chart_explanation, create_a4_page_container, 
    create_maintenance_section, create_expected_operating_parameters,
    generate_print_css, create_table_of_contents, ensure_pdf_compatibility
)

def generate_report():
    """Generate the proposal report as a static Dash application"""
    # Force reload of constants to ensure we have the latest values
    import importlib
    import sys
    
    # Force reload of the constants module to get updated values
    if "data.constants" in sys.modules:
        importlib.reload(sys.modules["data.constants"])
    
    # Import the constants at the module level - we don't use them directly here
    
    # Create the Dash app with hot-reloading enabled
    app = Dash(__name__, suppress_callback_exceptions=True)
    
    # We need to re-import the business_logic module as well to ensure it gets the latest constants
    # Use importlib to reload the module
    if "calculations.business_logic" in sys.modules:
        importlib.reload(sys.modules["calculations.business_logic"])
    
    # Import fresh calculation function
    from calculations.business_logic import calculate_results
    
    # Calculate results for the proposal with the updated constants
    results = calculate_results()
    
    # Extract key values from results
    power_saving_pct = results["power_saving_pct"]
    annual_energy_saving_kwh = results["annual_energy_saving_kwh"]
    annual_monetary_saving = results["annual_monetary_saving"]
    annual_water_consumption = results["annual_water_consumption"]
    annual_water_cost = results["annual_water_cost"]
    annual_maintenance_cost = results["annual_maintenance_cost"]
    total_annual_operating_cost = results["total_annual_operating_cost"]
    net_annual_savings = results["net_annual_savings"]
    roi_period = results["roi_period"]
    lcc_table = results["lcc_table"]
    lcc_summary = results["lcc_summary"]
    npv = results["npv"]
    annual_ghg_saving_kg = results["annual_ghg_saving_kg"]
    annual_ghg_saving_tonnes = results["annual_ghg_saving_tonnes"]
    summary_data = results["summary_data"]
    environmental_data = results["environmental_data"]
    temp_reduction_text = results["temp_reduction_text"]
    
    # Create figures
    savings_pie_fig = create_savings_pie(
        annual_monetary_saving, annual_water_cost, 
        annual_maintenance_cost, net_annual_savings
    )
    roi_chart_fig = create_roi_chart(lcc_table)
    power_comparison_fig = create_power_comparison_chart(power_saving_pct, INITIAL_POWER_KW)
    temperature_comparison_fig = create_temperature_comparison()
    
    # Add clientside callback for print functionality
    clientside_callback(
        """
        function(n_clicks) {
            if (n_clicks) {
                window.print();
            }
            return window.dash_clientside.no_update;
        }
        """,
        Output("print-button", "n_clicks"),
        Input("print-button", "n_clicks"),
        prevent_initial_call=True
    )
    
    # JavaScript for print settings
    print_js = """
    // Configure print settings
    @page {
        size: A4;
        margin: 0;
    }
    """
    
    # Professional app layout with proper spacing for A4 page printing
    # Instead of html.Style which doesn't exist, include CSS in the app's index_string
    app.index_string = '''
    <!DOCTYPE html>
    <html>
        <head>
            {%metas%}
            <title>Adiabatic Cooling System Proposal</title>
            {%favicon%}
            {%css%}
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
            <script>
            ''' + print_js + '''
            </script>
            <style>
                ''' + generate_print_css() + '''
                /* Global print settings */
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
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Ensure no browser-added content appears */
                    html {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .a4-page-container { margin: 0 auto !important; padding: 15mm 10mm !important; }
                    table, figure { page-break-inside: avoid; }
                }
                 .document-section {
                     margin-bottom: 30px;
                 }
                 .section-header {
                     color: #2c3e50;
                     border-bottom: 2px solid #3498db;
                     padding-bottom: 8px;
                     font-weight: bold;
                 }
                 .timeline-container {
                     display: flex;
                     justify-content: space-between;
                     margin-top: 20px;
                     flex-wrap: wrap;
                 }
                 .timeline-item {
                     border: 1px solid #3498db;
                     border-radius: 5px;
                     padding: 15px;
                     margin-bottom: 10px;
                     width: 18%;
                     text-align: center;
                     background-color: #f8f9fa;
                 }
                 .timeline-phase {
                     color: #3498db;
                     font-weight: bold;
                     margin: 0;
                 }
                 .timeline-title {
                     font-weight: bold;
                     margin: 5px 0;
                 }
                 .timeline-period {
                     color: #666;
                     margin: 0;
                     font-size: 0.9em;
                 }
                 .benefit-item {
                     margin-bottom: 10px;
                 }
            </style>
        </head>
        <body>
            {%app_entry%}
            <footer>
                {%config%}
                {%scripts%}
                {%renderer%}
            </footer>
        </body>    </html>    '''
    
    # Define complete app layout with all pages
    app.layout = html.Div([
        # COVER PAGE
        create_a4_page_container([
            # Header with logo and print button
            html.Div([
                html.Div([
                    html.Img(src='assets/seetech_logo.jpeg', style={
                        'height': '130px'
                    })
                ], style={'display': 'inline-block'}),
                html.Button("Print Report", id="print-button", className='print-control',
                           style={
                               'float': 'right', 
                               'padding': '12px 24px', 
                               'backgroundColor': COLORS['primary'], 
                               'color': 'white', 
                               'border': 'none', 
                               'borderRadius': '6px', 
                               'cursor': 'pointer',
                               'fontWeight': '500',
                               'fontSize': '15px',
                               'boxShadow': '0 2px 8px rgba(26, 82, 118, 0.3)',
                               'transition': 'all 0.3s ease'
                           })
            ], style={'textAlign': 'center', 'marginBottom': '30px', 'paddingTop': '15px'}),
            
            # No divider line per request
            
            # Premium report title with enhanced modern styling
            html.Div([
                # No snowflake icon per request
                
                html.H1("Adiabatic Cooling System", style={
                    'margin': '0', 
                    'color': COLORS['primary'], 
                    'fontSize': '34px', 
                    'letterSpacing': '-0.02em',
                    'fontWeight': '700',
                    'textShadow': '0 1px 2px rgba(0,0,0,0.05)'
                }),
                html.H2(f"for {CHILLER_CAPACITY_TR} TR", style={
                    'margin': '10px 0', 
                    'color': COLORS['secondary'], 
                    'fontSize': '24px', 
                    'fontWeight': '500',
                    'letterSpacing': '-0.01em'
                }),
                # Modern gradient bar
                html.Div(style={
                    'width': '80px', 
                    'height': '4px', 
                    'background': f'linear-gradient(to right, {COLORS["accent_gradient_start"]}, {COLORS["accent_gradient_end"]})', 
                    'margin': '15px auto',
                    'borderRadius': '2px'
                }),
                html.H3(f"{CLIENT_NAME}", style={
                    'margin': '15px 0 5px', 
                    'color': COLORS['text'], 
                    'fontSize': '22px',
                    'fontWeight': '600'
                }),
                html.H3(f"{CLIENT_LOCATION}", style={
                    'margin': '5px 0', 
                    'color': COLORS['muted_text'], 
                    'fontSize': '18px',
                    'fontWeight': '400'
                })
            ], style={'textAlign': 'center', 'marginBottom': '30px'}),
            
            # Digital Twin and IoT section - premium modern design with enhanced cards and icons
            html.Div([
                # Modern stylish heading with accented badge
                html.Div([
                    html.Div(style={
                        'display': 'inline-block',
                        'background': f'linear-gradient(135deg, {COLORS["accent_gradient_start"]}, {COLORS["accent_gradient_end"]})',
                        'padding': '4px 12px',
                        'borderRadius': '16px',
                        'boxShadow': '0 2px 6px rgba(46, 147, 110, 0.2)',
                        'marginBottom': '10px'
                    }, children=[
                        html.Span("INTELLIGENT SOLUTION", style={
                            'color': 'white',
                            'fontSize': '12px',
                            'fontWeight': '600',
                            'letterSpacing': '0.5px'
                        })
                    ]),
                    html.H4("Powered by Advanced Technology", style={
                        'color': COLORS['primary'], 
                        'textAlign': 'center', 
                        'marginBottom': '8px',
                        'fontSize': '20px',
                        'fontWeight': '600'
                    }),
                    html.P("Harnessing cutting-edge engineering and smart systems to optimize efficiency", style={
                        'color': COLORS['muted_text'],
                        'fontSize': '14px',
                        'maxWidth': '600px',
                        'margin': '0 auto 20px',
                        'lineHeight': '1.4'
                    })
                ], style={'textAlign': 'center'}),
                
                # Premium technology cards with enhanced styling and icons
                html.Div([
                    # Digital Twin card with glass morphism effect
                    html.Div([
                        # Modern hexagonal icon with gradient
                        html.Div(style={
                            'background': f'linear-gradient(135deg, {COLORS["primary"]}, {COLORS["secondary"]})',
                            'width': '50px',
                            'height': '50px',
                            'borderRadius': '12px',
                            'display': 'flex',
                            'alignItems': 'center',
                            'justifyContent': 'center',
                            'margin': '0 auto 15px',
                            'boxShadow': '0 4px 10px rgba(10, 67, 92, 0.25)',
                            'transform': 'rotate(45deg)'
                        }, children=[
                            html.I(className="fas fa-project-diagram", style={
                                'fontSize': '24px', 
                                'color': 'white',
                                'transform': 'rotate(-45deg)'
                            })
                        ]),
                        
                        html.H4("Digital Twin Technology", style={
                            'color': COLORS['primary'],
                            'textAlign': 'center',
                            'marginBottom': '8px',
                            'fontSize': '18px',
                            'fontWeight': '600'
                        }),
                        
                        html.P("Our solution leverages digital twin technology to simulate and optimize system performance before implementation, ensuring maximum efficiency.", 
                            style={
                                'fontSize': '13px', 
                                'lineHeight': '1.4',
                                'color': COLORS['muted_text'],
                                'textAlign': 'center',
                                'padding': '0 10px'
                            }
                        ),
                        # Feature badges
                        html.Div([
                            html.Span("Real-time", style={
                                'display': 'inline-block',
                                'background': f'rgba(46, 147, 110, 0.1)',
                                'color': COLORS['accent'],
                                'padding': '3px 8px',
                                'borderRadius': '10px',
                                'fontSize': '11px',
                                'fontWeight': '500',
                                'margin': '3px'
                            }),
                            html.Span("Predictive", style={
                                'display': 'inline-block',
                                'background': f'rgba(46, 147, 110, 0.1)',
                                'color': COLORS['accent'],
                                'padding': '3px 8px',
                                'borderRadius': '10px',
                                'fontSize': '11px',
                                'fontWeight': '500',
                                'margin': '3px'
                            })
                        ], style={'marginTop': '10px', 'textAlign': 'center'})
                    ], className="card", style={
                        'width': '48%', 
                        'padding': '20px 10px',
                        'backgroundColor': 'white',
                        'boxShadow': COLORS['card_shadow'],
                        'borderRadius': '8px',
                        'border': f'1px solid {COLORS["border"]}',
                        'height': '100%'
                    }),
                    
                    # IoT card with consistent styling
                    html.Div([
                        # Modern hexagonal icon with gradient (same style as above)
                        html.Div(style={
                            'background': f'linear-gradient(135deg, {COLORS["accent_gradient_start"]}, {COLORS["accent_gradient_end"]})',
                            'width': '50px',
                            'height': '50px',
                            'borderRadius': '12px',
                            'display': 'flex',
                            'alignItems': 'center',
                            'justifyContent': 'center',
                            'margin': '0 auto 15px',
                            'boxShadow': '0 4px 10px rgba(46, 147, 110, 0.25)',
                            'transform': 'rotate(45deg)'
                        }, children=[
                            html.I(className="fas fa-wifi", style={
                                'fontSize': '24px', 
                                'color': 'white',
                                'transform': 'rotate(-45deg)'
                            })
                        ]),
                        
                        html.H4("IoT-Enabled Monitoring", style={
                            'color': COLORS['primary'],
                            'textAlign': 'center',
                            'marginBottom': '8px',
                            'fontSize': '18px',
                            'fontWeight': '600'
                        }),
                        
                        html.P("Real-time data collection and analysis through IoT sensors for performance optimization and predictive maintenance.", 
                            style={
                                'fontSize': '13px', 
                                'lineHeight': '1.4',
                                'color': COLORS['muted_text'],
                                'textAlign': 'center',
                                'padding': '0 10px'
                            }
                        ),
                        # Feature badges 
                        html.Div([
                            html.Span("Smart Control", style={
                                'display': 'inline-block',
                                'background': f'rgba(29, 122, 163, 0.1)',
                                'color': COLORS['secondary'],
                                'padding': '3px 8px',
                                'borderRadius': '10px',
                                'fontSize': '11px',
                                'fontWeight': '500',
                                'margin': '3px'
                            }),
                            html.Span("Cloud Connected", style={
                                'display': 'inline-block',
                                'background': f'rgba(29, 122, 163, 0.1)',
                                'color': COLORS['secondary'],
                                'padding': '3px 8px',
                                'borderRadius': '10px',
                                'fontSize': '11px',
                                'fontWeight': '500',
                                'margin': '3px'
                            })
                        ], style={'marginTop': '10px', 'textAlign': 'center'})
                    ], className="card", style={
                        'width': '48%', 
                        'padding': '20px 10px',
                        'backgroundColor': 'white',
                        'boxShadow': COLORS['card_shadow'],
                        'borderRadius': '8px',
                        'border': f'1px solid {COLORS["border"]}',
                        'height': '100%'
                    })
                ], style={
                    'display': 'flex', 
                    'justifyContent': 'space-between', 
                    'margin': '0 auto 30px auto', 
                    'maxWidth': '92%',
                    'gap': '15px'
                }),
                
                # Document info with premium luxury styling
                html.Div([
                    # Decorative line element - now gradient
                    html.Div(style={
                        'width': '30px',
                        'height': '2px',
                        'background': f'linear-gradient(to right, {COLORS["accent_gradient_start"]}, {COLORS["accent_gradient_end"]})',
                        'marginBottom': '12px',
                        'marginLeft': 'auto',
                        'borderRadius': '1px'
                    }),
                    html.P(f"Prepared for: {CLIENT_NAME}", style={
                        'margin': '3px 0', 
                        'fontWeight': '500', 
                        'fontSize': '14px',
                        'color': COLORS['primary']
                    }),
                    html.P(f"Date: {REPORT_DATE}", style={
                        'margin': '3px 0',
                        'fontSize': '13px',
                        'color': COLORS['text']
                    }),
                    html.P("Note: This proposal is generated by the system with detailed energy calculations and technical analysis.", style={
                        'margin': '3px 0',
                        'fontSize': '13px',
                        'color': COLORS['text'],
                        'fontStyle': 'italic'
                    })
                ], style={
                    'textAlign': 'right', 
                    'marginTop': '20px', 
                    'paddingRight': '15px',
                    'paddingTop': '10px',
                    'borderTop': f'1px solid {COLORS["border"]}',
                })
            ], style={'marginTop': '15px'})
        ]),
        
        # TABLE OF CONTENTS PAGE
        create_a4_page_container(create_table_of_contents()),
        
        # EXECUTIVE SUMMARY PAGE
        create_a4_page_container([
            # Executive Summary with reduced top margin
            html.H2("1. Executive Summary", className='section-header', style={'marginTop': '5px'}),
            html.P([
                f"{CLIENT_NAME}'s ", html.B("255 TR air-cooled chiller"), " currently operates with an average power consumption of ",
                html.B("210 kW"), ". Our analysis using digital twin technology reveals an opportunity to substantially reduce energy consumption through ",
                html.B("adiabatic cooling"), " technology."
            ], style={'fontSize': '16px', 'lineHeight': '1.5', 'marginBottom': '15px', 'marginTop': '12px'}),
            
            html.P([
                "Our proposal recommends installing an ", html.B("SEE-Tech Adiabatic Cooling System"), " to reduce condenser temperature by ",
                html.B(temp_reduction_text), ". Our digital twin technology has validated these projections through detailed simulation of your specific system, and our ",
                html.B("IoT-enabled monitoring"), " will ensure continuous optimization and verification of savings."
            ], style={'fontSize': '15px', 'lineHeight': '1.5', 'marginBottom': '15px'}),
            
            html.P([
                "The implementation of this system is projected to deliver:"
            ], style={'fontSize': '15px', 'marginBottom': '8px'}),
            
            # Key results in a more compact table
            dash_table.DataTable(
                data=summary_data.to_dict('records'),
                columns=[{"name": i, "id": i} for i in summary_data.columns],
                style_header={
                    'backgroundColor': COLORS['primary'],
                    'color': 'white',
                    'fontWeight': 'bold',
                    'border': f'1px solid {COLORS["primary"]}',
                    'padding': '10px',
                    'paddingLeft': '12px',
                    'fontSize': '14px',
                    'height': '38px'
                },
                style_cell={
                    'textAlign': 'left',
                    'padding': '8px 12px',
                    'border': f'1px solid {COLORS["neutral"]}',
                    'fontSize': '14px',
                    'height': '32px'
                },
                style_data_conditional=[
                    {
                        'if': {'row_index': 'odd'},
                        'backgroundColor': COLORS['neutral']
                    }
                ],
                style_table={'width': '100%', 'marginBottom': '20px'},
            ),
            
            html.P([
                "The system's performance has been validated through detailed engineering analysis and digital twin simulation, ensuring accurate projections and minimal risk. SEE-Tech Solutions also offers a comprehensive maintenance package to ensure continued optimal performance."
            ], style={'fontSize': '15px', 'lineHeight': '1.5', 'marginBottom': '15px'})
        ]),
        
        # SYSTEM DESCRIPTION PAGE
        create_a4_page_container([
            html.H2("2. System Description", className='section-header'),
            
            html.H3("2.1 Adiabatic Cooling Technology", style={'color': COLORS['primary'], 'marginTop': '20px'}),
            html.P([
                "Adiabatic cooling is an energy-efficient method that leverages evaporative cooling principles to reduce the temperature of air entering the condenser. This technology works on the principle that when water evaporates, it absorbs heat from the surrounding air, effectively lowering its temperature."
            ], style={'fontSize': '16px', 'lineHeight': '1.6', 'marginBottom': '20px'}),
            
            html.P([
                "For refrigeration systems, this means:"
            ], style={'fontSize': '16px', 'marginBottom': '10px'}),
            
            html.Ul([
                html.Li("Lower condenser inlet air temperature", style={'fontSize': '15px', 'marginBottom': '10px'}),
                html.Li("Reduced condensing pressure", style={'fontSize': '15px', 'marginBottom': '10px'}),
                html.Li("Decreased compressor work", style={'fontSize': '15px', 'marginBottom': '10px'}),
                html.Li("Improved system Coefficient of Performance (COP)", style={'fontSize': '15px', 'marginBottom': '10px'}),
                html.Li("Significant energy savings", style={'fontSize': '15px', 'marginBottom': '10px'})
            ], style={'marginLeft': '30px', 'marginBottom': '30px'}),
            
            html.H3("2.2 System Components", style={'color': COLORS['primary'], 'marginTop': '30px', 'marginBottom': '20px'}),
            
            html.P("Our adiabatic cooling system consists of the following high-quality components designed for maximum efficiency and durability:", 
                   style={'fontSize': '16px', 'lineHeight': '1.5', 'marginBottom': '15px'}),
            
            # Component cards in a grid layout
            html.Div([
                # Media Pads
                html.Div([
                    html.Div([
                        # Header with icon and title inline
                        html.Div([
                            # Icon placeholder (circle with icon)
                            html.Div(html.Span("🌊", style={'fontSize': '24px'}), 
                                  style={'backgroundColor': COLORS['secondary'], 'color': 'white', 
                                        'borderRadius': '50%', 'width': '40px', 'height': '40px', 
                                        'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center',
                                        'marginRight': '15px'}),
                            # Title next to icon
                            html.H4("Media Pads", style={'fontSize': '18px', 'color': COLORS['secondary'], 'margin': '0', 'display': 'flex', 'alignItems': 'center'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '12px'}),
                        html.P("High-efficiency cellulose pads with cross-fluted design for optimal water distribution and air contact", 
                              style={'fontSize': '15px', 'lineHeight': '1.4', 'marginBottom': '8px', 'marginTop': '8px'}),
                        html.Ul([
                            html.Li("Cross-fluted design", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Long lifespan material", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Maximum cooling efficiency", style={'fontSize': '14px'})
                        ], style={'paddingLeft': '20px', 'marginTop': '8px', 'color': COLORS['text'], 'marginBottom': '0'})
                    ], style={'padding': '15px'})
                ], style={'width': '48%', 'backgroundColor': '#ffffff', 'borderRadius': '8px', 
                          'boxShadow': '0 2px 5px rgba(0,0,0,0.1)', 'marginBottom': '15px',
                          'border': f'1px solid {COLORS["neutral"]}'}),
                
                # Water Distribution System
                html.Div([
                    html.Div([
                        # Header with icon and title inline
                        html.Div([
                            # Icon placeholder
                            html.Div(html.Span("💧", style={'fontSize': '24px'}), 
                                  style={'backgroundColor': COLORS['secondary'], 'color': 'white', 
                                        'borderRadius': '50%', 'width': '40px', 'height': '40px', 
                                        'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center',
                                        'marginRight': '15px'}),
                            # Title next to icon
                            html.H4("Water Distribution System", style={'fontSize': '18px', 'color': COLORS['secondary'], 'margin': '0', 'display': 'flex', 'alignItems': 'center'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '12px'}),
                        html.P("Precision-engineered water delivery with efficient distribution headers and flow control mechanisms", 
                              style={'fontSize': '15px', 'lineHeight': '1.4', 'marginBottom': '8px', 'marginTop': '8px'}),
                        html.Ul([
                            html.Li("Uniform water distribution", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Stainless steel construction", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Low-pressure operation", style={'fontSize': '14px'})
                        ], style={'paddingLeft': '20px', 'marginTop': '8px', 'color': COLORS['text'], 'marginBottom': '0'})
                    ], style={'padding': '15px'})
                ], style={'width': '48%', 'backgroundColor': '#ffffff', 'borderRadius': '8px', 
                          'boxShadow': '0 2px 5px rgba(0,0,0,0.1)', 'marginBottom': '15px',
                          'border': f'1px solid {COLORS["neutral"]}'}),
                
                # Control System
                html.Div([
                    html.Div([
                        # Header with icon and title inline
                        html.Div([
                            # Icon placeholder
                            html.Div(html.Span("🔧", style={'fontSize': '24px'}), 
                                  style={'backgroundColor': COLORS['secondary'], 'color': 'white', 
                                        'borderRadius': '50%', 'width': '40px', 'height': '40px', 
                                        'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center',
                                        'marginRight': '15px'}),
                            # Title next to icon
                            html.H4("Control System", style={'fontSize': '18px', 'color': COLORS['secondary'], 'margin': '0', 'display': 'flex', 'alignItems': 'center'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '12px'}),
                        html.P("Advanced IoT-enabled controls for intelligent operation based on ambient conditions and system demand", 
                              style={'fontSize': '15px', 'lineHeight': '1.4', 'marginBottom': '8px', 'marginTop': '8px'}),
                        html.Ul([
                            html.Li("Remote monitoring capability", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Adaptive control algorithms", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Predictive maintenance alerts", style={'fontSize': '14px'})
                        ], style={'paddingLeft': '20px', 'marginTop': '8px', 'color': COLORS['text'], 'marginBottom': '0'})
                    ], style={'padding': '15px'})
                ], style={'width': '48%', 'backgroundColor': '#ffffff', 'borderRadius': '8px', 
                          'boxShadow': '0 2px 5px rgba(0,0,0,0.1)', 'marginBottom': '15px',
                          'border': f'1px solid {COLORS["neutral"]}'}),
                
                # Water Treatment
                html.Div([
                    html.Div([
                        # Header with icon and title inline
                        html.Div([
                            # Icon placeholder
                            html.Div(html.Span("🧪", style={'fontSize': '24px'}), 
                                  style={'backgroundColor': COLORS['secondary'], 'color': 'white', 
                                        'borderRadius': '50%', 'width': '40px', 'height': '40px', 
                                        'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center',
                                        'marginRight': '15px'}),
                            # Title next to icon
                            html.H4("Water Treatment", style={'fontSize': '18px', 'color': COLORS['secondary'], 'margin': '0', 'display': 'flex', 'alignItems': 'center'})
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '12px'}),
                        html.P("Integrated water conditioning system to maintain optimal TDS levels (<200 ppm) and prevent scaling", 
                              style={'fontSize': '15px', 'lineHeight': '1.4', 'marginBottom': '8px', 'marginTop': '8px'}),
                        html.Ul([
                            html.Li("Automatic bleed-off system", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Anti-scaling technology", style={'fontSize': '14px', 'marginBottom': '5px'}),
                            html.Li("Water quality monitoring", style={'fontSize': '14px'})
                        ], style={'paddingLeft': '20px', 'marginTop': '8px', 'color': COLORS['text'], 'marginBottom': '0'})
                    ], style={'padding': '15px'})
                ], style={'width': '48%', 'backgroundColor': '#ffffff', 'borderRadius': '8px', 
                          'boxShadow': '0 2px 5px rgba(0,0,0,0.1)', 'marginBottom': '15px',
                          'border': f'1px solid {COLORS["neutral"]}'})
            ], style={'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'space-between', 'marginBottom': '30px'}),
            
        ]),
        
        # OPERATING PARAMETERS PAGE (New page 4)
        create_a4_page_container([
            html.H3("2.3 Expected Operating Parameters", style={'color': COLORS['primary'], 'marginTop': '10px'}),
            html.P("The following table outlines the key system parameters before and after adiabatic cooling implementation, highlighting the significant improvements in operating conditions:", 
                  style={'fontSize': '14px', 'marginTop': '5px', 'marginBottom': '10px'}),
            create_expected_operating_parameters(),
            
            html.Div([
                dcc.Graph(figure=temperature_comparison_fig[0], config={'displayModeBar': False}, 
                         style={'width': '48%', 'display': 'inline-block', 'height': '200px'}),
                dcc.Graph(figure=temperature_comparison_fig[1], config={'displayModeBar': False}, 
                         style={'width': '48%', 'display': 'inline-block', 'height': '200px'})
            ], style={'marginTop': '5px', 'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '5px'}),
            
            # Added Technical Analysis heading and initial P-H chart text
            html.H2("3. Technical Analysis", className='section-header', style={'marginTop': '10px'}),
            html.H3("P-H Chart Analysis", style={'color': COLORS['primary'], 'marginTop': '8px'}),
            html.P("The pressure-enthalpy (P-H) diagram below illustrates the refrigeration cycles under different operating conditions and demonstrates the impact of our proposed adiabatic cooling system:", 
               style={'marginBottom': '20px', 'fontSize': '16px'}),
            
            # Refrigeration Cycle Comparison table 
            html.H4("Refrigeration Cycle Comparison", style={'marginTop': '20px', 'color': COLORS['primary']}),
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
            ], style={'width': '100%', 'borderCollapse': 'collapse', 'border': f'1px solid {COLORS["neutral"]}', 'margin': '20px 0', 'fontSize': '15px'})
        ]),
        
        # P-H CHART PAGE
        create_a4_page_container([
            # P-H Chart Continuation - including the image and degradation zone significance
            html.H3("3.1 P-H Chart Visualization", style={'color': COLORS['primary'], 'marginTop': '5px'}),
            html.Img(src='assets/refrigeration_cycle.png', style={'width': '100%', 'maxWidth': '800px', 'margin': '10px auto', 'display': 'block', 'border': f'1px solid {COLORS["neutral"]}'}),
            
            html.H4("Degradation Zone Significance", style={'marginTop': '15px', 'color': COLORS['primary']}),
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
        ]),
        
        # ENERGY SAVINGS ANALYSIS AND FINANCIAL SUMMARY PAGE
        create_a4_page_container([
            html.H3("3.2 Energy Savings Analysis", style={'color': COLORS['primary'], 'marginTop': '10px'}),
            html.P([
                "Our analysis shows that by implementing the adiabatic cooling system, we can achieve a significant reduction in power consumption:",
            ], style={'fontSize': '15px', 'lineHeight': '1.5', 'marginBottom': '10px'}),
            
            # Power consumption chart - slightly less compact
            html.Div([
                dcc.Graph(figure=power_comparison_fig, config={'displayModeBar': False}, 
                         style={'height': '310px'})
            ], style={'marginBottom': '10px', 'marginTop': '5px'}),
            
            html.P([
                f"The {power_saving_pct:.1f}% reduction in power consumption translates to annual energy savings of {annual_energy_saving_kwh:,.0f} kWh, resulting in monetary savings of {format_indian_number(annual_monetary_saving, True)}/year."
            ], style={'fontSize': '15px', 'lineHeight': '1.5', 'marginBottom': '15px'}),
            
            # Financial Analysis section starts on same page
            html.H2("4. Financial Analysis", className='section-header', style={'marginTop': '5px', 'paddingTop': '5px'}),
            
            html.H3("4.1 Cost Benefit Summary", style={'color': COLORS['primary'], 'marginTop': '10px'}),
            
            html.Div([
                html.Div([
                    html.Table([
                        html.Tr([html.Th("Item", colSpan=2, style={'backgroundColor': COLORS['primary'], 'color': 'white', 'padding': '8px', 'fontSize': '14px'})]),
                        html.Tr([
                            html.Td("Project Cost", style={'padding': '8px', 'fontWeight': 'bold', 'fontSize': '14px'}),
                            html.Td(format_indian_number(PROJECT_COST), style={'padding': '8px', 'textAlign': 'right', 'fontSize': '14px'})
                        ]),
                        html.Tr([
                            html.Td("Annual Electricity Savings", style={'padding': '8px', 'fontWeight': 'bold', 'backgroundColor': COLORS['neutral'], 'fontSize': '14px'}),
                            html.Td(format_indian_number(annual_monetary_saving), style={'padding': '8px', 'textAlign': 'right', 'backgroundColor': COLORS['neutral'], 'color': COLORS['accent'], 'fontSize': '14px'})
                        ]),
                        html.Tr([
                            html.Td("Annual Water Cost", style={'padding': '8px', 'fontWeight': 'bold', 'fontSize': '14px'}),
                            html.Td(format_indian_number(annual_water_cost), style={'padding': '8px', 'textAlign': 'right', 'color': COLORS['warning'], 'fontSize': '14px'})
                        ]),
                        html.Tr([
                            html.Td("Annual Maintenance Cost", style={'padding': '8px', 'fontWeight': 'bold', 'backgroundColor': COLORS['neutral'], 'fontSize': '14px'}),
                            html.Td(format_indian_number(annual_maintenance_cost), style={'padding': '8px', 'textAlign': 'right', 'backgroundColor': COLORS['neutral'], 'color': COLORS['warning'], 'fontSize': '14px'})
                        ]),
                        html.Tr([
                            html.Td("Net Annual Savings", style={'padding': '8px', 'fontWeight': 'bold', 'fontSize': '14px'}),
                            html.Td(format_indian_number(net_annual_savings), style={'padding': '8px', 'textAlign': 'right', 'color': COLORS['accent'], 'fontSize': '14px'})
                        ]),
                        html.Tr([
                            html.Td("Simple Payback Period", style={'padding': '8px', 'fontWeight': 'bold', 'backgroundColor': COLORS['neutral'], 'fontSize': '14px'}),
                            html.Td(f"{roi_period} months", style={'padding': '8px', 'textAlign': 'right', 'backgroundColor': COLORS['neutral'], 'fontWeight': 'bold', 'fontSize': '14px'})
                        ])
                    ], style={'width': '100%', 'borderCollapse': 'collapse', 'border': f'1px solid {COLORS["neutral"]}'})
                ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top'}),
                
                html.Div([
                    dcc.Graph(figure=savings_pie_fig, config={'displayModeBar': False},
                             style={'height': '320px'})
                ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top'})
            ], style={'marginTop': '5px', 'marginBottom': '10px', 'display': 'flex', 'justifyContent': 'space-between'})
        ]),
        
        # LIFE CYCLE COST AND ROI ANALYSIS PAGE
        create_a4_page_container([
            html.H3("4.2 Life Cycle Cost Analysis (15 Years)", style={'color': COLORS['primary'], 'marginTop': '20px'}),
            
            # LCC summary table - key years
            dash_table.DataTable(
                data=lcc_summary.to_dict('records'),
                columns=[
                    {"name": "Year", "id": "Year"},
                    {"name": "Cash Flow (₹)", "id": "Cash Flow", "type": "numeric", "format": {"specifier": ",.0f"}},
                    {"name": "Discounted CF (₹)", "id": "Discounted CF", "type": "numeric", "format": {"specifier": ",.0f"}},
                    {"name": "Cumulative DCF (₹)", "id": "Cumulative DCF", "type": "numeric", "format": {"specifier": ",.0f"}}
                ],
                style_header={
                    'backgroundColor': COLORS['primary'],
                    'color': 'white',
                    'fontWeight': 'bold',
                    'border': f'1px solid {COLORS["primary"]}',
                    'textAlign': 'center'
                },
                style_cell={
                    'padding': '10px',
                    'border': f'1px solid {COLORS["neutral"]}',
                    'textAlign': 'right'
                },
                style_cell_conditional=[
                    {'if': {'column_id': 'Year'}, 'textAlign': 'center', 'width': '15%'},
                ],
                style_data_conditional=[
                    {
                        'if': {'row_index': 'odd'},
                        'backgroundColor': COLORS['neutral']
                    },
                    {
                        'if': {'filter_query': '{Cumulative DCF} > 0', 'column_id': 'Cumulative DCF'},
                        'color': COLORS['accent'],
                        'fontWeight': 'bold'
                    },
                    {
                        'if': {'filter_query': '{Cumulative DCF} < 0', 'column_id': 'Cumulative DCF'},
                        'color': COLORS['warning'],
                        'fontWeight': 'bold'
                    }
                ],
                style_table={'width': '100%', 'marginBottom': '30px'},
            ),
            
            html.P([
                f"The Net Present Value (NPV) of this project over 15 years is ", 
                html.B(format_indian_number(npv, True)), 
                f", with a discount rate of {DISCOUNT_RATE}% and inflation rate of {INFLATION_RATE}%."
            ], style={'fontSize': '15px', 'lineHeight': '1.5', 'marginBottom': '20px'}),
            
            html.H3("4.3 Return on Investment Analysis", style={'color': COLORS['primary'], 'marginTop': '15px'}),
            html.P([
                "The chart below illustrates the cumulative cash flow over time, showing the break-even point and long-term financial benefits of the adiabatic cooling system investment."
            ], style={'fontSize': '15px', 'lineHeight': '1.4', 'marginBottom': '10px'}),
            html.Div([
                dcc.Graph(figure=roi_chart_fig, config={'displayModeBar': False}, 
                         style={'height': '320px'})
            ], style={'marginBottom': '20px'})
        ]),
        
        # ENVIRONMENTAL IMPACT PAGE
        create_a4_page_container([
            html.H2("5. Environmental Impact", className='section-header'),
            
            html.H3("5.1 Carbon Footprint Reduction", style={'color': COLORS['primary'], 'marginTop': '20px'}),
            
            html.P([
                "Implementation of the adiabatic cooling system will significantly reduce the facility's carbon footprint through reduced electricity consumption."
            ], style={'fontSize': '16px', 'lineHeight': '1.6', 'marginBottom': '20px'}),
            
            # Environmental impact table
            dash_table.DataTable(
                data=environmental_data.to_dict('records'),
                columns=[{"name": i, "id": i} for i in environmental_data.columns],
                style_header={
                    'backgroundColor': COLORS['primary'],
                    'color': 'white',
                    'fontWeight': 'bold',
                    'border': f'1px solid {COLORS["primary"]}',
                    'paddingLeft': '15px'
                },
                style_cell={
                    'textAlign': 'left',
                    'padding': '15px',
                    'border': f'1px solid {COLORS["neutral"]}'
                },
                style_data_conditional=[
                    {
                        'if': {'row_index': 'odd'},
                        'backgroundColor': COLORS['neutral']
                    }
                ],
                style_table={'width': '100%', 'marginBottom': '30px'},
            ),
            
            html.H3("5.2 Sustainability Benefits", style={'color': COLORS['primary'], 'marginTop': '15px'}),
            
            html.P([
                "By implementing the adiabatic cooling system, your organization will contribute to multiple UN Sustainable Development Goals and strengthen your sustainability profile:"
            ], style={'fontSize': '14px', 'lineHeight': '1.4', 'marginBottom': '10px'}),
            
            # Enhanced sustainability visual cards section - more compact
            html.Div([
                # Left column - Direct Environmental Impact
                html.Div([
                    html.Div([
                        # More compact header with smaller icon
                        html.Div([
                            html.I(className="fas fa-leaf", style={
                                'fontSize': '20px', 
                                'color': 'white',
                                'backgroundColor': COLORS['accent'],
                                'padding': '8px',
                                'borderRadius': '50%',
                                'marginRight': '8px',
                                'width': '22px',
                                'height': '22px',
                                'display': 'flex',
                                'alignItems': 'center',
                                'justifyContent': 'center'
                            }),
                            html.H4("Direct Environmental Impact", style={
                                'fontSize': '16px', 
                                'color': COLORS['primary'],
                                'margin': '0',
                                'padding': '4px 0'
                            })
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        
                        # Condensed metrics visualization - horizontal layout
                        html.Div([
                            # CO2 Reduction
                            html.Div([
                                html.Strong(f"{annual_ghg_saving_tonnes:.1f}", style={'fontSize': '18px', 'color': COLORS['accent']}),
                                html.Span(" tonnes CO₂", style={'fontSize': '13px', 'marginLeft': '3px'})
                            ], style={'margin': '0 5px', 'textAlign': 'center', 'width': '33%'}),
                            
                            # Trees Equivalent
                            html.Div([
                                html.Strong(f"{int(annual_ghg_saving_tonnes * 16.5):,}", style={'fontSize': '18px', 'color': COLORS['secondary']}),
                                html.Span(" trees", style={'fontSize': '13px', 'marginLeft': '3px'})
                            ], style={'margin': '0 5px', 'textAlign': 'center', 'width': '33%'}),
                            
                            # Energy Savings
                            html.Div([
                                html.Strong(f"{annual_energy_saving_kwh/1000:,.1f}", style={'fontSize': '18px', 'color': COLORS['warning']}),
                                html.Span(" MWh", style={'fontSize': '13px', 'marginLeft': '3px'})
                            ], style={'margin': '0 5px', 'textAlign': 'center', 'width': '33%'})
                        ], style={'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '8px', 'backgroundColor': 'rgba(240,240,240,0.5)', 'padding': '8px 0', 'borderRadius': '5px'}),
                        
                        # More compact list
                        html.Ul([
                            html.Li("Reduced peak electricity demand", style={'marginBottom': '4px', 'fontSize': '14px'}),
                            html.Li("Decreased strain on power infrastructure", style={'marginBottom': '4px', 'fontSize': '14px'}),
                            html.Li(f"Efficient water use: {annual_water_consumption:,.0f} L/year", style={'marginBottom': '0', 'fontSize': '14px'})
                        ], style={'paddingLeft': '20px', 'marginTop': '5px', 'marginBottom': '0'})
                    ], style={'padding': '10px', 'border': f'1px solid {COLORS["neutral"]}', 'borderRadius': '5px'})
                ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top'}),
                
                # Right column - Strategic Sustainability Benefits
                html.Div([
                    html.Div([
                        # More compact header with smaller icon
                        html.Div([
                            html.I(className="fas fa-chart-line", style={
                                'fontSize': '20px', 
                                'color': 'white',
                                'backgroundColor': COLORS['secondary'],
                                'padding': '8px',
                                'borderRadius': '50%',
                                'marginRight': '8px',
                                'width': '22px',
                                'height': '22px',
                                'display': 'flex',
                                'alignItems': 'center',
                                'justifyContent': 'center'
                            }),
                            html.H4("Strategic Benefits", style={
                                'fontSize': '16px', 
                                'color': COLORS['primary'],
                                'margin': '0',
                                'padding': '4px 0'
                            })
                        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '8px'}),
                        
                        # More compact SDG Alignment row
                        html.Div([
                            # SDG badges in a single row with smaller padding
                            html.Div("SDG 7", style={'backgroundColor': '#FBC412', 'color': 'white', 'padding': '4px 8px', 'borderRadius': '12px', 'fontSize': '12px', 'display': 'inline-block', 'margin': '0 4px'}),
                            html.Div("SDG 9", style={'backgroundColor': '#F36D25', 'color': 'white', 'padding': '4px 8px', 'borderRadius': '12px', 'fontSize': '12px', 'display': 'inline-block', 'margin': '0 4px'}),
                            html.Div("SDG 12", style={'backgroundColor': '#BF8B2E', 'color': 'white', 'padding': '4px 8px', 'borderRadius': '12px', 'fontSize': '12px', 'display': 'inline-block', 'margin': '0 4px'}),
                            html.Div("SDG 13", style={'backgroundColor': '#3F7E44', 'color': 'white', 'padding': '4px 8px', 'borderRadius': '12px', 'fontSize': '12px', 'display': 'inline-block', 'margin': '0 4px'})
                        ], style={'textAlign': 'center', 'marginBottom': '8px'}),
                        
                        # More compact list
                        html.Ul([
                            html.Li("Enhanced ESG ratings and reporting", style={'marginBottom': '4px', 'fontSize': '14px'}),
                            html.Li("Compliance with efficiency regulations", style={'marginBottom': '4px', 'fontSize': '14px'}),
                            html.Li("Support for carbon reduction goals", style={'fontSize': '14px', 'marginBottom': '0'})
                        ], style={'paddingLeft': '20px', 'marginTop': '5px', 'marginBottom': '0'})
                    ], style={'padding': '10px', 'border': f'1px solid {COLORS["neutral"]}', 'borderRadius': '5px'})
                ], style={'width': '48%', 'display': 'inline-block', 'verticalAlign': 'top'})
            ], style={'marginBottom': '10px', 'display': 'flex', 'justifyContent': 'space-between', 'gap': '15px'}),
            
            # Combined cumulative impact section - more compact
            html.Div([
                html.Div([
                    html.I(className="fas fa-globe", style={'fontSize': '18px', 'color': '#3F7E44', 'marginRight': '8px'}),
                    html.H5("15-Year Impact: ", style={'fontSize': '15px', 'display': 'inline-block', 'margin': '0', 'fontWeight': 'bold'}),
                    html.Span(f"{annual_ghg_saving_tonnes * 15:.1f} tonnes CO₂ avoided", style={'fontSize': '15px', 'fontWeight': 'normal'})
                ], style={'display': 'flex', 'alignItems': 'center'}),
                
                # Simple progress bar
                html.Div([
                    html.Div(style={
                        'height': '12px',
                        'backgroundColor': COLORS['accent'],
                        'width': '100%',
                        'borderRadius': '6px'
                    })
                ], style={'marginTop': '5px'})
            ], style={'padding': '8px 10px', 'backgroundColor': 'rgba(240,240,240,0.5)', 'borderRadius': '5px', 'marginBottom': '10px'})
        ]),
        
        # IMPLEMENTATION PLAN PAGE
        create_a4_page_container([
            html.H2("6. Implementation Plan", className='section-header', style={'marginBottom': '10px'}),
            
            # Introduction with icon - more compact
            html.Div([
                html.I(className="fas fa-clipboard-check", style={
                    'fontSize': '20px',
                    'color': COLORS['primary'],
                    'marginRight': '10px'
                }),
                html.P([
                    "SEE-Tech Solutions provides a comprehensive turnkey implementation process to ensure minimal disruption to your operations and optimal system performance."
                ], style={'fontSize': '14px', 'lineHeight': '1.4', 'margin': '0', 'flex': '1'})
            ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '12px', 'marginTop': '5px'}),
            
            html.H3("6.1 Project Timeline", style={'color': COLORS['primary'], 'marginBottom': '10px', 'fontSize': '18px'}),
            
            # Enhanced timeline visualization - more compact
            html.Div([
                # Phase 1
                html.Div([
                    html.Div([
                        html.Div("1", style={
                            'backgroundColor': COLORS['primary'],
                            'color': 'white',
                            'width': '24px',
                            'height': '24px',
                            'borderRadius': '50%',
                            'display': 'flex',
                            'alignItems': 'center',
                            'justifyContent': 'center',
                            'fontWeight': 'bold',
                            'margin': '0 auto 8px'
                        }),
                        html.P("Site Assessment", style={
                            'fontWeight': 'bold',
                            'margin': '0 0 3px',
                            'fontSize': '14px',
                            'color': COLORS['primary']
                        }),
                        html.P("Week 1", style={
                            'margin': '0',
                            'fontSize': '12px',
                            'color': '#666'
                        }),
                        html.Ul([
                            html.Li("Site evaluation", style={'fontSize': '12px', 'margin': '2px 0'}),
                            html.Li("Data collection", style={'fontSize': '12px', 'margin': '2px 0'})
                        ], style={'paddingLeft': '10px', 'marginTop': '5px', 'marginBottom': '0'})
                    ], style={
                        'padding': '10px',
                        'backgroundColor': 'rgba(240,240,240,0.5)',
                        'borderRadius': '6px',
                        'borderLeft': f'3px solid {COLORS["primary"]}',
                        'height': '100%'
                    })
                ], style={'width': '17%', 'display': 'inline-block', 'verticalAlign': 'top'}),
                
                # Phase 2
                html.Div([
                    html.Div([
                        html.Div("2", style={
                            'backgroundColor': COLORS['secondary'],
                            'color': 'white',
                            'width': '24px',
                            'height': '24px',
                            'borderRadius': '50%',
                            'display': 'flex',
                            'alignItems': 'center',
                            'justifyContent': 'center',
                            'fontWeight': 'bold',
                            'margin': '0 auto 8px'
                        }),
                        html.P("Engineering", style={
                            'fontWeight': 'bold',
                            'margin': '0 0 3px',
                            'fontSize': '14px',
                            'color': COLORS['primary']
                        }),
                        html.P("Weeks 2-3", style={
                            'margin': '0',
                            'fontSize': '12px',
                            'color': '#666'
                        }),
                        html.Ul([
                            html.Li("System design", style={'fontSize': '12px', 'margin': '2px 0'}),
                            html.Li("Integration planning", style={'fontSize': '12px', 'margin': '2px 0'})
                        ], style={'paddingLeft': '10px', 'marginTop': '5px', 'marginBottom': '0'})
                    ], style={
                        'padding': '10px',
                        'backgroundColor': 'rgba(240,240,240,0.5)',
                        'borderRadius': '6px',
                        'borderLeft': f'3px solid {COLORS["secondary"]}',
                        'height': '100%'
                    })
                ], style={'width': '17%', 'display': 'inline-block', 'verticalAlign': 'top'}),
                
                # Phase 3
                html.Div([
                    html.Div([
                        html.Div("3", style={
                            'backgroundColor': COLORS['accent'],
                            'color': 'white',
                            'width': '24px',
                            'height': '24px',
                            'borderRadius': '50%',
                            'display': 'flex',
                            'alignItems': 'center',
                            'justifyContent': 'center',
                            'fontWeight': 'bold',
                            'margin': '0 auto 8px'
                        }),
                        html.P("Procurement", style={
                            'fontWeight': 'bold',
                            'margin': '0 0 3px',
                            'fontSize': '14px',
                            'color': COLORS['primary']
                        }),
                        html.P("Weeks 4-5", style={
                            'margin': '0',
                            'fontSize': '12px',
                            'color': '#666'
                        }),
                        html.Ul([
                            html.Li("Equipment ordering", style={'fontSize': '12px', 'margin': '2px 0'}),
                            html.Li("Quality validation", style={'fontSize': '12px', 'margin': '2px 0'})
                        ], style={'paddingLeft': '10px', 'marginTop': '5px', 'marginBottom': '0'})
                    ], style={
                        'padding': '10px',
                        'backgroundColor': 'rgba(240,240,240,0.5)',
                        'borderRadius': '6px',
                        'borderLeft': f'3px solid {COLORS["accent"]}',
                        'height': '100%'
                    })
                ], style={'width': '17%', 'display': 'inline-block', 'verticalAlign': 'top'}),
                
                # Phase 4
                html.Div([
                    html.Div([
                        html.Div("4", style={
                            'backgroundColor': COLORS['warning'],
                            'color': 'white',
                            'width': '24px',
                            'height': '24px',
                            'borderRadius': '50%',
                            'display': 'flex',
                            'alignItems': 'center',
                            'justifyContent': 'center',
                            'fontWeight': 'bold',
                            'margin': '0 auto 8px'
                        }),
                        html.P("Installation", style={
                            'fontWeight': 'bold',
                            'margin': '0 0 3px',
                            'fontSize': '14px',
                            'color': COLORS['primary']
                        }),
                        html.P("Weeks 6-7", style={
                            'margin': '0',
                            'fontSize': '12px',
                            'color': '#666'
                        }),
                        html.Ul([
                            html.Li("System assembly", style={'fontSize': '12px', 'margin': '2px 0'}),
                            html.Li("IoT integration", style={'fontSize': '12px', 'margin': '2px 0'})
                        ], style={'paddingLeft': '10px', 'marginTop': '5px', 'marginBottom': '0'})
                    ], style={
                        'padding': '10px',
                        'backgroundColor': 'rgba(240,240,240,0.5)',
                        'borderRadius': '6px',
                        'borderLeft': f'3px solid {COLORS["warning"]}',
                        'height': '100%'
                    })
                ], style={'width': '18%', 'display': 'inline-block', 'verticalAlign': 'top'}),
                
                # Phase 5 - Commissioning with extra width
                html.Div([
                    html.Div([
                        html.Div("5", style={
                            'backgroundColor': COLORS['accent'],  # Vibrant green from color palette
                            'color': 'white',
                            'width': '24px',
                            'height': '24px',
                            'borderRadius': '50%',
                            'display': 'flex',
                            'alignItems': 'center',
                            'justifyContent': 'center',
                            'fontWeight': 'bold',
                            'margin': '0 0 8px 0'  # Changed from auto to left alignment
                        }),
                        html.P("Commissioning", style={
                            'fontWeight': 'bold',
                            'margin': '0 0 3px',
                            'fontSize': '13px',  # Slightly smaller font
                            'color': COLORS['primary'],
                            'textAlign': 'left',
                            'overflow': 'visible',
                            'whiteSpace': 'normal',
                            'maxWidth': '100%',  # Ensure text doesn't overflow
                            'display': 'block'  # Make sure it's a block element
                        }),
                        html.P("Week 8", style={
                            'margin': '0',
                            'fontSize': '12px',
                            'color': '#666'
                        }),
                        html.Ul([
                            html.Li("Testing & validation", style={'fontSize': '12px', 'margin': '2px 0'}),
                            html.Li("Training & handover", style={'fontSize': '12px', 'margin': '2px 0'})
                        ], style={'paddingLeft': '10px', 'marginTop': '5px', 'marginBottom': '0'})
                    ], style={
                        'padding': '10px',
                        'backgroundColor': 'rgba(240,240,240,0.5)',
                        'borderRadius': '6px',
                        'borderLeft': f'3px solid {COLORS["accent"]}',  # Matching border color with COLORS palette
                        'height': '100%',
                        'textAlign': 'left',  # Ensure all content is left-aligned
                        'width': '100%'  # Ensure full width is used within the container
                    })
                ], style={'width': '20%', 'display': 'inline-block', 'verticalAlign': 'top'})
            ], style={'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '20px', 'gap': '6px'}),
            
            # Subtle divider between sections - more compact
            html.Hr(style={'borderTop': f'1px solid {COLORS["neutral"]}', 'marginBottom': '15px', 'opacity': '0.5', 'marginTop': '10px'}),
            
            # Installation process with innovative layout - more compact
            html.Div([
                html.Div([
                    html.H3("6.2 Installation Process", style={
                        'color': COLORS['primary'], 
                        'marginTop': '0', 
                        'marginBottom': '12px',
                        'fontSize': '18px'
                    }),
                    html.I(className="fas fa-tools", style={
                        'fontSize': '20px',
                        'color': COLORS['secondary'],
                        'position': 'absolute',
                        'right': '10px',
                        'top': '10px'
                    })
                ], style={'position': 'relative'}),
                
                # Process steps in cards - 2x2 grid layout with explicit gap - more compact
                html.Div([
                    # Row 1 with 2 cards
                    html.Div([
                        # Step 1
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-clipboard-list", style={
                                    'fontSize': '16px',
                                    'color': COLORS['accent'],
                                    'marginRight': '8px'
                                }),
                                html.Strong("Pre-Installation Planning", style={'fontSize': '14px'})
                            ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '3px'}),
                            html.P("Comprehensive site survey and installation planning to identify optimal locations and connection points.", 
                                style={'fontSize': '12px', 'lineHeight': '1.3', 'margin': '0', 'paddingLeft': '24px'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'}),
                        
                        # Spacer
                        html.Div(style={'width': '4%'}),
                        
                        # Step 2
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-moon", style={
                                    'fontSize': '16px',
                                    'color': COLORS['accent'],
                                    'marginRight': '8px'
                                }),
                                html.Strong("Off-Hours Installation", style={'fontSize': '14px'})
                            ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '3px'}),
                            html.P("Critical connections performed during scheduled downtime to minimize operational impact.", 
                                style={'fontSize': '12px', 'lineHeight': '1.3', 'margin': '0', 'paddingLeft': '24px'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'})
                    ], style={'display': 'flex', 'marginBottom': '12px'}),
                    
                    # Row 2 with 2 cards - more compact
                    html.Div([
                        # Step 3
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-cubes", style={
                                    'fontSize': '16px',
                                    'color': COLORS['accent'],
                                    'marginRight': '8px'
                                }),
                                html.Strong("Modular Implementation", style={'fontSize': '14px'})
                            ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '3px'}),
                            html.P("System installed in modules, allowing for phased implementation if required.", 
                                style={'fontSize': '12px', 'lineHeight': '1.3', 'margin': '0', 'paddingLeft': '24px'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'}),
                        
                        # Spacer
                        html.Div(style={'width': '4%'}),
                        
                        # Step 4
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-check-circle", style={
                                    'fontSize': '16px',
                                    'color': COLORS['accent'],
                                    'marginRight': '8px'
                                }),
                                html.Strong("Testing & Commissioning", style={'fontSize': '14px'})
                            ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '3px'}),
                            html.P("Thorough system testing, performance validation, and operator training.", 
                                style={'fontSize': '12px', 'lineHeight': '1.3', 'margin': '0', 'paddingLeft': '24px'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'})
                    ], style={'display': 'flex'})
                ], style={'marginBottom': '15px'})
            ], style={'padding': '15px', 'border': f'1px solid {COLORS["neutral"]}', 'borderRadius': '8px', 'marginBottom': '15px', 'boxShadow': '0 2px 4px rgba(0,0,0,0.05)'}),
            
            # Project team with modern design - more compact
            html.Div([
                html.H3("6.3 Your Project Team", style={'color': COLORS['primary'], 'marginTop': '0', 'marginBottom': '10px', 'fontSize': '18px'}),
                
                # Team members in a 2x2 grid with icons and explicit spacers - more compact
                html.Div([
                    # Row 1 with 2 team cards and spacer
                    html.Div([
                        # Professional Engineers
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-hard-hat", style={
                                    'fontSize': '18px',
                                    'color': 'white',
                                    'backgroundColor': COLORS['accent'],
                                    'padding': '8px',
                                    'borderRadius': '50%',
                                    'width': '18px',
                                    'height': '18px',
                                    'display': 'flex',
                                    'alignItems': 'center',
                                    'justifyContent': 'center',
                                    'marginRight': '8px'
                                }),
                                html.Div([
                                    html.H4("Professional Engineers", style={'fontSize': '14px', 'margin': '0 0 3px', 'color': COLORS['primary']}),
                                    html.P("HVAC specialists with expert knowledge of evaporative cooling", style={'fontSize': '12px', 'margin': '0', 'color': '#666'})
                                ])
                            ], style={'display': 'flex', 'alignItems': 'center'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'}),
                        
                        # Spacer
                        html.Div(style={'width': '4%'}),
                        
                        # Project Manager
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-user-tie", style={
                                    'fontSize': '18px',
                                    'color': 'white',
                                    'backgroundColor': COLORS['primary'],
                                    'padding': '8px',
                                    'borderRadius': '50%',
                                    'width': '18px',
                                    'height': '18px',
                                    'display': 'flex',
                                    'alignItems': 'center',
                                    'justifyContent': 'center',
                                    'marginRight': '8px'
                                }),
                                html.Div([
                                    html.H4("Project Manager", style={'fontSize': '14px', 'margin': '0 0 3px', 'color': COLORS['primary']}),
                                    html.P("Dedicated point of contact for timely, on-budget delivery", style={'fontSize': '12px', 'margin': '0', 'color': '#666'})
                                ])
                            ], style={'display': 'flex', 'alignItems': 'center'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'})
                    ], style={'display': 'flex', 'marginBottom': '12px'}),
                    
                    # Row 2 with 2 team cards and spacer - more compact
                    html.Div([
                        # Installation Technicians
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-wrench", style={
                                    'fontSize': '18px',
                                    'color': 'white',
                                    'backgroundColor': COLORS['secondary'],
                                    'padding': '8px',
                                    'borderRadius': '50%',
                                    'width': '18px',
                                    'height': '18px',
                                    'display': 'flex',
                                    'alignItems': 'center',
                                    'justifyContent': 'center',
                                    'marginRight': '8px'
                                }),
                                html.Div([
                                    html.H4("Installation Technicians", style={'fontSize': '14px', 'margin': '0 0 3px', 'color': COLORS['primary']}),
                                    html.P("Specialized experts in adiabatic system installation", style={'fontSize': '12px', 'margin': '0', 'color': '#666'})
                                ])
                            ], style={'display': 'flex', 'alignItems': 'center'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'}),
                        
                        # Spacer
                        html.Div(style={'width': '4%'}),
                        
                        # Support Team
                        html.Div([
                            html.Div([
                                html.I(className="fas fa-laptop-code", style={
                                    'fontSize': '18px',
                                    'color': 'white',
                                    'backgroundColor': COLORS['warning'],
                                    'padding': '8px',
                                    'borderRadius': '50%',
                                    'width': '18px',
                                    'height': '18px',
                                    'display': 'flex',
                                    'alignItems': 'center',
                                    'justifyContent': 'center',
                                    'marginRight': '8px'
                                }),
                                html.Div([
                                    html.H4("Support Team", style={'fontSize': '14px', 'margin': '0 0 3px', 'color': COLORS['primary']}),
                                    html.P("IoT specialists and technical support for system optimization", style={'fontSize': '12px', 'margin': '0', 'color': '#666'})
                                ])
                            ], style={'display': 'flex', 'alignItems': 'center'})
                        ], style={'width': '48%', 'padding': '10px', 'backgroundColor': '#f8f9fa', 'borderRadius': '6px', 'boxShadow': '0 1px 3px rgba(0,0,0,0.1)'})
                    ], style={'display': 'flex'})
                ], style={'marginBottom': '15px'})
            ], style={'marginBottom': '20px'})
        ]),
        
        # MAINTENANCE AND CONCLUSION PAGE
        create_a4_page_container([
            # Create the maintenance and conclusion section using the imported function
            create_maintenance_section(
                power_saving_pct, annual_monetary_saving, 
                roi_period, annual_ghg_saving_tonnes, CLIENT_NAME
            )
        ])
        
    ], style={
        'fontFamily': 'Arial, sans-serif',
        'maxWidth': '21cm',
        'margin': '0 auto',
        'backgroundColor': 'white'
    })
    
    return app

if __name__ == '__main__':
    # Generate the report
    app = generate_report()
    
    # Run the app
    app.run(debug=True)
