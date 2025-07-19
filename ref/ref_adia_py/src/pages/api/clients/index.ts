import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/db/prisma';

/**
 * GET: Fetch all clients
 * POST: Create a new client
 */
export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Get all clients
      const clients = await prisma.client.findMany();
      return res.status(200).json(clients);
      
    } else if (req.method === 'POST') {
      const { name, location } = req.body;
      
      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: 'Client name is required' });
      }
      
      // Create a new client
      const client = await prisma.client.create({
        data: {
          name,
          location: location || '',
        },
      });
      
      return res.status(201).json(client);
      
    } else {
      // Method not allowed
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
