/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useRole from "@/hooks/useRole"
import axios from "@/app/api/instance"
import useToken from "@/hooks/useToken"
import Profile from "@/components/Profile"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import throwError from "@/utils/throwError"
import { SpinnerTwo } from "@/components/Spinner"

const page = ({ params: { profile } } : IProfile) => {
    const router = useRouter()
    const token: string = useToken()
    const roles: unknown = useRole("hr", "admin")

    const [staff, setStaff] = useState<any>({})
    const [loadingProfile, setLoadingProfile] = useState<boolean>(false)

    const handleStaff = async (): Promise<void> => {
        setLoadingProfile(true)
        await axios.get(`/api/users/profile/${profile}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => setStaff(res.data?.user))
        .catch((err: any) => throwError(err)).finally(() => setLoadingProfile(false))
    }

    useEffect(() => {
        if (token) {
            if (roles !== null) {
                if (roles === false) {
                    // router.push('/staff/profile')
                }
            }
        }
    }, [router, token, roles])

    useEffect(() => {
        if (token) (async () => await handleStaff())()
    }, [token])

    if (loadingProfile) return <SpinnerTwo />

    return <Profile profile={staff} />
}

export default page