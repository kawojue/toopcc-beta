/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import useToken from '@/hooks/useToken'
import usePatient from '@/hooks/usePatient'
import Patients from '@/components/Patients'
import { SpinnerTwo } from '@/components/Spinner'

const page = () => {
    const token: string = useToken()
    const {
        loading, getAllPatients, patients
    }: any = usePatient()

    useEffect(() => {
        if (token) (async () => await getAllPatients(token))()
    }, [token])

    if (loading) return <SpinnerTwo />

    return <Patients patients={patients} />
}

export default page