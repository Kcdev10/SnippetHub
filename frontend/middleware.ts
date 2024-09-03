import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  const cookies = request.headers.get("cookie");
  // const access_token = request.headers.get("loca")
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/auth/authenticate`,
    {
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
        // Authorization: `Bearer ${access_token}`,
      },
      credentials: "include",
    }
  );
  const userAuth = await data.json();

  if (path === "/auth/login" || path === "/auth/register") {
    if (userAuth.success) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If not authenticated, redirect to login
  if (!userAuth.success) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/auth/:path*", "/user/profile/:path*", "/folder"],
};
