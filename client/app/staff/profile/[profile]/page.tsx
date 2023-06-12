/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useRole from "@/hooks/useRole"
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
    const roles: boolean = useRole("hr", "admin")

    const [staff, setStaff] = useState<any>({})
    const [loadingProfile, setLoadingProfile] = useState<boolean>(false)

    const handleStaff = async (): Promise<void> => {
        setLoadingProfile(true)
        await axios.get(`/api/user/profile/${profile}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => setStaff(res.data?.user))
        .catch((err: any) => throwError(err)).finally(() => setLoadingProfile(false))
    }

    useEffect(() => {
        if (token) {
            if (!roles) {
                router.push('/staff/profile')
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