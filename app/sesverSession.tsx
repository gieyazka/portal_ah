import { authOptions } from "pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from 'next-auth/next'

export default async function SeverSession() {
    //@ts-ignore
    const session = await unstable_getServerSession(authOptions)
    return (
        <div>
            <div>
                This is your session
                {JSON.stringify(session)}
            </div>
        </div>
    )
    
}