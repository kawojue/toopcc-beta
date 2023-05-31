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

// export const generateMetadata = async (): Promise<Metadata> => {
//     const { token }: any = useAuth()
//     const searchParams = usePathname()
//     const patientId = searchParams.match('/:patientId')
//     const patient = await getPatient(patientId, token)

//     if (!patient) {
//         return {
//             title: 'Patient not found.'
//         }
//     }

//     return {
//         title: patient.fullname
//     }
// }

const page = ({ params: { patientId } }: { params: { patientId: string } }) => {
    const { token }: any = useAuth()
    const [patient, setPatient] = useState<any>({})

    const getPatient = async (card_no: string, token: string) => {
        await axios.get(`/api/patients/${card_no}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
            (res: any) => setPatient(res.data?.patient)
        ).catch(
            (err: any) => throwError(err)
        )
    }
    
    useEffect(() => {
        if (token) {
            (async () => await getPatient(patientId, token))()
        }
    }, [token, patientId])

    return (
        <Suspense fallback={<SpinnerTwo />}>
            <Patient patient={patient} />
        </Suspense>
    )
}

export default page