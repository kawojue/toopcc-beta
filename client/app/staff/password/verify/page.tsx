/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useAuth from "@/hooks/useAuth"
import { inter } from "@/public/font/font"
import { useAuthStore } from "@/utils/store"
import SubmitBtn from "@/components/SubmitBtn"

const page = () => {
    const { otp, setOTP, email, setEmail } = useAuthStore()
    const { handleOTPRequest, handleIdVerification }: any = useAuth()

    return (
        <section className="section-form">
            <h2 className="form-header">Verify your Identity!</h2>
            <form onSubmit={e => e.preventDefault()}
                className="form">
                <article className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className={inter.className}
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                </article>
                <article className="form-group">
                    <label htmlFor="otp">OTP</label>
                    <div className="pswd-container">
                        <input type='text' id="otp" placeholder="OTP sent to your email"
                            value={otp} onChange={(e) => setOTP(e.target.value)}
                            className={inter.className} />
                    </div>
                    <button className="fgt-pswd" disabled={!Boolean(email)}
                        onClick={async () => await handleOTPRequest()}>
                        Request OTP
                    </button>
                </article>
                <SubmitBtn texts="Verify" handler={handleIdVerification} />
            </form>
        </section>
    )
}

export default page