import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    success: true,
    message: 'Vercel backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}