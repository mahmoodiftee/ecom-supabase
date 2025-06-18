import { type NextRequest } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileData = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    profileData = data;
  }

  const role = profileData?.role;

  const pathname = request.nextUrl.pathname;

  // const publicRoutes = ['/', '/home', '/keyboards', '/sign-in', '/sign-up', '/forgot-password'];
  // const userRoutes = ['/', '/home', '/keyboards', '/profile', '/cart', '/notifications', '/admin', '/confirm-payment', '/success'];

  // //Not logged in
  // if (!user) {
  //   if (!publicRoutes.includes(pathname)) {
  //     // Redirect to sign-in if trying to access restricted route
  //     return NextResponse.redirect(new URL('/sign-in', request.url));
  //   }
  // } else {


  //   //Logged in users
  //   if (role === 'user') {
  //     // user cannot access /dashboard* routes
  //     if (pathname.startsWith('/dashboard')) {
  //       return NextResponse.redirect(new URL('/', request.url));
  //     }
  //     // user can only access allowed userRoutes
  //     if (!userRoutes.includes(pathname)) {
  //       return NextResponse.redirect(new URL('/', request.url));
  //     }
  //   } else if (role === 'admin') {
  //     // admin can only access /dashboard* routes
  //     if (!pathname.startsWith('/dashboard')) {
  //       return NextResponse.redirect(new URL('/dashboard', request.url));
  //     }
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
