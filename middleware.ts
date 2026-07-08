import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {jwtVerify} from "jose";

const isMaintenance = false;
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const {payload} = (await jwtVerify(token, secret)) as {payload: Record<string, unknown>};
    return payload as unknown as DecodedToken;
  } catch (error) {
    return null;
  }
}

function renderMaintenancePage() {
  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: sans-serif; text-align: center; background-color: #fff; }
        img { max-width: 1200px; margin-top: 200px; }
      </style>
    </head>
    <body>
      <img src="/Maintenance.png" alt="صورة الصيانة" />
    </body>
    </html>
  `;
  return new NextResponse(html, {
    headers: {"Content-Type": "text/html"},
  });
}

// Route prefix -> required permission. Most specific prefix wins.
// Route names are case-sensitive and must match the app/ folder names.
function hasRoutePermission(pathname: string, token: DecodedToken): boolean {
  if (token.is_admin) return true;

  const permissions = token.permissions;
  const routePermissions = new Map<string, boolean>([
    ["/ems/Dashboard", permissions?.dashboard?.access ?? false],
    ["/ems/EmployeesList", permissions?.employees?.read ?? false],
    ["/ems/Revenues", permissions?.revenues?.read ?? false],
    ["/ems/Collections", permissions?.collections?.read ?? false],
    ["/ems/UsersList", permissions?.users?.read ?? false],
    ["/ems/Preperations", permissions?.control_panel?.access ?? false],
  ]);

  // Base /ems and the unauthorized page are open to any authenticated user
  if (pathname === "/ems" || pathname.startsWith("/ems/unAutherized")) {
    return true;
  }

  let matchedRoute = "";
  let hasPermission = false;
  for (const [route, permission] of routePermissions.entries()) {
    if (pathname.startsWith(route) && route.length > matchedRoute.length) {
      matchedRoute = route;
      hasPermission = permission;
    }
  }

  // Unknown /ems sub-route: allow authenticated users (Next.js will 404 if it doesn't exist)
  if (!matchedRoute) return true;

  return hasPermission;
}

export async function middleware(req: NextRequest) {
  if (isMaintenance) return renderMaintenancePage();

  const token = req.cookies.get("access_token")?.value;
  const url = req.nextUrl.clone();

  if (!token) {
    if (url.pathname !== "/") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const decodedToken = await verifyToken(token);
  // Invalid/expired token, or a token from before the `offices` payload change:
  // clear the cookie and send the user back to the login page.
  if (!decodedToken || !Array.isArray(decodedToken.offices)) {
    url.pathname = "/";
    const response =
      req.nextUrl.pathname === "/" ? NextResponse.next() : NextResponse.redirect(url);
    response.cookies.delete("access_token");
    return response;
  }

  if (url.pathname === "/") {
    url.pathname = "/ems";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/ems") && !hasRoutePermission(url.pathname, decodedToken)) {
    url.pathname = "/ems/unAutherized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ems/:path*", "/"],
};
