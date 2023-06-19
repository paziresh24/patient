import { isPWA } from '@/common/utils/isPwa';
import { getAnalytics, isSupported } from 'firebase/analytics';
import config from 'next/config';
import app from './config';
const { publicRuntimeConfig } = config();

const analytics = publicRuntimeConfig.IS_FIREBASE_ENABLE ? isSupported().then(yes => (yes && isPWA() ? getAnalytics(app) : null)) : null;

export default analytics;
