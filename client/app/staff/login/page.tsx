/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import Link from "next/link"
import useAuth from "@/hooks/useAuth"
import { inter } from "@/public/font/font"
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import PswdButton from "@/components/PswdBtn"
import SubmitBtn from "@/components/SubmitBtn"

const page = () => {
    const router = useRouter()
    const {
        pswd, handleLogin, auth,
        userId, setUserId, setPswd,
    }: any = useAuth()

    const [pswdBtn, setPswdBtn] = useState<boolean>(false)

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
                    value={userId} onChange={(e) => setUserId(e.target.value)}/>
                </article>
                <article className="form-group">
                    <label htmlFor="pswd">Password</label>
                    <div className="pswd-container">
                        <input type={`${pswdBtn ? 'text': 'password'}`} id="pswd" placeholder="password"
                        value={pswd} onChange={(e) => setPswd(e.target.value)}
                        className={inter.className}/>
                        <PswdButton get={pswdBtn} set={setPswdBtn} />
                    </div>
                    <Link href="/staff/password/verify" className="fgt-pswd">
                        Forgot Password?
                    </Link>
                </article>
                <SubmitBtn texts="Log In" handler={handleLogin} />
            </form>
        </section>
    )
}

export default page