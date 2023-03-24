import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { withAuth } from "next-auth/middleware"

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        // console.log('6', req.nextUrl.pathname)
        if (req.nextUrl.pathname === "/") {

            return NextResponse.redirect(new URL('/menu/my_task?current=in_process', req.url))
        }
        if (req.nextUrl.pathname === "/menu") {

            return NextResponse.redirect(new URL('/menu/my_task?current=in_process', req.url))
        }
    },
    {
        callbacks: {
            authorized: (req) => {
                const { token } = req
                const pathName = req.req.nextUrl.pathname
                const checkPathname = pathName.startsWith('/menu')
                if (!token && checkPathname) {
                    return false
                }
                return true
            },
        },
        pages: {
            signIn: '/login',
            error: '/login',
        }
    }
)

export const config = { matcher: ["/:path*"] }