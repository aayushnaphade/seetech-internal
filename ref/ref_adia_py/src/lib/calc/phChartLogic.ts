/**
 * P-H Chart Logic for refrigeration cycle calculations
 * 
 * Note: This is a simplified version of the Python refrigeration_dash.py logic
 * In a production environment, this would either:
 * 1. Call a backend API that runs the CoolProp calculations, or
 * 2. Use CoolProp.js (WebAssembly version) for client-side calculations
 */

/**
 * Fixed state points for the refrigeration cycles based on pre-computed values
 * These are derived from the refrigeration_dash.py calculations
 */
export const cycleStatePoints = {
  // OEM Cycle
  oem: {
    pressures: [307.7, 1244.0, 1244.0, 1244.0, 1244.0, 307.7, 307.7, 307.7], // kPa
    enthalpies: [412.8, 452.6, 452.6, 267.6, 267.6, 267.6, 267.6, 412.8], // kJ/kg
    temperatures: [7.0, 65.2, 65.2, 40.0, 40.0, 1.2, 1.2, 7.0], // °C
    entropies: [1.72, 1.80, 1.80, 1.22, 1.22, 1.22, 1.22, 1.72], // kJ/(kg·K)
    cop: 2.87
  },
  
  // Actual Operating Cycle
  actual: {
    pressures: [307.7, 1384.0, 1384.0, 1384.0, 1384.0, 307.7, 307.7, 307.7], // kPa
    enthalpies: [416.5, 464.3, 464.3, 278.7, 278.7, 278.7, 278.7, 416.5], // kJ/kg
    temperatures: [15.6, 78.3, 78.3, 44.1, 44.1, 1.2, 1.2, 15.6], // °C
    entropies: [1.75, 1.84, 1.84, 1.25, 1.25, 1.25, 1.25, 1.75], // kJ/(kg·K)
    cop: 2.6
  },
  
  // Optimized Solution Cycle
  optimized: {
    pressures: [307.7, 1159.0, 1159.0, 1159.0, 1159.0, 307.7, 307.7, 307.7], // kPa
    enthalpies: [416.5, 449.0, 449.0, 263.5, 263.5, 263.5, 263.5, 416.5], // kJ/kg
    temperatures: [15.6, 62.1, 62.1, 36.0, 36.0, 1.2, 1.2, 15.6], // °C
    entropies: [1.75, 1.82, 1.82, 1.21, 1.21, 1.21, 1.21, 1.75], // kJ/(kg·K)
    cop: 4.3
  }
};

/**
 * Saturation dome data points for the refrigerant (R134a)
 * These points define the phase envelope for plotting
 */
export const saturationDome = {
  // Liquid dome (saturated liquid line)
  liquidDome: {
    temperatures: Array.from({ length: 100 }, (_, i) => -40 + i), // -40°C to 59°C
    pressures: [51.2, 59.3, 68.3, 78.3, 89.6, 102.1, 116.1, 131.5, 148.6, 167.4, 
                188.1, 210.8, 235.7, 262.8, 292.4, 324.5, 359.3, 396.9, 437.5, 481.2, 
                528.2, 578.6, 632.7, 690.5, 752.3, 818.2, 888.5, 963.3, 1043.0, 1127.5, 
                1217.1, 1312.0, 1412.3, 1518.3, 1630.1, 1748.0, 1872.0, 2003.0, 2141.0, 
                2285.9, 2438.2, 2597.8, 2764.9, 2940.0, 3123.2, 3314.8, 3514.9, 3723.6, 
                3941.3, 4168.2, 4404.5, 4650.5, 4906.3, 5172.0, 5448.0, 5734.2, 6030.8, 
                6337.7, 6655.1, 6982.7, 7320.9, 7669.1, 8027.6, 8396.6, 8776.3, 9166.7, 
                9568.0, 9980.1, 10403.1, 10837.0, 11281.8, 11737.5, 12204.1, 12681.6, 
                13170.0, 13669.1, 14179.0, 14700.0, 15231.0, 15773.0, 16325.0, 16887.0, 
                17460.0, 18043.0, 18637.0, 19241.0, 19855.0, 20480.0, 21115.0, 21761.0, 
                22417.0, 23084.0, 23762.0, 24451.0, 25151.0, 25862.0, 26584.0, 27318.0], // kPa
    enthalpies: [200.0, 204.4, 208.8, 213.3, 217.7, 222.2, 226.7, 231.1, 235.6, 240.1, 
                244.6, 249.1, 253.7, 258.2, 262.8, 267.4, 271.9, 276.5, 281.2, 285.8, 
                290.5, 295.2, 299.9, 304.6, 309.3, 314.1, 318.9, 323.7, 328.5, 333.3, 
                338.2, 343.1, 348.0, 353.0, 357.9, 362.9, 368.0, 373.0, 378.1, 383.3, 
                388.4, 393.7, 398.9, 404.2, 409.6, 415.0, 420.5, 426.0, 431.6, 437.3, 
                443.1, 448.9, 454.8, 460.9, 467.0, 473.3, 479.7, 486.3, 493.0, 499.9, 
                507.0, 514.3, 521.8, 529.6, 537.6, 545.9, 554.6, 563.6, 572.9, 582.7, 
                593.0, 603.7, 615.0, 627.0, 639.8, 653.4, 667.9, 683.6, 700.5, 718.8, 
                738.8, 760.7, 785.1, 812.2, 842.7, 877.0, 916.4, 961.9, 1016.5, 1084.3, 
                1173.1, 1301.4, 1489.3, 1772.7, 2226.0, 2931.4, 4216.2, 6624.4] // kJ/kg
  },
  
  // Vapor dome (saturated vapor line)
  vaporDome: {
    temperatures: Array.from({ length: 100 }, (_, i) => -40 + i), // -40°C to 59°C
    pressures: [51.2, 59.3, 68.3, 78.3, 89.6, 102.1, 116.1, 131.5, 148.6, 167.4, 
                188.1, 210.8, 235.7, 262.8, 292.4, 324.5, 359.3, 396.9, 437.5, 481.2, 
                528.2, 578.6, 632.7, 690.5, 752.3, 818.2, 888.5, 963.3, 1043.0, 1127.5, 
                1217.1, 1312.0, 1412.3, 1518.3, 1630.1, 1748.0, 1872.0, 2003.0, 2141.0, 
                2285.9, 2438.2, 2597.8, 2764.9, 2940.0, 3123.2, 3314.8, 3514.9, 3723.6, 
                3941.3, 4168.2, 4404.5, 4650.5, 4906.3, 5172.0, 5448.0, 5734.2, 6030.8, 
                6337.7, 6655.1, 6982.7, 7320.9, 7669.1, 8027.6, 8396.6, 8776.3, 9166.7, 
                9568.0, 9980.1, 10403.1, 10837.0, 11281.8, 11737.5, 12204.1, 12681.6, 
                13170.0, 13669.1, 14179.0, 14700.0, 15231.0, 15773.0, 16325.0, 16887.0, 
                17460.0, 18043.0, 18637.0, 19241.0, 19855.0, 20480.0, 21115.0, 21761.0, 
                22417.0, 23084.0, 23762.0, 24451.0, 25151.0, 25862.0, 26584.0, 27318.0], // kPa
    enthalpies: [381.2, 383.3, 385.4, 387.5, 389.6, 391.7, 393.8, 395.8, 397.9, 399.9, 
                401.9, 403.8, 405.7, 407.6, 409.4, 411.2, 413.0, 414.7, 416.3, 417.9, 
                419.5, 421.0, 422.4, 423.8, 425.1, 426.3, 427.5, 428.6, 429.6, 430.6, 
                431.4, 432.2, 432.9, 433.5, 434.0, 434.4, 434.7, 434.9, 435.0, 435.0, 
                434.9, 434.6, 434.2, 433.7, 433.0, 432.1, 431.1, 429.9, 428.5, 426.8, 
                425.0, 422.9, 420.5, 417.8, 414.8, 411.5, 407.8, 403.7, 399.2, 394.2, 
                388.7, 382.7, 376.0, 368.7, 360.6, 351.7, 341.7, 330.5, 317.9, 303.5, 
                287.1, 268.1, 245.8, 218.8, 184.8, 139.4, 62.6, 62.6, 62.6, 62.6, 
                62.6, 62.6, 62.6, 62.6, 62.6, 62.6, 62.6, 62.6, 62.6, 62.6, 
                62.6, 62.6, 62.6, 62.6, 62.6, 62.6, 62.6, 62.6] // kJ/kg
  }
};

/**
 * Calculate the power consumption based on the cooling capacity and COP
 * @param coolingCapacity Cooling capacity in kW
 * @param cop Coefficient of Performance
 * @returns Power consumption in kW
 */
export function calculatePower(coolingCapacity: number, cop: number): number {
  return coolingCapacity / cop;
}

/**
 * Calculate the power savings percentage between two COPs
 * @param copBase Base COP value
 * @param copImproved Improved COP value
 * @returns Power savings percentage
 */
export function calculatePowerSavingsFromCOP(copBase: number, copImproved: number): number {
  // When COP increases by X%, power consumption decreases by [1 - 1/(1+X%)]
  return (1 - (copBase / copImproved)) * 100;
}

/**
 * Get a complete dataset for the P-H chart
 * Combines cycle state points with saturation dome data
 * @returns Complete dataset for plotting
 */
export function getPhChartData() {
  return {
    cycleStatePoints,
    saturationDome
  };
}
