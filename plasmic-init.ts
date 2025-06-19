import { initPlasmicLoader } from '@plasmicapp/loader-nextjs';
import config from 'next/config';

const { publicRuntimeConfig } = config();

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: publicRuntimeConfig.PLASMIC_PROJECT_ID,
      token: publicRuntimeConfig.PLASMIC_PROJECT_TOKEN,
    },
  ],
  preview: true,
});
