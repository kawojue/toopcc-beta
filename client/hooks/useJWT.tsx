"use client"
import useAuth from "./useAuth"
import jwtDecode from "jwt-decode"

const useJWT = () => {
    const { token }: any = useAuth()
    return jwtDecode(token)
}

export default useJWT