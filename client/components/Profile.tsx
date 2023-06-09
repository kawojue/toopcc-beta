"use client"
import Image from 'next/image'
import { useState } from 'react'
import useJWT from '@/hooks/useJWT'
import {
    HiOutlineKey, AiOutlineCamera, AiOutlineMail
} from '@/public/icons/ico'
import { inter } from '@/public/font/font'
import { format, parseISO } from 'date-fns'

const UserProfile: React.FC<{ profile: any }> = ({ profile }) => {
    const { roles }: any = useJWT()
    const [onMouse, setOnMouse] = useState(false)

    const createdAt: Date = parseISO(profile?.createdAt)
    const shortDate: string = format(createdAt, "dd/MM/yyyy")

    const authRoles: string[] = profile?.roles || []

    return (
        <main className="profile-main">
            <section className="profile-header">
                <h1 className='profile-header-h1 md:text-3xl'>Your Info</h1>
                <button className="change-pswd-btn">
                    <HiOutlineKey className="key" />
                    <div>
                        <span>Change Password</span>
                        <span>Security</span>
                    </div>
                </button>
            </section>
            <section className="profile-cards">
                <article className="profile-card">
                    <div className="profile-card-center">
                        <div onMouseLeave={() => setOnMouse(false)} onMouseEnter={() => setOnMouse(true)}
                        className={`${onMouse &&'before:content-[""] before:bg-clr-10 before:absolute before:top-0 before:right-0 before:w-full before:h-full before:z-[999]'} profile-avatar md:w-[12rem] md:h-[12rem]`}>
                            <Image src={profile?.avatar?.secure_url} alt="avatar"
                            title="avatar" width={300} height={300} priority/>
                            <AiOutlineCamera className="cam-ico" />
                        </div>
                        <div>
                            <h3 title="edit fullname" className='leading-tight font-semibold cursor-pointer text-clr-2 text-lg md:text-2xl lg:text-4xl hover:underline tracking-wider trans'>
                                {profile?.fullname}
                            </h3>
                            <h6 className='capitalize'>
                                {authRoles.join(", ")}
                            </h6>
                        </div>
                    </div>
                </article>
                <article className="profile-card">
                    <h3 className="border-b-[0.03125rem] mb-3 py-1.5 text-clr-2 font-semibold tracking-wider">
                        Account Info
                    </h3>
                    <div className="flex justify-between items-center py-1.5 border-b-[0.08125rem]">
                        <p className="text-clr-3">Username</p>
                        <p className="text-clr-2">{profile?.user}</p>
                        <button className="text-sm text-clr-4 hover:text-clr-6">
                            Edit Username
                        </button>
                    </div>
                    <div className="flex flex-col gap-1.5 justify-center">
                        <div className='flex justify-between items-center py-1.5 border-b-[0.03125rem]'>
                            <p className="text-clr-3">Email Address</p>
                            <div className={`${inter.className} flex gap-3 items-center text-xs tracking-wide text-clr-2 md:text-sm`}>
                                <AiOutlineMail />
                                <p>
                                    {profile?.mail?.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b-[0.08125rem]">
                            <p className="text-clr-3">Roles</p>
                            <p className="text-clr-2 capitalize">
                                {authRoles.join(", ")}
                            </p>
                            {roles?.includes("hr") && <button className="text-sm text-clr-4 hover:text-clr-6">
                                Edit Roles
                            </button>}
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b-[0.08125rem]">
                            <p className="text-clr-3">Resigned</p>
                            <p>{profile?.resigned?.resign ? "Resigned": "Null"}</p>
                            {roles?.includes("hr") && <button className="text-sm text-clr-4 hover:text-clr-6">
                                Edit Resignation
                            </button>}
                        </div>
                        <div className="flex justify-between py-1.5">
                            <p className="text-clr-3">Date Creation</p>
                            <p className="text-clr-2">{shortDate}</p>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}

export default UserProfile