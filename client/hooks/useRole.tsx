"use client"
import useJWT from "./useJWT"
import { useState, useEffect } from "react"

const useRole = (...roles: string[]): unknown => {
    const { roles: authRoles }: JWT = useJWT()
    const [res, setRes] = useState<unknown>(null)

    useEffect(() => {
        const allowedRoles: string[] = [...roles]
        const result: any = allowedRoles.map((role: string) => authRoles?.includes(role))
        .find((value: boolean) => value === true)

        if (!result) {
            setRes(false)
        } else {
            setRes(true)
        }
    }, [authRoles, roles])

    return res
}

export default useRole