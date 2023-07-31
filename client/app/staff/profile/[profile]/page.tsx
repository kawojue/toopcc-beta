/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from "react"
import axios from "@/app/api/instance"
import useToken from "@/hooks/useToken"
import Profile from "@/components/Profile"
import { useRouter } from "next/navigation"
import throwError from "@/utils/throwError"
import { useQuery } from "@tanstack/react-query"
import { SpinnerTwo } from "@/components/Spinner"
import { AxiosError, AxiosResponse } from "axios"

const page = ({ params: { profile } }: IProfile) => {
    const router = useRouter()
    const token: string = useToken()
    const { isLoading, refetch, data } = useQuery({
        queryKey: ['staff_profile'],
        queryFn: async () => {
            return await axios.get(`/api/users/profile/${profile}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res: AxiosResponse) => {
                return res.data?.user
            }).catch((err: AxiosError) => {
                if (err.response?.status === 401) {
                    router.push('/staff/profile')
                } else {
                    throwError(err)
                }
            })
        },
        enabled: false
    })

    useEffect(() => {
        if (token) refetch()
    }, [token])

    if (isLoading) return <SpinnerTwo />

    return <Profile profile={data || {}} />
}

export default page