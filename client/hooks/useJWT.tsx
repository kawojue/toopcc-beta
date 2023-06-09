"use client"
import useAuth from "./useAuth"
import jwtDecode from "jwt-decode"

const useJWT = (): JWT => {
    const { token }: any = useAuth()
    return jwtDecode(token as string)
}

export default useJWT