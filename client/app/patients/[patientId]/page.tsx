/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import Patient from '@/components/Patient'
import throwError from '@/utils/throwError'
import formatCardNo from '@/utils/formatCardNo'
import { useQuery } from '@tanstack/react-query'
import { SpinnerTwo } from '@/components/Spinner'
import { AxiosError, AxiosResponse } from 'axios'

const page = ({ params: { patientId } }: IPt) => {
    const token: string = useToken()
    const { data, refetch, isLoading } = useQuery({
        queryKey: ['patient'],
        queryFn: async () => {
            return await axios.get(
                `/api/patients/patient/${patientId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then((res: AxiosResponse) => {
                return formatCardNo(res.data.patient)
            }).catch((err: AxiosError) => throwError(err))
        },
        enabled: false
    })

    useEffect(() => {
        if (token && patientId) refetch()
    }, [token, patientId])

    if (isLoading) return <SpinnerTwo />

    return <Patient patient={data || {}} />
}

export default page