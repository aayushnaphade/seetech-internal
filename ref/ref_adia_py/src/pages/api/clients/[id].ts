import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db/prisma';

/**
 * GET: Fetch a client by ID
 * PUT: Update a client
 * DELETE: Delete a client
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Extract client ID from query
  const { id } = req.query;
  const clientId = Number(id);
  
  // Validate client ID
  if (isNaN(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID' });
  }
  
  try {
    if (req.method === 'GET') {
      // Get client by ID
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          projects: {
            include: {
              constants: true
            }
          }
        }
      });
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      return res.status(200).json(client);
      
    } else if (req.method === 'PUT') {
      const { name, location } = req.body;
      
      // Update client
      const client = await prisma.client.update({
        where: { id: clientId },
        data: {
          name,
          location,
        },
      });
      
      return res.status(200).json(client);
      
    } else if (req.method === 'DELETE') {
      // Check if client has projects
      const clientWithProjects = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          _count: {
            select: { projects: true }
          }
        }
      });
      
      if (clientWithProjects && clientWithProjects._count.projects > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete client with associated projects. Delete projects first.' 
        });
      }
      
      // Delete client
      await prisma.client.delete({
        where: { id: clientId }
      });
      
      return res.status(200).json({ message: 'Client deleted successfully' });
      
    } else {
      // Method not allowed
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
