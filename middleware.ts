import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/admin/dashboard(.*)"]);
const isClerkRoute = createRouteMatcher(["/admin/login(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Permitir todas as rotas do Clerk sem interferência
  if (isClerkRoute(req)) {
    return;
  }

  // Proteger apenas as rotas do dashboard
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
