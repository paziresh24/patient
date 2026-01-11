import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import config from 'next/config';

const { publicRuntimeConfig } = config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (publicRuntimeConfig.NO_INDEX === 'true') return res.send(`User-agent: *\nDisallow: /`);
  const headers = req.headers;
  try {
    const data = await axios.get('https://hamdast-workflow.paziresh24.com/webhook/robots', { params: { headers }, timeout: 5000 });
    return res.send(data.data);
  } catch (error) {
    return res.send('');
  }
}
