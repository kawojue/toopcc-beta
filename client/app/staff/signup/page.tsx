/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useAuth from "@/hooks/useAuth"
import { handleFile } from "@/utils/file"
import { inter } from "@/public/font/font"
import { SpinnerOne } from "@/components/Spinner"

const page = () => {
    const {
        loading, email, setEmail, avatar, setAvatar,
        pswd, pswd2, setPswd, setPswd2, handleSignup,
    }: any = useAuth()

    return (
        <section className="section-form">
            <h2 className="form-header">Sign Up</h2>
            <form onSubmit={e => e.preventDefault()}
            className="form">
                <article className="form-group avatar">
                    <img src={`${avatar ? avatar: 'https://res.cloudinary.com/kawojue/image/upload/v1685607626/TOOPCC/Staffs/avatar_ndluis.webp'}`} alt={` `} />
                    <button className="avatar-btn">
                        <label htmlFor="avatar">
                            Choose Photo
                        </label>
                        <input type="file" accept="image/*" id="avatar"
                        onChange={(e) => handleFile(e, setAvatar)} className="hidden" />
                    </button>
                </article>
                <article className="form-group">
                    <label htmlFor="userId">Email</label>
                    <input type="email" id="userId" className={inter.className}
                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                </article>
                <article className="form-group">
                    <label htmlFor="pswd">Password</label>
                    <input type="text" id="pswd" placeholder="password"
                    value={pswd} onChange={(e) => setPswd(e.target.value)}
                    className={inter.className}/>
                </article>
                <article className="form-group">
                    <label htmlFor="pswd2">Confirm Password</label>
                    <input type="text" id="pswd2" placeholder="password"
                    value={pswd2} onChange={(e) => setPswd2(e.target.value)}
                    className={inter.className}/>
                </article>
                <button type="submit" onClick={async () => await handleSignup()}
                className="submit-btn hover:bg-clr-6 hover: text-clr-5">
                    {loading ? <SpinnerOne /> : <span>Sign Up</span>}
                </button>
            </form>
        </section>
    )
}

export default page