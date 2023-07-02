"use client"
import useToken from "./useToken"
import notify from "@/utils/notify"
import axios from "@/app/api/instance"
import throwError from "@/utils/throwError"
import modalReducer from "@/utils/modalReducers"
import { useRouter, usePathname } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import { createContext, useState, useEffect, useContext, useReducer } from "react"

const Auth: any = createContext({})
const initialStates: ModalStates = {
    roles: false,
    avatar: false,
    username: false,
    fullname: false,
    password: false,
    resignation: false,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const getToken: string = useToken()
    const pathName: string = usePathname()
    const router: AppRouterInstance = useRouter()
    const [token, setToken] = useState<string>("")
    const [profile, setProfile] = useState<any>({})
    const [auth, setAuth] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true)
    
    const [otp, setOTP] = useState<string>("")
    const [user, setUser] = useState<string>("")
    const [pswd, setPswd] = useState<string>("")
    const [pswd2, setPswd2] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [userId, setUserId] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")
    const [fullname, setFullname] = useState<string>("")
    const [verified, setVerified] = useState<boolean>(false)
    const [currentPswd, setCurrentPswd] = useState<string>("")

    const [state, dispatch] = useReducer(modalReducer, initialStates)

    const setStatesToDefault = (): void => {
        setOTP("")
        setUser("")
        setPswd("")
        setPswd2("")
        setEmail("")
        setAvatar("")
        setUserId("")
        setFullname("")
        setCurrentPswd("")
        setVerified(false)
    }

    useEffect(() => {
        setToken(getToken)
    }, [getToken])

    useEffect(() => {
        if (pathName === '/staff/profile' && token) {
            (async () => await handleProfile(token))()
        }
    }, [token, pathName, router])

    const handleProfile = async (token: string): Promise<void> => {
        await axios.get('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => {
            setAuth(true)
            setProfile(res.data?.profile)
        }).catch((err: any) => throwError(err)).finally(() => setLoadingProfile(false))
    }

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
            }, 500)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handleLogin = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/login', JSON.stringify({
            userId, pswd
        })).then((res: any) => {
            const token: string = res.data.token
            setAuth(true)
            setToken(token)
            localStorage.setItem('token', JSON.stringify(token))
            notify(res.data.action, res.data.msg)
            setStatesToDefault()
            setTimeout(() => {
                router.push('/staff/profile')
            }, 500)
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
            notify(res.data?.action, "Verification successful")
            setTimeout(() => {
                router.push('/staff/password/reset')
            }, 500)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handlePswdReset = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/password/reset', JSON.stringify({
            email, newPswd2: pswd2,
            verified, newPswd: pswd
        })).then(async (res: any) => {
            setStatesToDefault()
            notify(res.data?.action, res.data?.msg)
            setTimeout(async () => {
                await handleLogout()
                router.push('/staff/login')
            }, 500)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handleLogout = async (): Promise<void> => {
        await axios.get(
            '/auth/logout',
            { headers: { 'Authorization': `Bearer ${token}` } }
        ).then((res: any) => {
            setAuth(false)
            setStatesToDefault()
            localStorage.clear()
            router.push('/staff/login')
        }).catch((err) => throwError(err))
    }

    const handleFullname = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/edit/fullname', JSON.stringify({ fullname }), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => {
            setStatesToDefault()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "FULLNAME" })
            document.location.reload()
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handleUsername = async (): Promise<void> => {
        setLoading(true)
        await axios.post(
            '/auth/edit/username',
            JSON.stringify({ newUser: user }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => {
            setStatesToDefault()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "USERNAME" })
            setTimeout(() => {
                (async () => await handleLogout())()
            }, 500)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const handleEditPswd = async (): Promise<void> => {
        setLoading(true)
        await axios.post(
            '/auth/edit/password',
            JSON.stringify({ currentPswd, pswd, pswd2 }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => {
            setStatesToDefault()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "PSWD" })
            setTimeout(() => {
                (async () => await handleLogout())()
            }, 500)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const delAvatar = async (): Promise<void> => {
        await axios.delete('/auth/avatar', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => {
            setStatesToDefault()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "AVATAR" })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: any) => throwError(err))
    }

    const changeAvatar = async (): Promise<void> => {
        setLoading(true)
        await axios.post(
            '/auth/avatar',
            JSON.stringify({ avatar }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => {
            setStatesToDefault()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "AVATAR" })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    return (
        <Auth.Provider value={{
            auth, handleSignup, pswd, pswd2, loading, setLoading,
            handleLogin, userId, setUserId, handleLogout, setPswd,
            setPswd2, setEmail, email, fullname, setFullname, avatar,
            setAvatar, otp, setOTP, handleOTPRequest, profile, state,
            handlePswdReset, handleIdVerification, loadingProfile, user,
            dispatch, setUser, handleUsername, handleFullname, currentPswd,
            setCurrentPswd, handleEditPswd, setStatesToDefault, delAvatar,
            changeAvatar
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