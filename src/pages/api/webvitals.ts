import { Client } from '@elastic/elasticsearch';
import type { NextApiRequest, NextApiResponse } from 'next';

const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME ?? '',
    password: process.env.ELASTIC_PASSWORD ?? '',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const data = JSON.parse(req.body);
  client
    .index({
      index: 'webvitals',
      document: {
        ...data,
        '@timestamp': new Date(),
      },
    })
    .then(() => {
      return res.status(204).json({});
    })
    .catch(() => {
      return res.status(204).json({});
    });
}
