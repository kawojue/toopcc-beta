/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import blob from '@/utils/file'
import notify from '@/utils/notify'
import axios from '@/app/api/instance'
import { inter } from '@/public/font/font'
import { useRouter } from 'next/navigation'
import throwError from '@/utils/throwError'
import { useAuthStore } from '@/utils/store'
import PswdButton from '@/components/PswdBtn'
import SubmitBtn from '@/components/SubmitBtn'
import { useEffect, ChangeEvent } from 'react'
import { AxiosResponse, AxiosError } from 'axios'

const page = () => {
    const router = useRouter()
    const {
        pswd, pswd2, setPswd, setPswd2, pswdBtn,
        email, setEmail, avatar, setAvatar, auth,
        setPswdBtn, fullname, setFullname, resetStates,
        avatarPreview, setAvatarPreview, loading, setLoading
    } = useAuthStore()

    useEffect(() => {
        if (auth) router.push('/staff/profile')
    }, [auth, router])

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        blob(e, setAvatarPreview)
        setAvatar(e.target.files![0])
    }

    const handleSignup = async (): Promise<void> => {
        setLoading(true)
        const payload = { pswd, pswd2, email, avatar, fullname }
        const formData: FormData = new FormData()
        for (const key in payload) {
            formData.append(key, payload[key as keyof typeof payload])
        }
        await axios.post('/auth/signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res: AxiosResponse) => {
            resetStates()
            notify("success", res.data?.msg)
            setTimeout(() => {
                router.push('/staff/login')
            }, 500)
        }).catch((err: AxiosError) => throwError(err))
            .finally(() => setLoading(false))
    }

    return (
        <section className="section-form">
            <form onSubmit={e => e.preventDefault()}
                className="form">
                <article className="form-group avatar">
                    <div className="avatar-container">
                        <img src={`${avatarPreview ? avatarPreview : 'https://res.cloudinary.com/kawojue/image/upload/v1685607626/TOOPCC/Staffs/avatar_ndluis.webp'}`} alt="avatar" />
                    </div>
                    <button className="avatar-btn">
                        <label htmlFor="avatar">Choose photo</label>
                        <input type="file" accept="image/*" id="avatar"
                            onChange={(e) => handleFile(e)} className="hidden" />
                    </button>
                </article>
                <article className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className={inter.className}
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                </article>
                <article className="form-group">
                    <label htmlFor="fullname">Fullname</label>
                    <input type="text" id="fullname" className={inter.className} max={20}
                        value={fullname} onChange={(e) => setFullname(e.target.value)} />
                </article>
                <article className="form-group">
                    <label htmlFor="pswd">Password</label>
                    <div className="pswd-container">
                        <input type={`${pswdBtn ? 'text' : 'password'}`} id="pswd"
                            value={pswd} onChange={(e) => setPswd(e.target.value)}
                            placeholder="password" className={inter.className} />
                        <PswdButton get={pswdBtn} set={setPswdBtn} />
                    </div>
                </article>
                <article className="form-group">
                    <label htmlFor="pswd2">Confirm Password</label>
                    <input type="password" id="pswd2" placeholder="confirm password"
                        value={pswd2} onChange={(e) => setPswd2(e.target.value)}
                        className={inter.className} />
                </article>
                <SubmitBtn texts="Sign Up" handler={handleSignup} loading={loading} />
            </form>
        </section>
    )
}

export default page