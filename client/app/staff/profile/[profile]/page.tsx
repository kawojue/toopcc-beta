/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useEffect } from "react"
import useJWT from "@/hooks/useJWT"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

const page = ({ params: { profile } } : IProfile) => {
    const router = useRouter()
    const { token }: any = useAuth()
    const { roles } : JWT = useJWT() || { roles: [] }

    useEffect(() => {
        if (!roles.includes("hr")) router.push('/staff/profile')
    }, [roles, router])

    return (
        <></>
    )
}

export default page