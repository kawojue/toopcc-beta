/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import type { Metadata } from "next"
import useAuth from "@/hooks/useAuth"
import axios from '@/app/api/instance'
import { notFound } from 'next/navigation'
import Patient from '@/components/Patient'
import throwError from '@/utilities/throwError'
import { SpinnerTwo } from "@/components/Spinner"
import { useState, useEffect, Suspense } from 'react'

interface Patient {
    params: {
        patientId: string
    }
}

export const generateMetadata = async ({ params: { patientId } }: { params: { patientId: string } }): Promise<Metadata> => {
    const { token }: any = useAuth()
    let patient: any = {}

    await axios.get(`/api/patients/${patientId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(
        (res: any) => patient = res.data?.patient
    ).catch(
        (err: any) => console.error(err)
    )

    console.log(patient)

    if (!patient?.fullname) {
        return {
            title: 'Patient not found.'
        }
    }

    return {
        title: patient.fullname
    }
}

const page = ({ params: { patientId } }: Patient) => {
    const { token }: any = useAuth()
    const [patient, setPatient] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)

    const getPatient = async (card_no: string, token: string) => {
        setLoading(true)
        await axios.get(`/api/patients/${card_no}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
            (res: any) => setPatient(res.data?.patient)
        ).catch(
            (err: any) => throwError(err)
        ).finally(() => setLoading(false))
    }
    
    useEffect(() => {
        if (token) {
            (async () => await getPatient(patientId, token))()
        }
    }, [token, patientId])

    if (loading) return <SpinnerTwo />

    return (
        <Suspense fallback={<SpinnerTwo />}>
            <Patient patient={patient} />
        </Suspense>
    )
}

export default page