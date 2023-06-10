"use client"
import useJWT from "./useJWT"

const useRole = (...roles: string[]): boolean => {
    const { roles: authRoles }: JWT = useJWT()
    const allowedRoles: string[] = [...roles]

    const result: any = allowedRoles.map((role: string) => authRoles?.includes(role))
    .find((value: boolean) => value === true)
    
    if (!result) {
        return false
    }
    return true
}

export default useRole