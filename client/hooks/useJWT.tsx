"use client"
import useAuth from "./useAuth"
import jwtDecode from "jwt-decode"

const useJWT = (): JWT => {
    const { token }: any = useAuth()
    let decodedToken: JWT = { roles: [], user: "" };

    try {
        decodedToken = jwtDecode(token as string)
    } catch {
        console.log("Invalid Token!")
    }

    return decodedToken
}

export default useJWT