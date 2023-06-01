/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import type { Metadata } from 'next'
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'
import throwError from '@/utils/throwError'
import { useEffect, useState } from 'react'
import Patients from '@/components/Patients'
import { SpinnerTwo } from "@/components/Spinner"

export const metadata: Metadata = {
    title: "Patients",
    description: "All Patients Data."
}

const page = () => {
    const { token }: any = useAuth()
    const [patients, setPatients] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getAllPatients = async (token: string) => {
        setLoading(true)
        await axios.get(`/api/patients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res: any) => {
            setPatients(res.data?.patients)
        })
        .catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (token) (async () => await getAllPatients(token))()
    }, [token])

    if (loading) return <SpinnerTwo />

    return <Patients patients={patients}/>
}

export default page