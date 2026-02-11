import SideNav from "../Components/SideNav";
import { PermissionsProvider } from "../contexts/PermissionsContext";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

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
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto">{children}</div>
      </div>
    </PermissionsProvider>
  );
}