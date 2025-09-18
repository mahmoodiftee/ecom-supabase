import type React from "react";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import SmoothScroll from "@/components/SmoothScrollWrapper/SmoothScroll";
import { CartDrawer } from "@/components/cart";
// import { Toaster } from "@/components/ui/toaster";
import { Toaster } from "@/components/ui/sonner";
import DesktopNav from "@/components/navbars/desktop-nav";
import MobileNav from "@/components/navbars/mobile-nav";
import { UserProvider } from "@/context/ProfileContext";
import { UserProvider as UserProvider2 } from "@/context/UserContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "",
  description: "",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const navlinks = [
  { title: "Keyboards", route: "/keyboards" },
  { title: "About", route: "/about" },
  { title: "Contact", route: "/contact" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  let role = null;

  if (user) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      role = data.role
    }
  }
  // console.log(role);
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground" cz-shortcut-listen="false">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <CartProvider>
              <UserProvider>
                <UserProvider2>
                  <main className="w-full min-h-screen flex flex-col items-center">
                    <div className="flex-1 w-full flex flex-col items-center">
                      {role !== "admin" && <DesktopNav navlinks={navlinks} />}
                      {role !== "admin" && <MobileNav navlinks={navlinks} />}
                      {role === "admin" ? (
                        <SidebarProvider>
                          {children}
                        </SidebarProvider>
                      ) : (
                        children
                      )
                      }
                      <CartDrawer />
                      <Toaster position="bottom-left" />
                    </div>
                  </main>
                </UserProvider2>
              </UserProvider>
            </CartProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html >
  );
}
