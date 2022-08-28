import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const p24Session = request.cookies.get('P24SESSION');
  const certificate = request.cookies.get('certificate');
  const siginPageRedirectUrl = new URL(`/signin/?url=${process.env.CLINIC_BASE_URL}/patient/appointments`, request.url);
  if (process.env.NODE_ENV !== 'development' && (!certificate || !p24Session)) {
    return NextResponse.redirect(siginPageRedirectUrl);
  }
}

export const config = {
  matcher: '/appointments',
};
