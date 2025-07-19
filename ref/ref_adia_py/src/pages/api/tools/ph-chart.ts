import { NextApiRequest, NextApiResponse } from 'next';
import { getPhChartData } from '../../../lib/calc/phChartLogic';

/**
 * GET: Get P-H chart data for plotting
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Get P-H chart data
    const phChartData = getPhChartData();
    
    return res.status(200).json(phChartData);
    
  } catch (error) {
    console.error('PH chart error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
