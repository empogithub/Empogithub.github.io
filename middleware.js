
import { next } from "@vercel/functions";

// ==================================
// EMPO.CC MAINTENANCE CONFIGURATION
// ==================================

const MAINTENANCE_MODE = true;

// false = Website online
// true  = Maintenance mode

export const config = {
  runtime: "nodejs"
};

export default async function middleware(request) {
  const url = new URL(request.url);

  // Allow the existing maintenance page
  if (url.pathname.startsWith("/maintenance")) {
    return next();
  }

  // Allow static assets (CSS, JS, images, fonts)
  if (/\.(css|js|png|jpg|jpeg|svg|webp|ico|woff2?)$/i.test(url.pathname)) {
    return next();
  }

  // Normal website
  if (!MAINTENANCE_MODE) {
    return next();
  }

  // Fetch the existing maintenance page
  const maintenanceUrl = new URL("/maintenance/", request.url);
  const page = await fetch(maintenanceUrl);

  return new Response(page.body, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": "3600",
      "Cache-Control": "no-store"
    }
  });
}
