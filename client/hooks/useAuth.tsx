"use client"
import notify from "@/utils/notify"
import axios from "@/app/api/instance"
import { useRouter } from "next/navigation"
import throwError from "@/utils/throwError"
import { createContext, useState, useEffect, useContext } from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

const Auth: any = createContext({})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router: AppRouterInstance = useRouter()
    const [token, setToken] = useState<string>("")
    const [auth, setAuth] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [otp, setOTP] = useState<string>("")
    const [pswd, setPswd] = useState<string>("")
    const [pswd2, setPswd2] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [userId, setUserId] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")
    const [fullname, setFullname] = useState<string>("")
    const [verified, setVerified] = useState<boolean>(false)

    const setStatesToDefault = (): void => {
        setOTP("")
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

    const handleOTPRequest = async (): Promise<void> => {
        await axios.post('/auth/otp/request', JSON.stringify({ email }))
        .then((res: any) => notify(res.data?.action, res.data?.msg))
        .catch((err: any) => throwError(err))
    }

    const handleIdVerification = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/otp/verify', JSON.stringify({ otp, email }))
        .then((res: any) => {
            setOTP("")
            setVerified(res.data?.verified)
            notify(res.data?.action, res.data?.msg)
            setTimeout(() => {
                router.push('/staff/password/reset')
            }, 2000)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handlePswdReset = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/password/reset', JSON.stringify({
            email, newPswd2: pswd2,
            verified, newPswd: pswd
        })).then((res: any) => {
            setStatesToDefault()
            notify(res.data?.action, res.data?.msg)
            setTimeout(() => {
                router.push('/staff/login')
            }, 2000)
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
            avatar, setAvatar, otp, setOTP, handleOTPRequest,
            handlePswdReset, handleIdVerification
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