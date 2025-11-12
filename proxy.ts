import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionCookie =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  const isAuthPage = pathname.startsWith("/sign-in");
  const isDashboard = pathname.startsWith("/dashboard");

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!sessionCookie && isDashboard) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/dashboard/:path*"],
};
