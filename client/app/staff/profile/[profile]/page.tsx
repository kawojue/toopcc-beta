/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useJWT from "@/hooks/useJWT"
import useAuth from "@/hooks/useAuth"
import axios from "@/app/api/instance"
import Profile from "@/components/Profile"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import throwError from "@/utils/throwError"
import { SpinnerTwo } from "@/components/Spinner"

const page = ({ params: { profile } } : IProfile) => {
    const router = useRouter()

    const { token }: any = useAuth()
    const { roles } : JWT = useJWT() || { roles: [] }

    const [staff, setStaff] = useState<any>({})
    const [loadingProfile, setLoadingProfile] = useState<boolean>(false)

    const handleStaff = async (token: string): Promise<void> => {
        setLoadingProfile(true)
        await axios.get(`/api/user/profile/${profile}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => setStaff(res.data?.user))
        .catch((err: any) => throwError(err)).finally(() => setLoadingProfile(false))
    }

    useEffect(() => {
        if (!roles.includes("hr")) router.push('/staff/profile')
    }, [roles, router])

    useEffect(() => {
        (async () => await handleStaff(token))()
    }, [token])

    if (loadingProfile) return <SpinnerTwo />

    return <Profile profile={staff} />
}

export default page