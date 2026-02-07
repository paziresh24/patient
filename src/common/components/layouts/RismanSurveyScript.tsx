import Script from 'next/script';
import { useRouter } from 'next/router';

const SCRIPT_URL =
  process.env.NEXT_PUBLIC_RISMAN_SURVEY_SCRIPT_URL ||
  'https://risman.s3.ir-thr-at1.arvanstorage.ir/risman-survey-porsline.js';

function shouldLoadSurvey(pathname: string): boolean {
  return pathname.startsWith('/dr/') || pathname.startsWith('/s/');
}

export function RismanSurveyScript() {
  const router = useRouter();
  const load = shouldLoadSurvey(router.pathname);

  if (!load) return null;

  return <Script src={SCRIPT_URL} strategy="lazyOnload" />;
}
