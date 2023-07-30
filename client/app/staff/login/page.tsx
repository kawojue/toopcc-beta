/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import Link from "next/link"
import notify from "@/utils/notify"
import axios from "@/app/api/instance"
import { inter } from "@/public/font/font"
import { useEffect, useState } from "react"
import throwError from "@/utils/throwError"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/utils/store"
import PswdButton from "@/components/PswdBtn"
import SubmitBtn from "@/components/SubmitBtn"
import { AxiosResponse, AxiosError } from "axios"

const page = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const {
        pswd, auth, userId, setPswd,
        setUserId, pswdBtn, setPswdBtn,
        resetStates, setAuth, setToken
    } = useAuthStore()

    const handleLogin = async (): Promise<void> => {
        setLoading(true)
        await axios.post('/auth/login', JSON.stringify({
            userId, pswd
        })).then((res: AxiosResponse) => {
            const token: string = res.data.token
            setAuth(true)
            setToken(token)
            localStorage.setItem('token', JSON.stringify(token))
            notify("success", res.data.msg)
            resetStates()
            setTimeout(() => {
                router.push('/staff/profile')
            }, 500)
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (auth) router.push('/staff/profile')
    }, [auth, router])

    return (
        <section className="section-form">
            <h2 className="form-header">Login</h2>
            <form onSubmit={e => e.preventDefault()}
                className="form">
                <article className="form-group">
                    <label htmlFor="userId">Email or Username</label>
                    <input type="text" id="userId" className={inter.className}
                        value={userId} onChange={(e) => setUserId(e.target.value)} />
                </article>
                <article className="form-group">
                    <label htmlFor="pswd">Password</label>
                    <div className="pswd-container">
                        <input type={`${pswdBtn ? 'text' : 'password'}`} id="pswd"
                            value={pswd} onChange={(e) => setPswd(e.target.value)}
                            className={inter.className} placeholder="password" />
                        <PswdButton get={pswdBtn} set={setPswdBtn} />
                    </div>
                    <Link href="/staff/password/verify" className="fgt-pswd">
                        Forgot Password?
                    </Link>
                </article>
                <SubmitBtn texts="Log In" handler={handleLogin} loading={loading} />
            </form>
        </section>
    )
}

export default page