# Compressor Analysis Tool

This tool analyzes compressor power consumption and energy savings at different suction temperatures using CoolProp for thermodynamic calculations.

## Project Structure

```
├── index.html         # Main application HTML
├── script.js          # Main application JavaScript
├── styles.css         # CSS styles
├── server.py          # Simple HTTP server with WASM support
├── coolprop/          # CoolProp WASM module
│   ├── coolprop.js    # CoolProp JavaScript interface
│   ├── coolprop.wasm  # WebAssembly binary
│   ├── index.html     # CoolProp example
│   └── test.html      # CoolProp test page
└── test-tool.html     # Testing page for the application
```

## Running the Application

1. Start the HTTP server:

```bash
python3 server.py
```

2. Open your browser and navigate to:

```
http://localhost:8000
```

3. To test the CoolProp implementation directly, visit:

```
http://localhost:8000/coolprop/test.html
```

## Using the Compressor Analysis Tool

1. Enter the required parameters:
   - Suction Pressure
   - Discharge Pressure
   - Mass Flow Rate
   - Compressor Efficiency
   - Temperature Range
   - Reference Temperature
   - Working Fluid

2. Click "Calculate" to generate the analysis.

3. View the results:
   - Power consumption graph
   - Power savings graph
   - Summary table of key data points
   - Optimal operating point information

## Dependencies

- CoolProp.js - Thermodynamic property calculations
- Plotly.js - Graphing and visualization

## Notes

- The WASM file requires a proper MIME type, which is configured in the server.py script.
- CoolProp calculations might take a moment to initialize when the page first loads.
