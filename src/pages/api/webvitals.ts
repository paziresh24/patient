import { Client } from '@elastic/elasticsearch';
import type { NextApiRequest, NextApiResponse } from 'next';

const client = new Client({
  node: '',
  auth: {
    username: 'elastic',
    password: 'changeme',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const data = req.body;

  await client.index({
    index: '',
    document: {
      ...data,
    },
  });

  return res.status(204);
}
