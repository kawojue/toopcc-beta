/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import {
    createContext, Context,
    useEffect, useContext, useReducer
} from "react"
import useToken from "./useToken"
import notify from "@/utils/notify"
import axios from "@/app/api/instance"
import throwError from "@/utils/throwError"
import { useAuthStore } from "@/utils/store"
import modalReducer from "@/utils/modalReducers"
import { AxiosError, AxiosResponse } from "axios"
import { useRouter, usePathname } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

const Auth: Context<{}> = createContext({})

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

    const {
        resetStates, token, setToken, setLoading,
        setAuth, setLoadProf, fullname, avatar, email,
        pswd, pswd2, otp, userId, verified, currentPswd,
        user, setOTP, setVerified, setProfile,
    } = useAuthStore()

    const [state, dispatch] = useReducer(modalReducer, initialStates)

    useEffect(() => {
        setToken(getToken)
    }, [getToken])

    useEffect(() => {
        if (pathName === '/staff/profile' && token) {
            (async () => await handleProfile(token))()
        }
    }, [token, pathName, router])

    const handleProfile = async (token: string): Promise<void> => {
        setLoadProf(true)
        await axios.get('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: AxiosResponse) => {
            setAuth(true)
            setProfile(res.data?.profile)
        }).catch((err: AxiosError) => {
            const statusCode: unknown = err.response?.status
            if (statusCode === 401 || statusCode === 403) {
                setAuth(false)
            } else {
                setAuth(true)
                throwError(err)
            }
        }).finally(() => setLoadProf(false))
    }

    const handleOTPRequest = async (): Promise<void> => {
        await axios.post('/auth/otp/request', JSON.stringify({ email }))
            .then((res: any) => notify(res.data?.action, res.data?.msg))
            .catch((err: any) => throwError(err))
    }

    const handleIdVerification = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/otp/verify', JSON.stringify({ otp, email }))
            .then((res: AxiosResponse) => {
                setOTP("")
                setVerified(res.data?.verified)
                notify(res.data?.action, "Verification successful")
                setTimeout(() => {
                    router.push('/staff/password/reset')
                }, 500)
            }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

    const handlePswdReset = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/password/reset', JSON.stringify({
            email, newPswd2: pswd2,
            verified, newPswd: pswd
        })).then(async (res: AxiosResponse) => {
            resetStates()
            notify(res.data?.action, res.data?.msg)
            setTimeout(async () => {
                await handleLogout()
                router.push('/staff/login')
            }, 500)
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

    const handleLogout = async (): Promise<void> => {
        await axios.get(
            '/auth/logout',
            { headers: { 'Authorization': `Bearer ${token}` } }
        ).then((res: AxiosResponse) => {
            setAuth(false)
            resetStates()
            localStorage.clear()
            router.push('/staff/login')
        }).catch((err: AxiosError) => throwError(err))
    }

    const handleFullname = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/edit/fullname', JSON.stringify({ fullname }), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: AxiosResponse) => {
            resetStates()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "FULLNAME" })
            document.location.reload()
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
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
        ).then((res: AxiosResponse) => {
            resetStates()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "USERNAME" })
            setTimeout(() => {
                (async () => await handleLogout())()
            }, 500)
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
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
        ).then((res: AxiosResponse) => {
            resetStates()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "PSWD" })
            setTimeout(() => {
                (async () => await handleLogout())()
            }, 500)
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

    const delAvatar = async (): Promise<void> => {
        await axios.delete('/auth/avatar', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: AxiosResponse) => {
            resetStates()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "AVATAR" })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: AxiosError) => throwError(err))
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
        ).then((res: AxiosResponse) => {
            resetStates()
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "AVATAR" })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

    return (
        <Auth.Provider value={{
            state, dispatch, handleLogout, handleOTPRequest,
            handlePswdReset, handleIdVerification, handleUsername,
            handleFullname, handleEditPswd, resetStates, delAvatar, changeAvatar
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