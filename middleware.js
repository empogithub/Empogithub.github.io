
import { next } from "@vercel/functions";

// EMPO.CC MAINTENANCE TOGGLE
const MAINTENANCE_MODE = true;

export async function middleware(request) {
  const url = new URL(request.url);

  // Never intercept the maintenance page itself
  if (url.pathname.startsWith("/maintenance")) {
    return next();
  }

  // Normal website
  if (!MAINTENANCE_MODE) {
    return next();
  }

  // Load your existing maintenance page
  const maintenanceUrl = new URL("/maintenance/", request.url);
  const page = await fetch(maintenanceUrl);

  return new Response(page.body, {
    status: 503,
    headers: {
      "Content-Type": page.headers.get("Content-Type") || "text/html; charset=utf-8",
      "Retry-After": "3600",
      "Cache-Control": "no-store"
    }
  });
}

export const config = {
  matcher: ["/:path*"]
};
