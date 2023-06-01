/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState } from 'react'
import useAuth from "@/hooks/useAuth"
import { handleFile } from "@/utils/file"
import { inter } from "@/public/font/font"
import PswdButton from "@/components/PswdBtn"
import { SpinnerOne } from "@/components/Spinner"

const page = () => {
    const {
        loading, email, setEmail, avatar, setAvatar,
        pswd, pswd2, setPswd, setPswd2, handleSignup,
        fullname, setFullname
    }: any = useAuth()

    const [pswdBtn, setPswdBtn] = useState<boolean>(false)

    return (
        <section className="section-form">
            <form onSubmit={e => e.preventDefault()}
            className="form">
                <article className="form-group avatar">
                    <div className="avatar-container">
                        <img src={`${avatar ? avatar: 'https://res.cloudinary.com/kawojue/image/upload/v1685607626/TOOPCC/Staffs/avatar_ndluis.webp'}`} alt="avatar" />
                    </div>
                    <button className="avatar-btn hover:bg-clr-3 hover:text-clr-7">
                        <label htmlFor="avatar">
                            Choose Photo
                        </label>
                        <input type="file" accept="image/*" id="avatar"
                        onChange={(e) => handleFile(e, setAvatar)} className="hidden" />
                    </button>
                </article>
                <article className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className={inter.className}
                    value={email} onChange={(e) => setEmail(e.target.value)}/>
                </article>
                <article className="form-group">
                    <label htmlFor="fullname">Fullname</label>
                    <input type="text" id="fullname" className={inter.className}
                    value={fullname} onChange={(e) => setFullname(e.target.value)}/>
                </article>
                <article className="form-group">
                    <label htmlFor="pswd">Password</label>
                    <div className="pswd-container">
                        <input type={`${pswdBtn ? 'text': 'password'}`} id="pswd" placeholder="password"
                        value={pswd} onChange={(e) => setPswd(e.target.value)}
                        className={inter.className}/>
                        <PswdButton get={pswdBtn} set={setPswdBtn} />
                    </div>
                </article>
                <article className="form-group">
                    <label htmlFor="pswd2">Confirm Password</label>
                    <input type="password" id="pswd2" placeholder="password"
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