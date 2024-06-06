import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { GrowthBook } from '@growthbook/growthbook-react';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
  const isDoctor = req.query.is_doctor === 'true';

  const growthbookContext = getServerSideGrowthBookContext(req as NextApiRequest);
  const growthbook = new GrowthBook(growthbookContext);
  growthbook.setAttributes({ user_id: req.query.user_id });
  await growthbook.loadFeatures({ timeout: 1000 });

  const drappConfig = growthbook.getFeatureValue('hamdast::drapp', []);

  try {
    let defaultDoctorApps: any = [];
    if (isDoctor) {
      defaultDoctorApps = [
        await axios.get('https://dr.paziresh24.com/wallet-manifest.json'),
        await axios.get('https://dr.paziresh24.com/forough-manifest.json'),
        await axios.get('https://dr.paziresh24.com/drapp-manifest.json'),
      ];
    }
    const defaultDoctorAppsManifests = await Promise.allSettled(defaultDoctorApps);
    // let installedApp: any[] = [];
    // try {
    //   const installedAppsRes = await axios.get(`https://bazaar.paziresh24.com/api/v1/installations?user_id=${req.query.user_id}`);
    //   installedApp = [...installedAppsRes.data.map((item: any) => ({ ...item.manifest, installation_id: item.id }))];
    // } catch (error) {
    //   console.error('ERROR: /api/apps >>>>', error);
    // }
    const appsArray = [
      // ...installedApp.map(item => ({ ...item, pin: true, manifest: '' })),
      ...defaultDoctorAppsManifests
        .reverse()
        .filter(item => item.status === 'fulfilled')
        .map(
          item =>
            item.status === 'fulfilled' && {
              ...item.value?.data,
              pin: false,
              manifest: item.value?.config?.url,
              ...(item.value?.data?.key === 'drapp' ? { navigation_items: [...drappConfig] } : undefined),
            },
        ),
    ];

    let merged = appsArray.reduce((accumulator, item) => {
      if (accumulator[item.key]) {
        accumulator[item.key].navigation_items = accumulator[item.key].navigation_items.concat(item.navigation_items);
      } else {
        accumulator[item.key] = { ...item };
      }
      return accumulator;
    }, {});

    return res.status(200).json(Object.values(merged));
  } catch (error) {
    console.error('ERROR: /api/apps >>>>', error);
    return res.status(200).json([]);
  }
}
