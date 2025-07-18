// Main utilities index
// Exports all utilities including CoolProp WASM integration for SeeTech energy efficiency tools

// CoolProp WASM Integration (Your actual CoolProp library)
export * from './coolprop-integration'

// Plotting utilities
export * from './plotting/plotly-utils'

// Re-export CoolProp functions
export {
  initializeLibraries,
  loadCoolProp,
  loadMathJS,
  props,
  HAprops,
  phase,
  MM,
  plot,
  math,
  useCoolProp,
  type CoolPropModule
} from './coolprop-integration'

// Plotting utilities
export {
  createPlot,
  EnergyPlots,
  type PlotData,
  type PlotLayout,
  type PlotConfig,
  type PlotResult
} from './plotting/plotly-utils'
