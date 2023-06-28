/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import useToken from '@/hooks/useToken'
import Patient from '@/components/Patient'
import usePatient from '@/hooks/usePatient'
import { SpinnerTwo } from '@/components/Spinner'

const page = ({ params: { patientId } }: IPt) => {
    const token: string = useToken()
    const { handlePatient, patient, profLoad }: any = usePatient()

    useEffect(() => {
        if (token) (async () => await handlePatient(patientId))()
    }, [token])

    if (profLoad) return <SpinnerTwo />

    return <Patient patient={patient}/>
}

export default page