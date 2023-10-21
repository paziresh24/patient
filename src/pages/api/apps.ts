import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
  const isDoctor = req.query.is_doctor === 'true';

  try {
    const installedApps = await axios.get(
      `https://bazaar.paziresh24.com/wp-json/custom/v1/orders-by-phone/?phone=${req.query.phone_number}`,
    );

    const apps = [...installedApps.data.map(async (item: any) => await axios.get(item.app_link))];
    let defaultDoctorApps: any = [];
    if (isDoctor) {
      apps.push(await axios.get('https://dr.paziresh24.com/drapp-manifest.json'));
      defaultDoctorApps = [
        await axios.get('https://dr.paziresh24.com/wallet-manifest.json'),
        await axios.get('https://dr.paziresh24.com/ravi-manifest.json'),
        await axios.get('https://dr.paziresh24.com/forough-manifest.json'),
      ];
    }

    const appManifests = await Promise.allSettled(apps);
    const defaultDoctorAppsManifests = await Promise.allSettled(defaultDoctorApps);

    return res.status(200).json([
      ...appManifests
        .reverse()
        .filter(item => item.status === 'fulfilled')
        .map(item => item.status === 'fulfilled' && { ...item.value?.data, pin: true }),
      ...defaultDoctorAppsManifests
        .reverse()
        .filter(item => item.status === 'fulfilled')
        .map(item => item.status === 'fulfilled' && { ...item.value?.data, pin: false }),
    ]);
  } catch (error) {
    console.error('ERROR: /api/apps >>>>', error);
    return res.status(200).json([]);
  }
}
