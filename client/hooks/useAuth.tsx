"use client"
import axios from "@/app/api/instance"
import notify from "@/utilities/notify"
import throwError from "@/utilities/throwError"
import { useRouter, NextRouter } from "next/router"
import { convertFile, checkFile } from '@/utilities/file'
import { createContext, useState, useEffect, useContext } from 'react'

const Auth = createContext({})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router: NextRouter = useRouter()
    const [token, setToken] = useState<string>("")
    const [auth, setAuth] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [selected, setSelected] = useState<boolean>(false)

    const [pswd, setPswd] = useState<string>("")
    const [pswd2, setPswd2] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [userId, setUserid] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")
    const [fullname, setFullname] = useState<string>("")

    const setStatesToDefault = (): void => {
        setPswd("")
        setPswd2("")
        setEmail("")
        setAvatar("")
        setUserid("")
        setFullname("")
    }

    useEffect(() => {
        const storedToken: string = JSON.parse(localStorage.getItem('token') as string)
        if (storedToken) {
            setAuth(true)
            setToken(storedToken)
        } else {
            if (router.asPath === "/staff/profile") router.push('/staff/login')
        }
    }, [router])

    const handleAvatar = (e: any): void => {
        const file: any = e.target.files[0]
        if (checkFile(file)) {
            convertFile(file, setAvatar)
            setSelected(true)
        } else {
            notify('error', "File size or format is not allowed.")
        }
    }

    const handleSignup = async (): Promise<void> => {
        setLoading(true)
        await axios.post('', JSON.stringify({
            fullname, avatar, email, pswd, pswd2
        })).then((res: any) => {
            const msg: string = res.data.msg
            const action: string = res.data.action
            notify(action, msg)
            setStatesToDefault()
            setTimeout(() => {
                router.push('/staff/login')
            }, 2000);
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handleLogin = async (): Promise<void> => {
        setLoading(true)
        await axios.post('', JSON.stringify({
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

    return (
        <Auth.Provider value={{
            auth, handleSignup, pswd, pswd2, handleAvatar, loading, setLoading, selected,
            handleLogin, userId, setUserid, token
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