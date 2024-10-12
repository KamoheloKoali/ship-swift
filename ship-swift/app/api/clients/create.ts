import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, phone, address } = req.body;

    try {
      const newClient = await prisma.clients.create({
        data: { name, email, phone, address },
      });
      res.status(201).json(newClient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create client' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
