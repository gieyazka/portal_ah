import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import axios from 'axios';
import { signInStrapi } from '@/utis/apiFn';

export const authOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: "Username",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // console.log(credentials);
                if (credentials == null) return null;
                const res = await signInStrapi(credentials.username, credentials.password)
                // Add logic here to look up the user from the credentials supplied
                if (res.data.user) {
                    const user = { id: res.data.user.id, name: res.data.user.username, email: res.data.user.email, jwt: res.data.jwt, rule: 'testRule' }
                    return user

                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        })
    ], jwt: {
        encryption: true,
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    }, pages: {
        signIn: '/login',
        error: '/error'

    },
    callbacks: {
        // async signIn(user) {
        //     console.log('user: ' + JSON.stringify(user));

        //     // if (!user) return '/login';

        //     return '/layout'
        // },
        async redirect({ url, baseUrl }) {
            // console.log('callback', url, baseUrl);
          
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return url
        },
        jwt: async ({ token, user, profile }) => {

            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.id = user.id;
                token.jwt = user.jwt;
                token.rule = user.rule
                //custom agr add here then ass in session
            }
            return Promise.resolve(token);
        },
        session: async ({ session, token }) => {
            //add custom agr here
            session.user.id = token.id;
            session.user.jwt = token.jwt;
            session.user.rule = token.rule
            return Promise.resolve(session);
        },
    }, secret: process.env.NEXTAUTH_SECRET,

}
export default NextAuth(authOptions);