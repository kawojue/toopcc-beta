/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useAuth from '@/hooks/useAuth'
import { SpinnerTwo } from '@/components/Spinner'
import UserProfile from '@/components/UserProfile'

const page = () => {
    const { profile, loadingProfile }: any = useAuth()
    
    if (loadingProfile) return <SpinnerTwo />

    return <UserProfile profile={profile} />
}

export default page