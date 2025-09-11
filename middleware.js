import { NextResponse } from 'next/server'

export function middleware(request) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // In a real app, you'd check for JWT tokens or session cookies
    // For now, we'll let the client-side handle authentication
    // This is just a basic example - in production, use proper server-side auth
    
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
