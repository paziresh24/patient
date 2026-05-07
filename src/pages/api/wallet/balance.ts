import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const katibeBaseUrl = publicRuntimeConfig.KATIBE_API_BASE_URL || 'https://katibe-api.paziresh24.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const token = req.cookies?.token;
    const response = await axios.get(`${katibeBaseUrl}/v1/transactions/balance/p24`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      timeout: 8000,
    });

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const data = error?.response?.data || { message: 'Failed to fetch wallet balance' };
    return res.status(status).json(data);
  }
}
