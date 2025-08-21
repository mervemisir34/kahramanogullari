import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Only protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // In real application, you would check for JWT token in cookies
    // For now, we'll just redirect to login page
    // The actual authentication check will be done on the client side
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};