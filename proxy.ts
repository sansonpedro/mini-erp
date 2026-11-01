import { auth } from "@/lib/auth/server";
import { NextResponse, type NextRequest } from "next/server";

const authMiddleware = auth.middleware({ loginUrl: "/signup" });

export default function proxy(request: NextRequest) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  if (process.env.NODE_ENV === "production" && forwardedProtocol === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  return authMiddleware(request);
}

export const config = {
  matcher: ["/app/:path*", "/onboarding/:path*", "/workspaces/:path*"],
};
