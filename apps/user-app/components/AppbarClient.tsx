"use client"
import { Appbar } from "@repo/ui/Appbar"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const AppbarClient = () => {
    const session = useSession()
    const router = useRouter()
    return (<div>
        <Appbar onSignin={signIn} onSignout={() => {

            signOut();
            router.push('/api/auth/signin')
        }}
            user={session.data?.user}

        />
    </div>)
}

export default AppbarClient
