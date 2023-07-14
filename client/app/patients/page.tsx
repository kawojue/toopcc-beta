/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import useToken from '@/hooks/useToken'
import usePatient from '@/hooks/usePatient'
import Patients from '@/components/Patients'
import { usePatientStore } from '@/utils/store'
import { SpinnerTwo } from '@/components/Spinner'

const page = () => {
    const token: string = useToken()
    const { getAllPatients }: any = usePatient()
    const { loading, patients } = usePatientStore()

    useEffect(() => {
        if (token) (async () => await getAllPatients(token))()
    }, [token])

    if (loading) return <SpinnerTwo />

    return <Patients patients={patients} />
}

export default page