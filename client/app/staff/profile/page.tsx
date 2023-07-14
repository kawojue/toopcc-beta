/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import Profile from '@/components/Profile'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/utils/store'
import { SpinnerTwo } from '@/components/Spinner'

const page = () => {
    const router = useRouter()
    const { auth, profile, loadProf } = useAuthStore()

    useEffect(() => {
        if (!auth) router.push('/staff/login')
    }, [auth, router])

    if (loadProf) return <SpinnerTwo />

    return <Profile profile={profile} />
}

export default page