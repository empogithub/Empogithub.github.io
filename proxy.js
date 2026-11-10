
import { next } from "@vercel/functions";

// =====================================
// EMPO.CC MAINTENANCE TOGGLE
// =====================================

const MAINTENANCE_MODE = true;

// false = Website online
// true  = Maintenance mode

export default async function proxy(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Allow the existing maintenance page
  if (path.startsWith("/maintenance")) {
    return next();
  }

  // Allow website assets
  if (
    /\.(css|js|mjs|png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)$/i.test(path) ||
    /^\/(assets|css|js|images|fonts|img|scripts|styles)\//i.test(path)
  ) {
    return next();
  }

  // Website online
  if (!MAINTENANCE_MODE) {
    return next();
  }

  // Serve the existing maintenance page
  try {
    const maintenanceURL = new URL(
      "/maintenance/index.html",
      request.url
    );

    const page = await fetch(maintenanceURL);

    if (!page.ok) {
      return new Response("Maintenance page could not be loaded.", {
        status: 503
      });
    }

    return new Response(page.body, {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": "3600",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Maintenance error:", error);

    return new Response("Empo.cc is temporarily unavailable.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }
}
