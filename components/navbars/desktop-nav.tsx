import Link from "next/link";
import { SearchButton } from "../search";
import { CartIcon } from "../cart";
import HeaderAuth from "../header-auth";
import { ThemeSwitcher } from "../theme-switcher";

interface NavLink {
  title: string;
  route: string;
}

interface DesktopNavProps {
  navlinks: NavLink[];
}

export default function DesktopNav({ navlinks }: DesktopNavProps) {
  return (
    <nav className="hidden md:block sticky top-2 z-50 w-full max-w-[1250px] mx-auto h-16 border-2 border-black/5 dark:border-white/5 bg-white/20 dark:bg-background/20 bg-opacity-50 backdrop-blur-2xl rounded-full">
      <div className="w-full mx-auto flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center font-semibold">
          <Link href="/" className="text-xl font-bold">
            KEEBHOUS
          </Link>
        </div>
        <div className="hidden lg:flex gap-8 items-center font-semibold pl-20">
          {navlinks.map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="uppercase text-base tracking-wide hover:text-primary transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <SearchButton />
          <CartIcon />
          <HeaderAuth />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
