import { readFileSync } from 'fs';
import { join } from 'path';

describe('new online visit box wiring', () => {
  const services = readFileSync(join(process.cwd(), '.plasmic', 'Services.tsx'), 'utf8');
  const heading = readFileSync(
    join(process.cwd(), 'src', 'modules', 'profile', 'utils', 'replaceOnlineVisitHeading.ts'),
    'utf8',
  );

  it('keeps the Plasmic Services wrapper gated on new_onlinevisit_box', () => {
    expect(services).toContain('NEW_ONLINE_VISIT_BOX_FEATURE');
    expect(services).toContain('setAttributes');
    expect(services).toContain('buildOnlineVisitCtaText');
    expect(services).toContain('hideConsultWaitingTime');
    expect(services).toContain("data-new-online-visit-box");
    expect(services).toContain('wrapChildren');
    expect(services).toContain('replaceOnlineVisitHeading');
    expect(heading).toContain('آنلاین ویزیت شوید');
    expect(heading).toContain('همین الان آنلاین ویزیت شوید');
  });
});
