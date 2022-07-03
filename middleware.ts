import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const p24Session = request.cookies.get("P24SESSION");
  const certificate = request.cookies.get("certificate");
  const siginPageRedirectUrl = new URL(
    `/signin/?url=https://www.paziresh24.com/patient/appointments`,
    request.url
  );
  console.log(siginPageRedirectUrl);
  if (!certificate || !p24Session) {
    return NextResponse.redirect(siginPageRedirectUrl);
  }
}

export const config = {
  matcher: "/appointments",
};
