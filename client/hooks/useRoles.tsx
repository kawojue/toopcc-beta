"use client"
import useJWT from "./useJWT"

const useRoles = (...roles: string[]): boolean => {
    const { roles: authRoles }: JWT = useJWT()
    const result: any = roles.map((role: string) => authRoles.includes(role)).find((value: boolean) => value === true)
    
    if (!result) {
        return false
    }
    return true
}

export default useRoles