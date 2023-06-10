"use client"
import Image from 'next/image'
import useAuth from '@/hooks/useAuth'
import useRole from '@/hooks/useRole'
import { inter } from '@/public/font/font'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import convertISODate from '@/utils/shortDate'
import {
    HiOutlineKey, AiOutlineCamera, AiOutlineMail
} from '@/public/icons/ico'

const Profile: React.FC<{ profile: any }> = ({ profile }) => {
    const isRole: boolean = useRole("hr")
    const pathName: string = usePathname()
    const { state, dispatch }: any = useAuth()
    const [onMouse, setOnMouse] = useState<boolean>(false)
    const [shortDate, setShortDate] = useState<string>("")
    
    useEffect(() => {
        setShortDate(convertISODate(profile?.createdAt))
    }, [profile])

    console.log(state)

    const authRoles: string[] = profile?.roles || []

    return (
        <main className="profile-main">
            <section className="profile-header">
                <h1 className='profile-header-h1 md:text-3xl'>
                    {pathName === "/staff/profile" ? "Your Info": "Staff Info"}
                </h1>
                {pathName === "/staff/profile" &&
                <button className="change-pswd-btn"
                onClick={() => dispatch({ type: "PSWD", toggle: true })}>
                    <HiOutlineKey className="key" />
                    <div>
                        <span>Change Password</span>
                        <span>Security</span>
                    </div>
                </button>}
            </section>
            <section className="profile-cards">
                <article className="profile-card">
                    <div className="profile-card-center">
                        {isRole && pathName !== "/staff/profile"  ?
                        <div onMouseLeave={() => setOnMouse(false)}
                        onMouseEnter={() => setOnMouse(true)}
                        className={`profile-avatar md:w-[12rem] md:h-[12rem]`}>
                            <Image src={profile?.avatar?.secure_url} alt="avatar"
                            title="change your avatar" width={300} height={300} priority/>
                        </div> :
                        <div onMouseLeave={() => setOnMouse(false)}
                        onMouseEnter={() => setOnMouse(true)}
                        onClick={() => dispatch({ type: "AVATAR", toggle: true })}
                        className={`${onMouse && 'before:content-[""] before:bg-clr-10 before:absolute before:top-0 before:right-0 before:w-full before:h-full before:z-[999] cursor-pointer'} profile-avatar md:w-[12rem] md:h-[12rem]`}>
                            <Image src={profile?.avatar?.secure_url} alt="avatar"
                            title="avatar" width={300} height={300} priority/>
                            <div className={`${onMouse && 'cam-ico'}`}>
                                <AiOutlineCamera className="text-clr-0 text-4xl md:text-5xl lg:text-6xl" />
                            </div>
                        </div>}
                        <div>
                            <h3 title="edit fullname" onClick={() => dispatch({ type: "FULLNAME", toggle: true })}
                            className='leading-tight font-semibold cursor-pointer text-clr-2 text-lg md:text-2xl lg:text-4xl hover:underline tracking-wider trans'>
                                {profile?.fullname}
                            </h3>
                            <h6 className='capitalize mt-2 text-clr-3 text-sm'>
                                {authRoles.join(", ")}
                            </h6>
                        </div>
                    </div>
                </article>
                <article className="profile-card">
                    <h3 className="border-b-[0.08125rem] mb-3 py-1.5 text-clr-2 font-semibold tracking-wider">
                        Account Info
                    </h3>
                    <div className="profile-card-info">
                        <p className="text-clr-3">Username</p>
                        <p className="text-clr-2">{profile?.user}</p>
                        {isRole && pathName !== "/staff/profile" ? "" : 
                        <button className="profile-edit-btn"
                        onClick={() => dispatch({ type: "USERNAME", toggle: true })}>
                            Edit Username
                        </button> }
                    </div>
                    <div className="flex flex-col gap-1.5 justify-center">
                        <div className='profile-card-info'>
                            <p className="text-clr-3">Email Address</p>
                            <div className={`${inter.className} flex gap-3 items-center text-xs tracking-wide text-clr-2 md:text-sm`}>
                                <AiOutlineMail />
                                <p>
                                    {profile?.mail?.email}
                                </p>
                            </div>
                        </div>
                        {isRole && pathName !== "/staff/profile" && <div className="profile-card-info">
                            <p className="text-clr-3">Roles</p>
                            <p className="text-clr-2 capitalize">
                                {authRoles.join(", ")}
                            </p>
                            <button className="profile-edit-btn"
                            onClick={() => dispatch({ type: "ROLES", toggle: true })}>
                                Edit Roles
                            </button>
                        </div>}
                        <div className="profile-card-info">
                            <p className="text-clr-3">Resigned</p>
                            <p title={`${profile?.resigned?.resign ? `Resigned on ${convertISODate(profile?.resigned.date)}` : "Staff hasn't resigned."}`} >
                                {profile?.resigned?.resign ? "Resigned": "Null"}
                            </p>
                            {isRole && <button className="profile-edit-btn"
                            onClick={() => dispatch({ type: "RESIG", toggle: true })}>
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

export default Profile