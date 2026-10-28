import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/signup" });

export const config = {
  matcher: ["/app/:path*", "/onboarding/:path*"],
};
