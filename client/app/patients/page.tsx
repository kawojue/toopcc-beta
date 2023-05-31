/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import type { Metadata } from 'next'
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'
import Patients from '@/components/Patients'
import { SpinnerTwo } from "@/components/Spinner"
import throwError from '@/utilities/throwError'
import { useEffect, useState, Suspense } from 'react'

export const metadata: Metadata = {
    title: "Patients",
    description: "All Patients Data."
}

const page = async () => {
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
        (async () => await getAllPatients(token))()
    }, [token])

    if (loading) return <SpinnerTwo />

    return (
        <>
            <Suspense fallback={<SpinnerTwo />}>
                <Patients patients={patients}/>
            </Suspense>
        </>
    )
}

export default page