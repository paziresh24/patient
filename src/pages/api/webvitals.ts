import { Client } from '@elastic/elasticsearch';
import type { NextApiRequest, NextApiResponse } from 'next';

const client = new Client({
  node: 'http://192.168.216.72:9200',
  auth: {
    username: 'elastic',
    password: 'Elastic_25015015',
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
    });
}
