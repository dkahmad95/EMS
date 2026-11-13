import SideNav from "../Components/SideNav";
import SideNavShell from "../Components/SideNavShell";
import { PermissionsProvider } from "../contexts/PermissionsContext";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let decodedToken: DecodedToken | null = null;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (token) {
      decodedToken = decodeJwt(token) as DecodedToken;
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
  }

  return (
    <PermissionsProvider initialToken={decodedToken}>
      <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <SideNavShell>
          <SideNav />
        </SideNavShell>
        {/* Main content */}
        <main id="main" className="flex-grow min-h-0 overflow-y-auto flex flex-col bg-gray-50 p-5 md:p-7">
          {children}
        </main>
      </div>
    </PermissionsProvider>
  );
}
