"use client"
import useToken from "./useToken"
import jwtDecode from "jwt-decode"
import { useState, useEffect } from "react"

const useJWT = (): JWT => {
    const token: string = useToken()
    const [decodedToken, setDecodedToken] = useState<{
        roles: string[], user: string
    }>({ roles: [], user: "" })

    useEffect(() => {
        try {
            if (token) setDecodedToken(jwtDecode(token))
        } catch {
            console.log("Invalid Token!")
        }
    }, [token])

    return decodedToken
}

export default useJWT