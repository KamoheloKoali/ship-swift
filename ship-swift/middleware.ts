import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import getCurrentUserClerkDetails from "./app/utils/getCurrentUserDetails";
import { getDriverByID } from "./actions/driverActions";
import { getClientById } from "./actions/clientActions";
import { NextResponse } from "next/server"; // Used for redirection

// Add your track-delivery/[deliveryId] route to the list of public routes
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/track-delivery(.*)", // Make /track-delivery/[deliveryId] public
  "/onboarding(.*)", // Make onboarding page public
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = auth();

  // If it's a public route, proceed as usual
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // If user is authenticated, check onboarding status
  // if (userId) {
  //   // If onboarding is not completed, redirect to the onboarding page
  //   return NextResponse.redirect(new URL("/onboarding", request.url));
  // } else {
  auth().protect();
  // }

  // Allow the request to continue as usual
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
