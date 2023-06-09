/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { SpinnerTwo } from '@/components/Spinner'
import Profile from '@/components/Profile'

const page = () => {
    const router = useRouter()
    const { profile, loadingProfile, auth}: any = useAuth()

    useEffect(() => {
        if (!auth) router.push('/staff/login')
    }, [auth, router])
    
    if (loadingProfile) return <SpinnerTwo />

    return <Profile profile={profile} />
}

export default page