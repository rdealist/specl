import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionUserId } from '@/server/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/prd'];
  const protectedApiRoutes = ['/api/documents', '/api/ai'];

  // Check if current path matches protected routes
  const isProtectedPage = protectedRoutes.some((route) => pathname.startsWith(route));
  const isProtectedApi = protectedApiRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedPage || isProtectedApi) {
    try {
      const userId = await getSessionUserId();

      if (!userId) {
        // Redirect to login for web pages
        if (isProtectedPage) {
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(loginUrl);
        }

        // Return 401 for API routes
        if (isProtectedApi) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      }
    } catch (error) {
      console.error('Auth middleware error:', error);

      if (isProtectedPage) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (isProtectedApi) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login, register, and root pages
     */
    '/((?!_next/static|_next/image|favicon.ico|public|login|register|api/auth|$).*)',
  ],
};
