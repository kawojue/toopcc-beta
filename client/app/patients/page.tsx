/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import throwError from '@/utils/throwError'
import { useRouter } from 'next/navigation'
import Patients from '@/components/Patients'
import formatCardNo from '@/utils/formatCardNo'
import { useQuery } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { SpinnerTwo } from '@/components/Spinner'

const page = () => {
    const router = useRouter()
    const token: string = useToken()
    const { isLoading, data, refetch } = useQuery({
        queryKey: ['patients'],
        queryFn: async () => {
            return await axios.get(`/api/patients`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res: AxiosResponse) => {
                const pts: any[] = res.data?.patients || []
                const formattedPatients = pts.map((pt: any) => {
                    return formatCardNo(pt)
                })
                return formattedPatients
            }).catch((err: AxiosError) => {
                throwError(err)
                setTimeout(() => {
                    router.push('/staff/profile')
                }, 500)
            })
        },
        enabled: false
    })

    useEffect(() => {
        if (token) refetch()
    }, [token])

    if (isLoading) return <SpinnerTwo />

    return <Patients patients={data || []} />
}

export default page