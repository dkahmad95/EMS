import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {jwtVerify} from "jose";

const isMaintenance = false;
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const {payload} = (await jwtVerify(token, secret)) as {payload: Record<string, unknown>};
    return payload as DecodedToken;
  } catch (error) {
    // console.error('JWT verification failed:', error);
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

export async function middleware(req: NextRequest) {
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
  if (!decodedToken) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  if (url.pathname === "/") {
    url.pathname = "/ems";
    return NextResponse.redirect(url);
  }
  // const {navigation} = decodedToken.permissionGroup.permissions;

  if (url.pathname.startsWith("/ems")) {
    // const routePermissions = new Map<string, boolean>([
    //   ["/ems/accounting/cashManagement", navigation.CashManagement],
    //   ["/ems/accounting/expensesManagement", navigation.ExpensesManagement],
    //   ["/ems/controlPanel/acctSubCatManagement", navigation.SubCatManagement],
    //   ["/ems/controlPanel/permissionsManagement", navigation.PermissionsManagement],
    //   ["/ems/controlPanel/pricingManagement", navigation.PricingManagement],
    //   ["/ems/controlPanel/staffManagement", navigation.StaffManagement],
    //   ["/ems/controlPanel/structureManagement", navigation.StructureManagement],
    //   ["/ems/controlPanel/suppliersManagement", navigation.SuppliersManagement],
    //   ["/ems/dashboard", navigation.Dashboard],
    //   ["/ems/reports/sales", navigation.Reports],
    //   ["/ems/subscriptions/dataControl", navigation.MobileDataControl],
    //   ["/ems/subscriptions/subscribersManagement", navigation.SubscribersManagement],
    //   ["/ems/subscriptions/subscriptionsManagement", navigation.SubscriptionsManagement],
    // ]);

    // Find the most specific route that matches the current pathname
    let hasPermission = false;
    let matchedRoute = "";

    // Check if it's the base /ems route (always allowed for users)
    if (url.pathname === "/ems") {
      hasPermission = true;
    } else {
      // // Find the most specific matching route
      // for (const [route, permission] of routePermissions.entries()) {
      //   if (url.pathname.startsWith(route) && route.length > matchedRoute.length) {
      //     matchedRoute = route;
      //     hasPermission = permission;
      //   }
      // }
    }

    if (!hasPermission && url.pathname !== "/ems/unAutherized") {
      url.pathname = "/ems/unAutherized";
      return NextResponse.redirect(url);
    }
  }
  if (isMaintenance) return renderMaintenancePage();

  return NextResponse.next();
}

export const config = {
  matcher: ["/ems/:path*", "/"],
};
