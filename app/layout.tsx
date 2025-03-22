import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Max from "@/components/max";
import { CartProvider } from "@/context/cart-context";
import SmoothScroll from "@/components/SmoothScrollWrapper/SmoothScroll";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background  text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <CartProvider>
              <main className="w-full min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col items-center">
                  <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <Max>
                      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-5 items-center font-semibold">
                          <Link href={"/"}>ShopGenie</Link>
                        </div>
                        <div className="flex gap-5 items-center font-semibold">
                          <HeaderAuth />
                          <ThemeSwitcher />
                        </div>
                      </div>
                    </Max>
                  </nav>
                  <Max>{children}</Max>
                </div>
              </main>
            </CartProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
