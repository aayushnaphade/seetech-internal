import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db/prisma';

/**
 * GET: Fetch a project by ID
 * PUT: Update a project
 * DELETE: Delete a project
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Extract project ID from query
  const { id } = req.query;
  const projectId = Number(id);
  
  // Validate project ID
  if (isNaN(projectId)) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }
  
  try {
    if (req.method === 'GET') {
      // Get project by ID
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          client: true,
          constants: true,
          toolResults: true,
        },
      });
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      return res.status(200).json(project);
      
    } else if (req.method === 'PUT') {
      const { name, constants } = req.body;
      
      // Update project and its constants if provided
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          name,
          constants: constants ? {
            upsert: {
              create: constants,
              update: constants,
            }
          } : undefined
        },
        include: {
          client: true,
          constants: true
        }
      });
      
      return res.status(200).json(project);
      
    } else if (req.method === 'DELETE') {
      // Delete project constants first (to avoid foreign key constraint error)
      await prisma.projectConstants.deleteMany({
        where: { projectId }
      });
      
      // Delete tool results
      await prisma.toolResult.deleteMany({
        where: { projectId }
      });
      
      // Delete project
      await prisma.project.delete({
        where: { id: projectId }
      });
      
      return res.status(200).json({ message: 'Project deleted successfully' });
      
    } else {
      // Method not allowed
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
