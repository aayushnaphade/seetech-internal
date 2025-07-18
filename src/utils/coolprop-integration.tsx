// CoolProp WASM Integration for SeeTech
// This integrates the actual CoolProp WASM library from your Engineering-Solver project

import React from 'react';

declare global {
  interface Window {
    Module: any;
    props: (property: string, fluid: string, fluidProperties: any) => any;
    HAprops: (property: string, fluidProperties: any) => any;
    phase: (fluid: string, fluidProperties: any) => string;
    MM: (formula: string) => any;
    plot: (data: any[], layout?: any, config?: any) => any;
    math: any;
  }
}

// CoolProp WASM Module interface
interface CoolPropModule {
  PropsSI: (property: string, prop1: string, value1: number, prop2: string, value2: number, fluid: string) => number;
  HAPropsSI: (property: string, prop1: string, value1: number, prop2: string, value2: number, prop3: string, value3: number) => number;
  get_global_param_string: (param: string) => string;
  get_param_index: (param: string) => number;
  get_fluid_param_string: (fluid: string, param: string) => string;
}

// Load CoolProp WASM module
export const loadCoolProp = async (): Promise<CoolPropModule> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Module) {
      resolve(window.Module);
      return;
    }

    // Load the CoolProp script
    const script = document.createElement('script');
    script.src = '/coolprop.js';
    script.onload = () => {
      // Wait for the module to be ready
      const checkModule = () => {
        if (window.Module && window.Module.PropsSI) {
          resolve(window.Module);
        } else {
          setTimeout(checkModule, 100);
        }
      };
      checkModule();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Load Math.js
export const loadMathJS = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.math) {
      resolve(window.math);
      return;
    }

    const script = document.createElement('script');
    script.src = '/math.js';
    script.onload = () => {
      if (window.math) {
        resolve(window.math);
      } else {
        reject(new Error('Math.js failed to load'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Initialize CoolProp and Math.js
export const initializeLibraries = async () => {
  try {
    const [coolprop, math] = await Promise.all([
      loadCoolProp(),
      loadMathJS()
    ]);

    // Load the helper functions
    await loadHelperFunctions();

    return { coolprop, math };
  } catch (error) {
    console.error('Failed to initialize libraries:', error);
    throw error;
  }
};

// Load helper functions (fluidProperties.js and molecularMass.js)
const loadHelperFunctions = async () => {
  return new Promise((resolve, reject) => {
    // Load fluidProperties.js
    const fluidPropsScript = document.createElement('script');
    fluidPropsScript.src = '/fluidProperties.js';
    fluidPropsScript.onload = () => {
      // Load molecularMass.js
      const molecularMassScript = document.createElement('script');
      molecularMassScript.src = '/molecularMass.js';
      molecularMassScript.onload = () => resolve(true);
      molecularMassScript.onerror = reject;
      document.head.appendChild(molecularMassScript);
    };
    fluidPropsScript.onerror = reject;
    document.head.appendChild(fluidPropsScript);
  });
};

// TypeScript wrapper for props function
export const props = (property: string, fluid: string, fluidProperties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.props) {
    return window.props(property, fluid, fluidProperties);
  }
  throw new Error('CoolProp not loaded. Call initializeLibraries() first.');
};

// TypeScript wrapper for HAprops function
export const HAprops = (property: string, fluidProperties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.HAprops) {
    return window.HAprops(property, fluidProperties);
  }
  throw new Error('CoolProp not loaded. Call initializeLibraries() first.');
};

// TypeScript wrapper for phase function
export const phase = (fluid: string, fluidProperties: Record<string, any>): string => {
  if (typeof window !== 'undefined' && window.phase) {
    return window.phase(fluid, fluidProperties);
  }
  throw new Error('CoolProp not loaded. Call initializeLibraries() first.');
};

// TypeScript wrapper for MM function
export const MM = (formula: string) => {
  if (typeof window !== 'undefined' && window.MM) {
    return window.MM(formula);
  }
  throw new Error('Molecular mass function not loaded. Call initializeLibraries() first.');
};

// TypeScript wrapper for plot function
export const plot = (data: any[], layout?: any, config?: any) => {
  if (typeof window !== 'undefined' && window.plot) {
    return window.plot(data, layout, config);
  }
  throw new Error('Plot function not loaded. Call initializeLibraries() first.');
};

// Math.js wrapper
export const math = {
  evaluate: (expression: string) => {
    if (typeof window !== 'undefined' && window.math) {
      return window.math.evaluate(expression);
    }
    throw new Error('Math.js not loaded. Call initializeLibraries() first.');
  },
  unit: (value: number | string, unit?: string) => {
    if (typeof window !== 'undefined' && window.math) {
      return window.math.unit(value, unit);
    }
    throw new Error('Math.js not loaded. Call initializeLibraries() first.');
  },
  number: (value: any, unit?: string) => {
    if (typeof window !== 'undefined' && window.math) {
      return window.math.number(value, unit);
    }
    throw new Error('Math.js not loaded. Call initializeLibraries() first.');
  }
};

// React hook for using CoolProp
export const useCoolProp = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    initializeLibraries()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return {
    isLoaded,
    error,
    props,
    HAprops,
    phase,
    MM,
    plot,
    math
  };
};

// Export the module interface
export type { CoolPropModule };
export default {
  initializeLibraries,
  loadCoolProp,
  loadMathJS,
  props,
  HAprops,
  phase,
  MM,
  plot,
  math,
  useCoolProp
};
