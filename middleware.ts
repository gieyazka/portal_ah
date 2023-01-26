import { withAuth } from "next-auth/middleware"

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        console.log('6', req.nextauth.token)
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                
                console.log('token',token);

                return token ? true : false
            },
        },
        pages: {
            signIn: '/login',
            error: '/login',
        }
    }
)

export const config = { matcher: ["/:path*"] }