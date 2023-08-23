import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import _fnApi from '@/utils/apiFn';
import axios from 'axios';

export const authOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,

        }),
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
                const res = await _fnApi.signOrgChart(credentials.username, credentials.password)
                // const res = await _fnApi.signInStrapi(credentials.username, credentials.password)
                // const myLevel = await _fnApi.getMyLevels(res.data.user.username)
                console.log('', res.data, res.status)
                if (res.status === 200) {
                    const user = {
                        id: res.data.ess.id,
                        name: res.data.ess.username,
                        email: res.data.email,
                        rule: 'testRule',
                        level: res.data.hierachy?.level?.level,
                        priority: res.data.hierachy?.level?.priority,
                        position: res.data.hierachy?.level?.position,
                        section: res.data.hierachy?.section?.name,
                        department: res.data.department,
                        company: res.data.company,
                        empid: res.data.empid,
                        username: res.data.ess.username,
                        usernameLdap: res.data.username,
                        // firstName: res.data.hierachy.employee.firstName,
                        // lastName: res.data.hierachy.employee.lastName
                        // , prefix: res.data.hierachy.employee.prefix,
                        fullName: res.data.name
                    }
                    // console.log('user',user)
                    // return null
                    return user
                }
                throw new Error(JSON.stringify({ errors: res.data, status: false }))
                return null
                // console.log(20, myLevel.data);
                // Add logic here to look up the user from the credentials supplied
                if (res.data.user && myLevel.data.status !== false) {
                    const user = {
                        id: res.data.user.id,
                        name: res.data.user.username,
                        email: myLevel.data.employee.email,
                        jwt: res.data.jwt,
                        rule: 'testRule',
                        level: myLevel.data.level.level,
                        priority: myLevel.data.level.priority,
                        position: myLevel.data.level.position,
                        section: myLevel.data.section.name,
                        department: myLevel.data.section.department.abbreviation,
                        company: myLevel.data.section.department.company.abbreviation,
                        empid: res.data.user.empID,
                        username: res.data.user.username,
                        firstName: myLevel.data.employee.firstName,
                        lastName: myLevel.data.employee.lastName
                        , prefix: myLevel.data.employee.prefix,
                        fullName: `${myLevel.data.employee.prefix}.${myLevel.data.employee.firstName} ${myLevel.data.employee.lastName}`
                    }
                    // return null
                    return user

                } else {
                    return null

                }
            },
        })
    ], jwt: {
        encryption: true,
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    //  pages: {
    //     signIn: '/login',
    //     error: '/error'

    // },
    callbacks: {
        // async signIn(user) {
        //     console.log('user',user.user.email)
        //     console.log('user 100: ' + JSON.stringify(user));
        //     // if (!user) return '/login';

        //     return '/layout'
        // },
        async redirect({ url, baseUrl }) {
            // console.log('callback', url, baseUrl);
            // console.log('baseUrl', baseUrl)
            // console.log('url', url)
            // Allows relative callback console.log('URL',URL)s
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // // Allows callback URLs on the same origin
            else if (new URL(url).ori4gin === baseUrl) return url
            return url
        },
        jwt: async ({ token, user, profile }) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                const res = await _fnApi.getUserData(token.email)
                const data = res.data
                console.log('data', data)
                token.rule = data.rule ?? null
                token.level = data.hierachy?.level?.level ?? null
                token.priority = data.hierachy?.level?.priority ?? null
                token.section = data.hierachy?.section?.name ?? null
                token.department = data.hierachy?.section?.department?.abbreviation ?? null
                token.company = data.hierachy?.section?.department?.company?.abbreviation ?? null
                token.empid = data.employee?.isHasESS ? data.employee.empid : data.employee.ou + data.employee.empidWithoutCompany
                token.username = data.employee.empid
                token.fullName = `${data.employee.prefix ? data.employee.prefix + "." : ""}${data.employee.firstName} ${data.employee.lastName}`
                token.firstName = data.employee.firstName
                token.lastName = data.employee.lastName
                token.prefix = data.employee.prefix
                token.position = data.employee.position ?? null
                //custom agr add here then ass in session
                if (data.hierachy === null) {
                    const resLdap = await _fnApi.getLDAPData(data.employee.email.split("@"))
                    console.log('resLdap',resLdap.data)
                    token.department = resLdap.data?.employee?.department ?? null
                    token.company = resLdap.data.employee?.company ?? null
                }
            }
            return Promise.resolve(token);
        },
        session: async ({ session, token }) => {
            //add custom agr here
            session.user.id = token.id;
            session.user.jwt = token.jwt;
            session.user.rule = token.rule
            session.user.level = token.level
            session.user.section = token.section
            session.user.department = token.department
            session.user.empid = token.empid
            session.user.company = token.company
            session.user.priority = token.priority
            session.user.username = token.username
            session.user.firstName = token.firstName
            session.user.lastName = token.lastName
            session.user.fullName = token.fullName
            session.user.prefix = token.prefix
            session.user.position = token.position
            return Promise.resolve(session);
        },
    },

    secret: process.env.NEXTAUTH_SECRET,

}
export default NextAuth(authOptions);