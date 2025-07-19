"""
Chart and visualization components for the adiabatic cooling proposal.
"""

import plotly.graph_objects as go
from data.constants import COLORS
from refrigeration_dash_report import Tcond_act, Tcond_practical

# Create savings breakdown pie chart
def create_savings_pie(annual_monetary_saving, annual_water_cost, annual_maintenance_cost, net_annual_savings):
    """Create a pie chart showing the breakdown of savings and costs"""
    labels = ['Electricity Savings', 'Water Costs', 'Maintenance Costs', 'Net Savings']
    values = [annual_monetary_saving, -annual_water_cost, -annual_maintenance_cost, net_annual_savings]
    colors = [COLORS['accent'], COLORS['warning'], COLORS['warning'], COLORS['secondary']]
    
    fig = go.Figure(data=[go.Pie(
        labels=labels,
        values=[abs(v) for v in values],
        hole=.4,
        marker=dict(colors=colors),
        textinfo='label+percent',
        textposition='outside',
        pull=[0, 0, 0, 0.1]
    )])
    
    fig.update_layout(
        title="Annual Financial Impact Breakdown",
        height=400,
        margin=dict(l=50, r=50, t=50, b=50),
    )
    return fig

# Create power consumption comparison chart (before and after)
def create_power_comparison_chart(power_saving_pct, INITIAL_POWER_KW):
    """Create a bar chart comparing power consumption before and after"""
    # Calculate values for visualization
    before_kw = INITIAL_POWER_KW
    after_kw = INITIAL_POWER_KW * (1 - power_saving_pct/100)
    saving_kw = before_kw - after_kw
    
    # Create a bar chart to compare power consumption
    fig = go.Figure()
    
    # Add bars for before, after and savings with improved styling
    fig.add_trace(go.Bar(
        x=['Before Adiabatic Cooling', 'After Adiabatic Cooling', 'Power Savings'],
        y=[before_kw, after_kw, saving_kw],
        text=[f"{before_kw:.1f} kW", f"{after_kw:.1f} kW", f"{saving_kw:.1f} kW"],
        textposition='auto',
        marker=dict(
            color=[COLORS['warning'], COLORS['accent'], COLORS['secondary']],
            line=dict(width=1, color='#333'),
            opacity=0.9
        ),
        width=[0.65, 0.65, 0.65],  # Slightly thinner bars for more professional look
        name='Power Consumption'
    ))
    
    # Add horizontal line for reference at "before" level
    fig.add_shape(
        type="line", 
        line=dict(dash="dot", color=COLORS['warning'], width=2),
        x0=-0.5, y0=before_kw, x1=1.5, y1=before_kw
    )
    
    # Add annotation to show percentage reduction with improved styling
    fig.add_annotation(
        x=0.5, y=(before_kw + after_kw)/2,
        text=f"{power_saving_pct:.1f}% Reduction",
        font=dict(size=14, color="#333", family="Arial, sans-serif"),
        showarrow=True,
        arrowhead=2,
        arrowcolor=COLORS['secondary'],
        arrowsize=1.5,
        arrowwidth=2,
        bgcolor="rgba(255, 255, 255, 0.8)",
        bordercolor="#333",
        borderwidth=1,
        borderpad=4,
        opacity=0.9
    )
    
    fig.update_layout(
        title={
            'text': 'Power Consumption Comparison With Adiabatic Cooling',
            'font': {'size': 18, 'family': 'Arial, sans-serif'},
            'y': 0.95
        },
        yaxis_title={
            'text': 'Power Consumption (kW)',
            'font': {'size': 14}
        },
        height=400,
        margin=dict(l=50, r=50, t=70, b=50),
        uniformtext_minsize=12,
        uniformtext_mode='hide',
        xaxis=dict(
            categoryorder='array', 
            categoryarray=['Before Adiabatic Cooling', 'After Adiabatic Cooling', 'Power Savings'],
            tickfont=dict(size=12)
        ),
        yaxis=dict(
            tickformat='.1f',
            tickfont=dict(size=12),
            gridcolor='rgba(0,0,0,0.1)'
        ),
        plot_bgcolor='rgba(250,250,250,0.9)',
        paper_bgcolor='rgba(0,0,0,0)'
    )
    
    return fig

# Create temperature comparison visualization
def create_temperature_comparison():
    """Create separate temperature gauge charts for before and after comparison"""
    # Temperature values
    before_temp = Tcond_act-273.15
    after_temp = Tcond_practical-273.15
    temp_diff = before_temp - after_temp
    
    # Common gauge range for consistency between charts
    temp_range = [None, max(60, before_temp+5)]
    
    # "Before" temperature gauge
    fig1 = go.Figure(go.Indicator(
        mode = "gauge+number",
        value = before_temp,
        number = {'suffix': "°C", 'font': {'size': 30}},
        gauge = {
            'axis': {'range': temp_range, 'ticksuffix': "°C"},
            'bar': {'color': COLORS['warning']},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 30], 'color': '#c7e9b4'},
                {'range': [30, 40], 'color': '#7fcdbb'},
                {'range': [40, 50], 'color': '#fdae61'},
                {'range': [50, 60], 'color': '#d73027'}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': before_temp
            }
        }
    ))
    
    fig1.update_layout(
        title={
            'text': "Before Adiabatic Cooling",
            'y':0.9,
            'x':0.5,
            'xanchor': 'center',
            'yanchor': 'top',
            'font': {'size': 18}
        },
        height=250,
        margin=dict(l=20, r=20, t=60, b=20)
    )
    
    # "After" temperature gauge with delta indicator showing reduction
    fig2 = go.Figure(go.Indicator(
        mode = "gauge+number+delta",
        value = after_temp,
        number = {'suffix': "°C", 'font': {'size': 30}},
        delta = {
            "reference": before_temp, 
            "valueformat": ".1f",
            "suffix": "°C",
            "font": {"size": 16, "color": COLORS['accent']}
        },
        gauge = {
            'axis': {'range': temp_range, 'ticksuffix': "°C"},
            'bar': {'color': COLORS['accent']},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 30], 'color': '#c7e9b4'},
                {'range': [30, 40], 'color': '#7fcdbb'},
                {'range': [40, 50], 'color': '#fdae61'},
                {'range': [50, 60], 'color': '#d73027'}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': before_temp
            }
        }
    ))
    
    fig2.update_layout(
        title={
            'text': "After Adiabatic Cooling",
            'y':0.9,
            'x':0.5,
            'xanchor': 'center',
            'yanchor': 'top',
            'font': {'size': 18}
        },
        height=250,
        margin=dict(l=20, r=20, t=60, b=20)
    )
    
    # Return as a list of separate figures
    return [fig1, fig2]

# Create ROI timeline chart
def create_roi_chart(lcc_table):
    """Create a chart showing the return on investment timeline"""
    # Focus on years 0-5
    years_to_show = min(8, 15)  # Using 15 years as PROJECT_LIFE
    years = [row["Year"] for row in lcc_table[:years_to_show+1]]
    cumulative = [row["Cumulative Discounted Cash Flow"] for row in lcc_table[:years_to_show+1]]
    
    fig = go.Figure()
    
    # Add line for cumulative cash flow
    fig.add_trace(go.Scatter(
        x=years, 
        y=cumulative,
        mode='lines+markers',
        name='Cumulative Discounted Cash Flow',
        line=dict(color=COLORS['secondary'], width=3),
        marker=dict(size=10)
    ))
    
    # Add break-even point
    for i in range(1, len(years)):
        if cumulative[i-1] < 0 and cumulative[i] >= 0:
            # Interpolate to find exact break-even point
            x_intercept = years[i-1] + (-cumulative[i-1])/(cumulative[i]-cumulative[i-1])
            
            # Add marker for break-even
            fig.add_trace(go.Scatter(
                x=[x_intercept],
                y=[0],
                mode='markers',
                marker=dict(symbol='star', size=16, color=COLORS['accent']),
                name=f'Break-even: {x_intercept:.2f} Years'
            ))
            
            # Add vertical line
            fig.add_shape(
                type="line", line=dict(dash="dash", color=COLORS['accent']),
                x0=x_intercept, y0=min(cumulative), x1=x_intercept, y1=0
            )
    
    # Add horizontal line at y=0
    fig.add_shape(
        type="line", line=dict(dash="solid", color="black"),
        x0=0, y0=0, x1=years[-1], y1=0
    )
    
    fig.update_layout(
        title='Return on Investment Timeline',
        xaxis_title='Year',
        yaxis_title='Cumulative Discounted Cash Flow (₹)',
        height=400,
        margin=dict(l=50, r=50, t=70, b=50),
        yaxis=dict(tickprefix='₹', tickformat=','),
        legend=dict(x=0.01, y=0.99, bgcolor='rgba(255,255,255,0.8)')
    )
    return fig
