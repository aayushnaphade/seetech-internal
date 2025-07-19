import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db/prisma';
import { calculateResults, ProjectConstants } from '../../../lib/calc/businessLogic';

/**
 * POST: Calculate results for adiabatic cooling tool
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { projectId, saveResults = true } = req.body;
    
    // Validate project ID
    if (!projectId || isNaN(Number(projectId))) {
      return res.status(400).json({ message: 'Valid project ID is required' });
    }
    
    // Get project constants
    const projectConstants = await prisma.projectConstants.findUnique({
      where: { projectId: Number(projectId) }
    });
    
    if (!projectConstants) {
      return res.status(404).json({ message: 'Project constants not found' });
    }
    
    // Convert from database model to business logic model
    const calculationConstants: ProjectConstants = {
      clientName: projectConstants.clientName,
      clientLocation: projectConstants.clientLocation,
      reportDate: projectConstants.reportDate,
      preparedBy: projectConstants.preparedBy,
      chillerCapacityTR: projectConstants.chillerCapacityTR,
      chillerType: projectConstants.chillerType,
      workingDays: projectConstants.workingDays,
      operatingHours: projectConstants.operatingHours,
      initialPowerKW: projectConstants.initialPowerKW,
      actualPowerKW: projectConstants.actualPowerKW,
      expectedPowerReductionPct: projectConstants.expectedPowerReductionPct,
      electricityTariff: projectConstants.electricityTariff,
      waterCost: projectConstants.waterCost,
      totalCFM: projectConstants.totalCFM,
      waterConsumption: projectConstants.waterConsumption,
      tdsRecommendation: projectConstants.tdsRecommendation,
      projectCost: projectConstants.projectCost,
      maintenancePct: projectConstants.maintenancePct,
      gridEmissionFactor: projectConstants.gridEmissionFactor,
      inflationRate: projectConstants.inflationRate,
      discountRate: projectConstants.discountRate,
      projectLife: projectConstants.projectLife,
      tempReductionC: projectConstants.tempReductionC || undefined,
      copOem: projectConstants.copOem || undefined,
      copActual: projectConstants.copActual || undefined,
      copOptimized: projectConstants.copOptimized || undefined
    };
    
    // Perform calculations
    const results = calculateResults(calculationConstants);
    
    // Save results to database if requested
    if (saveResults) {
      await prisma.toolResult.create({
        data: {
          projectId: Number(projectId),
          toolType: 'adiabatic_cooling',
          inputs: JSON.stringify(calculationConstants),
          outputs: JSON.stringify(results)
        }
      });
    }
    
    return res.status(200).json(results);
    
  } catch (error) {
    console.error('Calculation error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
