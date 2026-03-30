import { ROUTES } from "@/lib/constants"
import { NextResponse } from "next/server"

 
export function middleware(request) {
  const token = request.cookies.get("access_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "")

  const pathname = request.nextUrl.pathname

  // Handle home route redirect
  if (pathname === "/") {
    if (token) {
      console.log(request.url)
      return NextResponse.redirect(new URL(ROUTES.CHAT, request.url))
    } else {
      console.log(request.url)
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
    }
  }

  // Allow public routes
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"]
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protect private routes
  if (pathname.startsWith(ROUTES.CHAT)) {
    if (!token) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
