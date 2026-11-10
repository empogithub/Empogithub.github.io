
import { next } from "@vercel/functions";

// EMPO.CC MAINTENANCE TOGGLE
const MAINTENANCE_MODE = true;

export const config = {
  runtime: "nodejs"
};

export default async function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/maintenance")) {
    return next();
  }

  if (!MAINTENANCE_MODE) {
    return next();
  }

  try {
    const page = await fetch(
      new URL("/maintenance/index.html", request.url)
    );

    if (!page.ok) {
      throw new Error("Maintenance page not found");
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
    console.error(error);

    return new Response("Empo.cc is temporarily under maintenance.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }
}
