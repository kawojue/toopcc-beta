/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import {
    questrial, inter
} from "@/public/font/font"
import useAuth from "@/hooks/useAuth"
import { SpinnerOne } from "@/components/Spinner"
import Link from "next/link"

const page = () => {
    const { pswd, loading, handleLogin, userId, setUserId, setPswd }: any = useAuth()
    return (
        <section className={`section-form ${questrial.className}`}>
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
                    <input type="text" id="pswd" placeholder="password"
                    value={pswd} onChange={(e) => setPswd(e.target.value)}
                    className={inter.className}/>
                    <Link href="/staff/password/reset"
                    className="fgt-pswd">
                        Forgot Password?
                    </Link>
                </article>
                <button type="submit" onClick={async () => await handleLogin()}
                className="submit-btn hover:bg-clr-6 hover: text-clr-5">
                    {loading ? <SpinnerOne /> : <span>Log In</span>}
                </button>
            </form>
        </section>
    )
}

export default page