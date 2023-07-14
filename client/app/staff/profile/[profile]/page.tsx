/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from "react"
import axios from "@/app/api/instance"
import useToken from "@/hooks/useToken"
import Profile from "@/components/Profile"
import { useRouter } from "next/navigation"
import throwError from "@/utils/throwError"
import { useAuthStore } from "@/utils/store"
import { SpinnerTwo } from "@/components/Spinner"
import { AxiosError, AxiosResponse } from "axios"

const page = ({ params: { profile } }: IProfile) => {
    const router = useRouter()
    const token: string = useToken()
    const {
        staff, setStaff,
        loadProf, setLoadProf
    } = useAuthStore()

    const handleStaff = async (): Promise<void> => {
        setLoadProf(true)
        await axios.get(`/api/users/profile/${profile}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: AxiosResponse) => setStaff(res.data?.user))
            .catch((err: AxiosError) => {
                if (err.response?.status === 401) {
                    router.push('/staff/profile')
                } else {
                    throwError(err)
                }
            }).finally(() => setLoadProf(false))
    }

    useEffect(() => {
        if (token) (async () => await handleStaff())()
    }, [token])

    if (loadProf) return <SpinnerTwo />

    return <Profile profile={staff} />
}

export default page