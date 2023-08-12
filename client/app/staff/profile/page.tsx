/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import Profile from '@/components/Profile'
import throwError from '@/utils/throwError'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/utils/store'
import { useQuery } from '@tanstack/react-query'
import { SpinnerTwo } from '@/components/Spinner'
import { AxiosError, AxiosResponse } from 'axios'

const page = () => {
    const router = useRouter()
    const token: string = useToken()
    const { auth, setAuth } = useAuthStore()
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            return await axios.get('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res: AxiosResponse) => {
                setAuth(true)
                return res.data
            }).catch((err: AxiosError) => {
                const statusCode: unknown = err.response?.status
                if (statusCode === 401 || statusCode === 403) {
                    setAuth(false)
                } else {
                    setAuth(true)
                }
                throwError(err)
            })
        },
        enabled: false
    })

    useEffect(() => {
        if (token) refetch()

        if (!auth) router.push('/staff/login')
    }, [token, router, auth])

    if (isLoading) return <SpinnerTwo />

    return <Profile profile={data?.profile || {}} />
}

export default page