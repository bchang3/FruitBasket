// middleware.ts

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.SERVER_SIGN_KEY);

export async function middleware(req: NextRequest) {
  let loggedIn = false;
  const loginToken = req.cookies.get("loginToken")?.value;
  const response = NextResponse.next();
  if (loginToken) {
    try {
      const { payload } = await jwtVerify(loginToken, SECRET_KEY); // Verify JWT
      loggedIn = payload.loggedIn === true;
    } catch (error) {
      //invalid token
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      loggedIn = false;
      response.headers.set(
        "Set-Cookie",
        "loginToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
      );
      return NextResponse.redirect(url, { headers: response.headers });
    }
  }
  if (req.nextUrl.pathname.startsWith("/login")) {
    if (loggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url, { headers: response.headers });
    }
  } else {
    if (!loggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url, { headers: response.headers });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
