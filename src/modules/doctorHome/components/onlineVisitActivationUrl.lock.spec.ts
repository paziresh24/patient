import { readFileSync } from 'fs';
import { join } from 'path';

const NEW_URL = 'https://providers.paziresh24.com/app/activation-page/consult/cost';
const OLD_URL = 'https://dr.paziresh24.com/activation/consult/rules';

const urlsPath = join(process.cwd(), 'src', 'modules', 'doctorHome', 'utils', 'doctorPanelUrls.ts');
const togglePath = join(process.cwd(), 'src', 'modules', 'doctorHome', 'components', 'onlineVisitToggle.tsx');
const plasmicPath = join(
  process.cwd(),
  '.plasmic',
  'plasmic',
  'launcher',
  'PlasmicLauncherBlocksWidgetsNelson.tsx',
);
const feedPath = join(process.cwd(), 'src', 'modules', 'doctorHome', 'components', 'feedActionsSection.tsx');

describe('online visit activation URL lock', () => {
  const urls = readFileSync(urlsPath, 'utf8');
  const toggle = readFileSync(togglePath, 'utf8');
  const plasmic = readFileSync(plasmicPath, 'utf8');
  const feed = readFileSync(feedPath, 'utf8');

  it('points the live launcher widget and unused toggle at the new providers cost page', () => {
    expect(urls).toContain(NEW_URL);
    expect(toggle).toContain('DOCTOR_PANEL_URLS.consultActivation');
    expect(plasmic).toContain(NEW_URL);
    expect(urls).not.toContain(OLD_URL);
    expect(toggle).not.toContain(OLD_URL);
    expect(plasmic).not.toContain(OLD_URL);
  });

  it('keeps launcher navigation as router.push of that destination (same mechanism as before)', () => {
    expect(plasmic).toContain('__nextRouter?.push(destination)');
    expect(plasmic).toContain('item.id != "5532"');
    expect(plasmic).toContain('https://apigw.paziresh24.com/v1/user-center-services');
    expect(plasmic).toContain('https://apigw.paziresh24.com/v1/canbookingon&off');
  });

  it('opens the providers cost page in a new window from the doctor-home feed when online visit is not registered', () => {
    expect(feed).toContain('DOCTOR_PANEL_URLS.consultActivation');
    expect(feed).toContain("window.open(");
    expect(feed).toContain("'_blank'");
    expect(feed).not.toContain(OLD_URL);
    expect(feed).not.toContain('online-visit-activation');
    expect(feed).not.toContain('iframeKey="online-visit-activation"');
  });
});
