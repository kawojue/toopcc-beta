/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useAuth from "@/hooks/useAuth"
import { inter } from "@/public/font/font"
import { useAuthStore } from "@/utils/store"
import PswdButton from "@/components/PswdBtn"
import SubmitBtn from "@/components/SubmitBtn"

const page = () => {
    const {
        pswd, pswd2, setPswdBtn,
        setPswd2, pswdBtn, setPswd
    } = useAuthStore()
    const { handlePswdReset }: any = useAuth()

    return (
        <section className="section-form">
            <h2 className="form-header">Reset Password</h2>
            <form onSubmit={e => e.preventDefault()}
                className="form">
                <article className="form-group">
                    <label htmlFor="pswd">Password</label>
                    <div className="pswd-container">
                        <input type={`${pswdBtn ? 'text' : 'password'}`} id="pswd"
                            value={pswd} onChange={(e) => setPswd(e.target.value)}
                            className={inter.className} placeholder="password" />
                        <PswdButton get={pswdBtn} set={setPswdBtn} />
                    </div>
                </article>
                <article className="form-group">
                    <label htmlFor="pswd2">Confirm Password</label>
                    <input type="password" id="pswd2" placeholder="confirm password"
                        value={pswd2} onChange={(e) => setPswd2(e.target.value)}
                        className={inter.className} />
                </article>
                <SubmitBtn texts="Reset" handler={handlePswdReset} />
            </form>
        </section>
    )
}

export default page