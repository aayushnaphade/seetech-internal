// Plotly Visualization Utilities
// Extracted from Engineering-Solver project for SeeTech energy efficiency tools

export interface PlotData {
  x?: number[] | string[]
  y?: number[] | string[]
  z?: number[][]
  type?: string
  mode?: string
  name?: string
  line?: {
    color?: string
    width?: number
    dash?: string
  }
  marker?: {
    color?: string | number[] | string[]
    size?: number | number[]
    symbol?: string
    colorscale?: string
  }
  hovertemplate?: string
  showlegend?: boolean
  fill?: string
  fillcolor?: string
  opacity?: number
  text?: string[]
  textposition?: string
  orientation?: string
  xaxis?: string
  yaxis?: string
  visible?: boolean | string
  legendgroup?: string
  connectgaps?: boolean
  customdata?: any[]
  hoverlabel?: {
    bgcolor?: string
    bordercolor?: string
    font?: {
      color?: string
      size?: number
      family?: string
    }
  }
}

export interface PlotLayout {
  title?: string | {
    text?: string
    font?: {
      size?: number
      color?: string
      family?: string
    }
    x?: number
    y?: number
  }
  xaxis?: {
    title?: string | { text?: string; font?: any }
    range?: [number, number]
    type?: string
    showgrid?: boolean
    gridcolor?: string
    zeroline?: boolean
    zerolinecolor?: string
    showline?: boolean
    linecolor?: string
    linewidth?: number
    mirror?: boolean
    ticks?: string
    tickcolor?: string
    tickwidth?: number
    ticklen?: number
    tickfont?: {
      size?: number
      color?: string
      family?: string
    }
    showticklabels?: boolean
    tickformat?: string
    tickmode?: string
    tick0?: number
    dtick?: number
    tickvals?: number[]
    ticktext?: string[]
    exponentformat?: string
    showexponent?: string
    side?: string
    overlaying?: string
    position?: number
    anchor?: string
    domain?: [number, number]
    categoryorder?: string
    categoryarray?: string[]
    scaleanchor?: string
    scaleratio?: number
    constrain?: string
    constraintoward?: string
    matches?: string
    rangemode?: string
    autorange?: boolean | string
    fixedrange?: boolean
    tickangle?: number
    nticks?: number
    ticklabelmode?: string
    ticklabelstep?: number
    ticklabeloverflow?: string
    ticklabelposition?: string
    ticklabelstop?: number
    ticklabelstart?: number
    tickson?: string
    ticksuffix?: string
    tickprefix?: string
    separatethousands?: boolean
    showspikes?: boolean
    spikesnap?: string
    spikemode?: string
    spikethickness?: number
    spikecolor?: string
    spikedash?: string
    hoverformat?: string
    layer?: string
    calendar?: string
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }
  yaxis?: {
    title?: string | { text?: string; font?: any }
    range?: [number, number]
    type?: string
    showgrid?: boolean
    gridcolor?: string
    zeroline?: boolean
    zerolinecolor?: string
    showline?: boolean
    linecolor?: string
    linewidth?: number
    mirror?: boolean
    ticks?: string
    tickcolor?: string
    tickwidth?: number
    ticklen?: number
    tickfont?: {
      size?: number
      color?: string
      family?: string
    }
    showticklabels?: boolean
    tickformat?: string
    tickmode?: string
    tick0?: number
    dtick?: number
    tickvals?: number[]
    ticktext?: string[]
    exponentformat?: string
    showexponent?: string
    side?: string
    overlaying?: string
    position?: number
    anchor?: string
    domain?: [number, number]
    categoryorder?: string
    categoryarray?: string[]
    scaleanchor?: string
    scaleratio?: number
    constrain?: string
    constraintoward?: string
    matches?: string
    rangemode?: string
    autorange?: boolean | string
    fixedrange?: boolean
    tickangle?: number
    nticks?: number
    ticklabelmode?: string
    ticklabelstep?: number
    ticklabeloverflow?: string
    ticklabelposition?: string
    ticklabelstop?: number
    ticklabelstart?: number
    tickson?: string
    ticksuffix?: string
    tickprefix?: string
    separatethousands?: boolean
    showspikes?: boolean
    spikesnap?: string
    spikemode?: string
    spikethickness?: number
    spikecolor?: string
    spikedash?: string
    hoverformat?: string
    layer?: string
    calendar?: string
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }
  width?: number
  height?: number
  autosize?: boolean
  margin?: {
    l?: number
    r?: number
    t?: number
    b?: number
    pad?: number
  }
  paper_bgcolor?: string
  plot_bgcolor?: string
  hovermode?: string | boolean
  hoverdistance?: number
  spikedistance?: number
  hoverlabel?: {
    bgcolor?: string
    bordercolor?: string
    font?: {
      color?: string
      size?: number
      family?: string
    }
    align?: string
    namelength?: number
  }
  showlegend?: boolean
  legend?: {
    bgcolor?: string
    bordercolor?: string
    borderwidth?: number
    font?: {
      color?: string
      size?: number
      family?: string
    }
    orientation?: string
    traceorder?: string
    tracegroupgap?: number
    itemsizing?: string
    itemwidth?: number
    itemclick?: string
    itemdoubleclick?: string
    x?: number
    y?: number
    xanchor?: string
    yanchor?: string
    valign?: string
    title?: {
      text?: string
      font?: {
        color?: string
        size?: number
        family?: string
      }
      side?: string
    }
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }
  annotations?: Array<{
    text?: string
    x?: number | string
    y?: number | string
    xref?: string
    yref?: string
    showarrow?: boolean
    arrowhead?: number
    arrowsize?: number
    arrowwidth?: number
    arrowcolor?: string
    ax?: number
    ay?: number
    axref?: string
    ayref?: string
    xanchor?: string
    yanchor?: string
    xshift?: number
    yshift?: number
    font?: {
      color?: string
      size?: number
      family?: string
    }
    align?: string
    bgcolor?: string
    bordercolor?: string
    borderwidth?: number
    borderpad?: number
    opacity?: number
    textangle?: number
    valign?: string
    visible?: boolean
    width?: number
    height?: number
    standoff?: number
    startarrowhead?: number
    startarrowsize?: number
    startstandoff?: number
    clicktoshow?: boolean | string
    xclick?: number
    yclick?: number
    hovertext?: string
    hoverlabel?: {
      bgcolor?: string
      bordercolor?: string
      font?: {
        color?: string
        size?: number
        family?: string
      }
    }
    captureevents?: boolean
    name?: string
    templateitemname?: string
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }>
  shapes?: Array<{
    type?: string
    x0?: number | string
    y0?: number | string
    x1?: number | string
    y1?: number | string
    xref?: string
    yref?: string
    line?: {
      color?: string
      width?: number
      dash?: string
    }
    fillcolor?: string
    opacity?: number
    layer?: string
    visible?: boolean
    editable?: boolean
    name?: string
    templateitemname?: string
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }>
  images?: Array<{
    source?: string
    layer?: string
    sizex?: number
    sizey?: number
    sizing?: string
    opacity?: number
    x?: number | string
    y?: number | string
    xanchor?: string
    yanchor?: string
    xref?: string
    yref?: string
    visible?: boolean
    name?: string
    templateitemname?: string
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }>
  updatemenus?: Array<{
    type?: string
    direction?: string
    active?: number
    showactive?: boolean
    buttons?: Array<{
      label?: string
      method?: string
      args?: any[]
      args2?: any[]
      visible?: boolean
      execute?: boolean
    }>
    x?: number
    y?: number
    xanchor?: string
    yanchor?: string
    pad?: {
      t?: number
      b?: number
      l?: number
      r?: number
    }
    font?: {
      color?: string
      size?: number
      family?: string
    }
    bgcolor?: string
    bordercolor?: string
    borderwidth?: number
    visible?: boolean
    name?: string
    templateitemname?: string
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }>
  sliders?: Array<{
    active?: number
    steps?: Array<{
      args?: any[]
      label?: string
      method?: string
      value?: string
      visible?: boolean
      execute?: boolean
    }>
    len?: number
    lenmode?: string
    minorticklen?: number
    pad?: {
      t?: number
      b?: number
      l?: number
      r?: number
    }
    x?: number
    y?: number
    xanchor?: string
    yanchor?: string
    transition?: {
      duration?: number
      easing?: string
    }
    currentvalue?: {
      font?: {
        color?: string
        size?: number
        family?: string
      }
      offset?: number
      prefix?: string
      suffix?: string
      visible?: boolean
      xanchor?: string
    }
    font?: {
      color?: string
      size?: number
      family?: string
    }
    activebgcolor?: string
    bgcolor?: string
    bordercolor?: string
    borderwidth?: number
    tickcolor?: string
    ticklen?: number
    tickwidth?: number
    visible?: boolean
    name?: string
    templateitemname?: string
    uirevision?: string
    edittype?: string
    impliedEdits?: any
    _deprecated?: any
  }>
  dragmode?: string
  selectdirection?: string
  hoversubplots?: string
  clickmode?: string
  scene?: any
  geo?: any
  mapbox?: any
  polar?: any
  ternary?: any
  grid?: any
  calendar?: string
  newshape?: any
  activeshape?: any
  hidesources?: boolean
  barmode?: string
  bargap?: number
  bargroupgap?: number
  barnorm?: string
  boxmode?: string
  boxgap?: number
  boxgroupgap?: number
  violinmode?: string
  violingap?: number
  violingroupgap?: number
  waterfallmode?: string
  waterfallgap?: number
  waterfallgroupgap?: number
  funnelmode?: string
  funnelgap?: number
  funnelgroupgap?: number
  extendpiecolors?: boolean
  extendtreemapcolors?: boolean
  extendsunburstcolors?: boolean
  extendiciclecolors?: boolean
  extendtracecolors?: boolean
  colorway?: string[]
  colorscale?: any
  datarevision?: number | string
  transition?: {
    duration?: number
    easing?: string
    ordering?: string
  }
  uirevision?: string
  edittype?: string
  impliedEdits?: any
  _deprecated?: any
  template?: any
  meta?: any
  computed?: any
  _context?: any
  _fullLayout?: any
  _has_plotlyjs?: boolean
}

export interface PlotConfig {
  responsive?: boolean
  displayModeBar?: boolean
  displaylogo?: boolean
  modeBarButtonsToRemove?: string[]
  modeBarButtonsToAdd?: string[]
  toImageButtonOptions?: {
    format?: string
    filename?: string
    height?: number
    width?: number
    scale?: number
  }
  plotGlPixelRatio?: number
  setBackground?: string
  topojsonURL?: string
  mapboxAccessToken?: string
  locale?: string
  locales?: Record<string, any>
  editable?: boolean
  editSelection?: boolean
  autosizable?: boolean
  fillFrame?: boolean
  frameMargins?: number
  scrollZoom?: boolean
  doubleClick?: string | boolean
  showTips?: boolean
  showAxisDragHandles?: boolean
  showAxisRangeEntryBoxes?: boolean
  showLink?: boolean
  linkText?: string
  plotlyServerURL?: string
  staticPlot?: boolean
  typesetMath?: boolean
  queueLength?: number
  globalTransforms?: any[]
  watermark?: boolean
  showSendToCloud?: boolean
  showEditInChartStudio?: boolean
  notifyOnLogging?: boolean
  logging?: number
  globalTransform?: any
  MathJaxConfig?: any
  toImageFormat?: string
  toImageHeight?: number
  toImageWidth?: number
  toImageScale?: number
  doubleClickDelay?: number
}

export interface PlotResult {
  isPlot: boolean
  data: PlotData[]
  layout: PlotLayout
  config: PlotConfig
}

// Create plot function similar to Engineering-Solver
export function createPlot(data: PlotData[], layout: PlotLayout = {}, config: PlotConfig = {}): PlotResult {
  return {
    isPlot: true,
    data,
    layout,
    config
  }
}

// Utility class for common energy efficiency plots
export class EnergyPlots {
  
  // Create a simple line plot
  static createLinePlot(
    x: number[], 
    y: number[], 
    title?: string, 
    xLabel?: string, 
    yLabel?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x,
      y,
      type: 'scatter',
      mode: 'lines',
      name: options?.name || 'Data',
      line: {
        color: options?.line?.color || '#1f77b4',
        width: options?.line?.width || 2
      },
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'Line Plot',
      xaxis: { title: xLabel || 'X' },
      yaxis: { title: yLabel || 'Y' },
      showlegend: true,
      hovermode: 'closest'
    }
    
    return createPlot(data, layout, { responsive: true })
  }
  
  // Create a scatter plot
  static createScatterPlot(
    x: number[], 
    y: number[], 
    title?: string, 
    xLabel?: string, 
    yLabel?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x,
      y,
      type: 'scatter',
      mode: 'markers',
      name: options?.name || 'Data',
      marker: {
        color: options?.marker?.color || '#1f77b4',
        size: options?.marker?.size || 8
      },
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'Scatter Plot',
      xaxis: { title: xLabel || 'X' },
      yaxis: { title: yLabel || 'Y' },
      showlegend: true,
      hovermode: 'closest'
    }
    
    return createPlot(data, layout, { responsive: true })
  }
  
  // Create a bar chart
  static createBarChart(
    x: string[], 
    y: number[], 
    title?: string, 
    xLabel?: string, 
    yLabel?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x,
      y,
      type: 'bar',
      name: options?.name || 'Data',
      marker: {
        color: options?.marker?.color || '#1f77b4'
      },
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'Bar Chart',
      xaxis: { title: xLabel || 'Category' },
      yaxis: { title: yLabel || 'Value' },
      showlegend: true
    }
    
    return createPlot(data, layout, { responsive: true })
  }
  
  // Create a pressure-enthalpy diagram (P-h diagram)
  static createPressureEnthalpyDiagram(
    enthalpy: number[], 
    pressure: number[], 
    title?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x: enthalpy,
      y: pressure,
      type: 'scatter',
      mode: 'lines+markers',
      name: options?.name || 'Cycle',
      line: {
        color: options?.line?.color || '#ff7f0e',
        width: options?.line?.width || 3
      },
      marker: {
        color: options?.marker?.color || '#ff7f0e',
        size: options?.marker?.size || 8
      },
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'Pressure-Enthalpy Diagram',
      xaxis: { 
        title: 'Specific Enthalpy (kJ/kg)',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      yaxis: { 
        title: 'Pressure (bar)',
        type: 'log',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      showlegend: true,
      hovermode: 'closest',
      plot_bgcolor: '#f8f9fa'
    }
    
    return createPlot(data, layout, { responsive: true })
  }
  
  // Create a temperature-entropy diagram (T-s diagram)
  static createTemperatureEntropyDiagram(
    entropy: number[], 
    temperature: number[], 
    title?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x: entropy,
      y: temperature,
      type: 'scatter',
      mode: 'lines+markers',
      name: options?.name || 'Cycle',
      line: {
        color: options?.line?.color || '#2ca02c',
        width: options?.line?.width || 3
      },
      marker: {
        color: options?.marker?.color || '#2ca02c',
        size: options?.marker?.size || 8
      },
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'Temperature-Entropy Diagram',
      xaxis: { 
        title: 'Specific Entropy (kJ/kg·K)',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      yaxis: { 
        title: 'Temperature (°C)',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      showlegend: true,
      hovermode: 'closest',
      plot_bgcolor: '#f8f9fa'
    }
    
    return createPlot(data, layout, { responsive: true })
  }
  
  // Create an efficiency comparison chart
  static createEfficiencyComparison(
    systems: string[], 
    efficiencies: number[], 
    title?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x: systems,
      y: efficiencies,
      type: 'bar',
      name: options?.name || 'Efficiency',
      marker: {
        color: efficiencies.map(eff => eff > 85 ? '#2ca02c' : eff > 70 ? '#ff7f0e' : '#d62728') as string[],
        ...options?.marker
      },
      text: efficiencies.map(eff => `${eff.toFixed(1)}%`),
      textposition: 'auto',
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'System Efficiency Comparison',
      xaxis: { title: 'System' },
      yaxis: { 
        title: 'Efficiency (%)',
        range: [0, 100]
      },
      showlegend: false,
      plot_bgcolor: '#f8f9fa'
    }
    
    return createPlot(data, layout, { responsive: true })
  }
  
  // Create a psychrometric chart data
  static createPsychrometricData(
    dryBulbTemp: number[], 
    humidity: number[], 
    title?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x: dryBulbTemp,
      y: humidity,
      type: 'scatter',
      mode: 'lines+markers',
      name: options?.name || 'Process',
      line: {
        color: options?.line?.color || '#9467bd',
        width: options?.line?.width || 3
      },
      marker: {
        color: options?.marker?.color || '#9467bd',
        size: options?.marker?.size || 8
      },
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'Psychrometric Chart',
      xaxis: { 
        title: 'Dry Bulb Temperature (°C)',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      yaxis: { 
        title: 'Humidity Ratio (kg/kg)',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      showlegend: true,
      hovermode: 'closest',
      plot_bgcolor: '#f8f9fa'
    }
    
    return createPlot(data, layout, { responsive: true })
  }
  
  // Create a heat exchanger effectiveness plot
  static createHeatExchangerPlot(
    ntu: number[], 
    effectiveness: number[], 
    title?: string,
    options?: Partial<PlotData>
  ): PlotResult {
    const data: PlotData[] = [{
      x: ntu,
      y: effectiveness,
      type: 'scatter',
      mode: 'lines',
      name: options?.name || 'Effectiveness',
      line: {
        color: options?.line?.color || '#8c564b',
        width: options?.line?.width || 3
      },
      ...options
    }]
    
    const layout: PlotLayout = {
      title: title || 'Heat Exchanger Effectiveness',
      xaxis: { 
        title: 'NTU (Number of Transfer Units)',
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      yaxis: { 
        title: 'Effectiveness',
        range: [0, 1],
        showgrid: true,
        gridcolor: '#e0e0e0'
      },
      showlegend: true,
      hovermode: 'closest',
      plot_bgcolor: '#f8f9fa'
    }
    
    return createPlot(data, layout, { responsive: true })
  }
}

// Export default object with all utilities
export default {
  createPlot,
  EnergyPlots
}
