import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;

  if (
    isLoggedIn !== "true" &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    request.nextUrl.pathname !== "/favicon.ico" &&
    !request.nextUrl.pathname.startsWith("/api") &&
    request.nextUrl.pathname !== "/cat.jpg"
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next|favicon.ico|api|cat\\.jpg).*)"],
};
