/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import throwError from '@/utils/throwError'
import Patients from '@/components/Patients'
import { SpinnerTwo } from '@/components/Spinner'

const page = () => {
    const router = useRouter()
    const { token, auth }: any = useAuth()
    const [patients, setPatients] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getAllPatients = async (token: string) => {
        await axios.get(`/api/patients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => setPatients(res.data?.patients))
        .catch((err: any) => {
            throwError(err)
            setTimeout(() => {
                router.push('/staff/login')
            }, 1500)
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (auth) (async () => await getAllPatients(token))()
    }, [token, auth])

    if (loading) return <SpinnerTwo />

    return <Patients patients={patients} />
}

export default page