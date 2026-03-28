import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isDashboardRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/ai-tools(.*)",
  "/team(.*)",
  "/billing(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|trackers)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
