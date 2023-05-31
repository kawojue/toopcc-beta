"use client"
import axios from "@/app/api/instance"
import notify from "@/utilities/notify"
import { useRouter } from "next/navigation"
import throwError from "@/utilities/throwError"
import { createContext, useState, useEffect, useContext } from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

const Auth: any = createContext({})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router: AppRouterInstance = useRouter()
    const [token, setToken] = useState<string>("")
    const [auth, setAuth] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [pswd, setPswd] = useState<string>("")
    const [pswd2, setPswd2] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [userId, setUserId] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")
    const [fullname, setFullname] = useState<string>("")
    const [verified, setVerified] = useState<boolean>(false)

    const setStatesToDefault = (): void => {
        setPswd("")
        setPswd2("")
        setEmail("")
        setAvatar("")
        setUserId("")
        setFullname("")
        setVerified(false)
    }

    useEffect(() => {
        const storedToken: string = JSON.parse(localStorage.getItem('token') as string)
        if (storedToken) {
            setAuth(true)
            setToken(storedToken)
        }
    }, [])

    const handleSignup = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/signup', JSON.stringify({
            fullname, avatar, email, pswd, pswd2
        })).then((res: any) => {
            const msg: string = res.data.msg
            const action: string = res.data.action
            notify(action, msg)
            setStatesToDefault()
            setTimeout(() => {
                router.push('/staff/login')
            }, 2000)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handleLogin = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/login', JSON.stringify({
            userId, pswd
        })).then((res: any) => {
            const msg: string = res.data.msg
            const token: string = res.data.token
            const action: string = res.data.action
            localStorage.setItem('token', JSON.stringify(token))
            notify(action, msg)
            setStatesToDefault()
            setTimeout(() => {
                router.push('/staff/profile')
            }, 2000);
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handleLogout = async (): Promise<void> => {
        await axios.get('/auth/logout')
        .then((res: any) => {
            setAuth(false)
            setStatesToDefault()
            localStorage.clear()
        }).catch((err) => throwError(err))
    }

    return (
        <Auth.Provider value={{
            auth, handleSignup, pswd, pswd2, loading, setLoading,
            handleLogin, userId, setUserId, token, handleLogout,
            setPswd, setPswd2, setEmail, email, fullname, setFullname,
            avatar, setAvatar,
        }}>
            {children}
        </Auth.Provider>
    )
}

const useAuth = (): any => {
    const context: any = useContext(Auth)
    return context
}

export default useAuth