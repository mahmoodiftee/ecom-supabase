import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Max from "@/components/max";
import { CartProvider } from "@/context/cart-context";
import SmoothScroll from "@/components/SmoothScrollWrapper/SmoothScroll";
import { Search, SearchButton } from "@/components/search";
import { CartDrawer, CartIcon } from "@/components/cart";
import { Toaster } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/server"; // Import the Supabase client
import { Products } from "@/types/products"; // Import the Products type

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch keyboards data from Supabase
  const supabase = await createClient();
  const { data: keyboards } = await supabase
    .from("keyboards")
    .select<"keyboards", Products>();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
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
                  <nav className="sticky top-0 z-50 w-full border-b border-b-foreground/10 h-16 bg-background/80 backdrop-blur-sm">
                    <Max>
                      <div className="w-full mx-auto flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-5 items-center font-semibold">
                          <Link href="/" className="text-xl font-bold">
                            LOGO
                          </Link>
                        </div>
                        <div className="flex items-center gap-4">
                          <SearchButton />
                          <CartIcon />
                          <HeaderAuth />
                          <ThemeSwitcher />
                        </div>
                      </div>
                    </Max>
                  </nav>
                  <Max>{children}</Max>
                  <CartDrawer />
                  <Search keyboards={keyboards || []} />
                  <Toaster />
                </div>
              </main>
            </CartProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
