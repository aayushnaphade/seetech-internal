document.addEventListener('DOMContentLoaded', () => {
    // Get the calculate button and add event listener
    const calculateButton = document.getElementById('calculate');
    calculateButton.addEventListener('click', performCalculation);
    
    // Display loading message
    document.getElementById('summaryResults').innerHTML = "<p>Loading CoolProp module, please wait...</p>";
    
    // Function to check if CoolProp is ready
    function checkCoolPropReady() {
        if (typeof Module !== 'undefined' && typeof Module.PropsSI === 'function') {
            console.log("CoolProp WASM module loaded successfully");
            document.getElementById('summaryResults').innerHTML = "<p>CoolProp loaded successfully. Ready for calculations.</p>";
            // Perform initial calculation if needed
        } else {
            console.log("Waiting for CoolProp WASM module to initialize...");
            setTimeout(checkCoolPropReady, 500);
        }
    }
    
    // If Module is defined, add an onRuntimeInitialized callback
    if (typeof Module !== 'undefined') {
        Module.onRuntimeInitialized = function() {
            console.log("WASM runtime initialized");
            checkCoolPropReady();
        };
    } else {
        // If Module is not defined yet, start polling
        checkCoolPropReady();
    }
});

function performCalculation() {
    // Get input values
    const p_in_bar = Number(document.getElementById('p_in').value);
    const p_out_bar = Number(document.getElementById('p_out').value);
    const mass_flow_cfm = Number(document.getElementById('mass_flow_rate').value);
    const efficiency = Number(document.getElementById('efficiency').value);
    const temp_min = Number(document.getElementById('temp_min').value);
    const temp_max = Number(document.getElementById('temp_max').value);
    const temp_ref = Number(document.getElementById('temp_ref').value);
    const fluid = document.getElementById('fluid').value;
    
    // Convert bar to Pascal (1 bar = 100,000 Pa)
    const p_in = p_in_bar * 100000;
    const p_out = p_out_bar * 100000;
    
    // Convert CFM to kg/s - using density from CoolProp
    // For air at standard conditions: 1 CFM ≈ 0.0283 m³/min ≈ 0.000472 m³/s
    const std_temp = 293.15; // 20°C in K
    let density_reference;
    try {
        density_reference = Module.PropsSI('D', 'T', std_temp, 'P', p_in, fluid); // kg/m³
    } catch (err) {
        console.error('Error calculating density reference:', err);
        density_reference = 1.2; // Approximate air density as fallback
    }
    const mass_flow_rate = mass_flow_cfm * 0.000472 * density_reference; // CFM to kg/s
    
    // Check if CoolProp is loaded
    if (typeof Module === 'undefined') {
        console.error('Module is undefined');
        document.getElementById('summaryResults').innerHTML = 
            "<p class='error'>Error: CoolProp library is not loaded. Please check your browser console for more details.</p>";
        return;
    }
    
    // Check if PropsSI function exists
    if (typeof Module.PropsSI !== 'function') {
        console.error('Module.PropsSI is not a function', Module);
        document.getElementById('summaryResults').innerHTML = 
            "<p class='error'>Error: CoolProp WASM module not properly initialized. Please wait for page to fully load or check browser console for details.</p>";
        return;
    }
    
    // Log success for debugging
    console.log('CoolProp loaded successfully, starting calculation');
    console.log(`Using p_in: ${p_in} Pa (${p_in_bar} bar), p_out: ${p_out} Pa (${p_out_bar} bar)`);
    console.log(`Mass flow rate: ${mass_flow_rate} kg/s (${mass_flow_cfm} CFM)`);
    
    try {
        // Create temperature array
        const numPoints = 50;
        const temp_inlet_c = linspace(temp_min, temp_max, numPoints);
        const temp_inlet_k = temp_inlet_c.map(t => t + 273.15);
        
        // Convert reference temperature to Kelvin
        const t_ref_k = temp_ref + 273.15;
        
        // Calculate reference values
        const h1_ref = Module.PropsSI('H', 'T', t_ref_k, 'P', p_in, fluid);
        const s1_ref = Module.PropsSI('S', 'T', t_ref_k, 'P', p_in, fluid);
        const h2s_ref = Module.PropsSI('H', 'P', p_out, 'S', s1_ref, fluid);
        const w_ref = (h2s_ref - h1_ref) / efficiency;
        const p_ref = mass_flow_rate * w_ref / 1000; // in kW
        
        // Storage arrays
        const power_kw = [];
        const savings_percent = [];
        
        // Loop through temperature values
        for (const t1 of temp_inlet_k) {
            try {
                const h1 = Module.PropsSI('H', 'T', t1, 'P', p_in, fluid);
                const s1 = Module.PropsSI('S', 'T', t1, 'P', p_in, fluid);
                const h2s = Module.PropsSI('H', 'P', p_out, 'S', s1, fluid);
                const w = (h2s - h1) / efficiency;
                const power = mass_flow_rate * w / 1000; // in kW
                
                power_kw.push(power);
                savings_percent.push(100 * (1 - power / p_ref));
            } catch (err) {
                console.error(`Error in calculation at T=${t1}K:`, err);
                power_kw.push(null);
                savings_percent.push(null);
            }
        }
        
        // Create plot
        createPlot(temp_inlet_c, power_kw, savings_percent, temp_ref);
        
        // Update summary
        updateSummary(temp_inlet_c, power_kw, savings_percent, temp_ref, p_ref);
        
    } catch (err) {
        console.error('Calculation error:', err);
        alert('Error in calculation. Please check console for details.');
    }
}

function createPlot(temp_c, power_kw, savings_percent, temp_ref) {
    // Filter out any null values that might have resulted from calculation errors
    const validData = temp_c.map((t, i) => ({
        temp: t,
        power: power_kw[i],
        savings: savings_percent[i]
    })).filter(d => d.power !== null && d.savings !== null);
    
    const filteredTemp = validData.map(d => d.temp);
    const filteredPower = validData.map(d => d.power);
    const filteredSavings = validData.map(d => d.savings);
    
    // Create Plotly traces
    const trace_power = {
        x: filteredTemp,
        y: filteredPower,
        mode: 'lines+markers',
        name: 'Compressor Power (kW)',
        line: {color: 'blue'}
    };
    
    const trace_saving = {
        x: filteredTemp,
        y: filteredSavings,
        mode: 'lines+markers',
        name: 'Power Saving vs ' + temp_ref + '°C (%)',
        line: {color: 'green', dash: 'dash'},
        yaxis: 'y2'
    };
    
    // Define layout
    const layout = {
        title: 'Compressor Power & Savings vs Suction Air Temperature',
        xaxis: {
            title: 'Suction Temperature (°C)'
        },
        yaxis: {
            title: {
                text: 'Compressor Power (kW)',
                font: {color: 'blue'}
            },
            tickfont: {color: 'blue'},
            range: [0, Math.max(...filteredPower) * 1.05] // Start from 0 with a little padding
        },
        yaxis2: {
            title: {
                text: 'Power Saving vs ' + temp_ref + '°C (%)',
                font: {color: 'green'}
            },
            tickfont: {color: 'green'},
            anchor: 'x',
            overlaying: 'y',
            side: 'right',
            range: [0, 15] // Fixed range from 0% to 15% for savings
        },
        hovermode: 'closest',
        template: 'plotly_white',
        legend: {x: 0.01, y: 0.99},
        shapes: [
            // Reference line for power
            {
                type: 'line',
                x0: temp_ref,
                x1: temp_ref,
                y0: 0,
                y1: Math.max(...filteredPower) * 1.05,
                line: {color: 'red', dash: 'dot'}
            },
            // Reference line for savings
            {
                type: 'line',
                x0: temp_ref,
                x1: temp_ref,
                y0: 0,
                y1: 15,
                yref: 'y2',
                line: {color: 'red', dash: 'dot'}
            }
        ]
    };
    
    // Create the plot
    Plotly.newPlot('plotDiv', [trace_power, trace_saving], layout);
}

function updateSummary(temp_c, power_kw, savings_percent, temp_ref, p_ref) {
    const summaryDiv = document.getElementById('summaryResults');
    
    // Find min power and corresponding temperature
    const min_power_index = power_kw.indexOf(Math.min(...power_kw.filter(p => p !== null)));
    const min_power = power_kw[min_power_index];
    const min_power_temp = temp_c[min_power_index];
    const max_savings = savings_percent[min_power_index];
    
    // Find power and savings at 10°C increments
    const temp_points = [10, 20, 30, temp_ref];
    const summary_points = temp_points.map(temp => {
        // Find closest temperature in our array
        const closest_index = temp_c.reduce((prev, curr, idx) => 
            Math.abs(curr - temp) < Math.abs(temp_c[prev] - temp) ? idx : prev, 0);
            
        return {
            temp: temp_c[closest_index].toFixed(1),
            power: power_kw[closest_index].toFixed(2),
            savings: savings_percent[closest_index].toFixed(2)
        };
    });
    
    // Create HTML content
    let html = `
        <table>
            <tr>
                <th>Temperature (°C)</th>
                <th>Power (kW)</th>
                <th>Savings (%)</th>
            </tr>
    `;
    
    // Add data rows
    summary_points.forEach(point => {
        html += `
            <tr>
                <td>${point.temp}</td>
                <td>${point.power}</td>
                <td>${point.savings}</td>
            </tr>
        `;
    });
    
    html += '</table>';
    
    // Add optimal operating point
    html += `
        <div class="optimal-point">
            <h4>Optimal Operating Point</h4>
            <p>Lowest power consumption at ${min_power_temp.toFixed(1)}°C: ${min_power.toFixed(2)} kW</p>
            <p>Maximum savings: ${max_savings.toFixed(2)}%</p>
        </div>
    `;
    
    summaryDiv.innerHTML = html;
}

// Utility function to create evenly spaced array (like numpy's linspace)
function linspace(start, stop, num) {
    const step = (stop - start) / (num - 1);
    return Array.from({length: num}, (_, i) => start + i * step);
}
