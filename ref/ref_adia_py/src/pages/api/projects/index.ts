import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db/prisma';

/**
 * GET: Fetch all projects
 * POST: Create a new project
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Get all projects with client data
      const projects = await prisma.project.findMany({
        include: {
          client: true,
          constants: true,
        },
      });
      
      return res.status(200).json(projects);
      
    } else if (req.method === 'POST') {
      const { name, clientId, constants } = req.body;
      
      // Create a new project
      const project = await prisma.project.create({
        data: {
          name,
          clientId,
          constants: constants ? {
            create: constants
          } : undefined
        },
        include: {
          client: true,
          constants: true
        }
      });
      
      return res.status(201).json(project);
      
    } else {
      // Method not allowed
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
