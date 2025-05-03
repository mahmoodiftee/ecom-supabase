import { type NextRequest } from "next/server";
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Define public and auth routes
  const publicRoutes = ['/','/home', '/about', '/contact', '/products'];
  const authRoutes = ['/sign-in', '/sign-up', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
  const isAuthFolderRoute = request.nextUrl.pathname.startsWith('/(auth-pages)');

  // If user is logged in and tries to access auth route, redirect to home
  if (user && (isAuthRoute || isAuthFolderRoute)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is not logged in and tries to access protected route
  if (!user && !isPublicRoute && !isAuthRoute && !isAuthFolderRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};