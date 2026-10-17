import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Case-insensitive short link: any capitalization of /aisecondactover50
// (e.g. /AISecondActOver50, /AISECONDACTOVER50) redirects to the Amazon
// book page. Non-lowercase variants first normalize to the canonical
// lowercase path (308), so the redirect rule can never match its own
// destination and loop.
const SHORT_LINK_PATH = "/aisecondactover50";
const SHORT_LINK_TARGET = "https://www.amazon.com/dp/B0HL43MYJY";

export default clerkMiddleware(async (_auth, request) => {
  const pathname = request.nextUrl.pathname;
  if (pathname.toLowerCase() === SHORT_LINK_PATH) {
    if (pathname !== SHORT_LINK_PATH) {
      const url = request.nextUrl.clone();
      url.pathname = SHORT_LINK_PATH;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.redirect(SHORT_LINK_TARGET, 307);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
