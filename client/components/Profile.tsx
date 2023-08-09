"use client"
import Staffs from './Staffs'
import Image from 'next/image'
import useRole from '@/hooks/useRole'
import useAuth from '@/hooks/useAuth'
import getPeriod from '@/utils/period'
import { inter } from '@/public/font/font'
import { usePathname } from 'next/navigation'
import convertISODate from '@/utils/shortDate'
import { useState, useEffect, FC } from 'react'
import {
    HiOutlineKey, AiOutlineCamera, AiOutlineMail
} from '@/public/icons/ico'

// import modals
import RoleModal from './Staff Modals/Role'
import PswdModal from './Staff Modals/Pswd'
import ResignModal from './Staff Modals/Resign'
import AvatarModal from './Staff Modals/Avatar'
import UsernameModal from './Staff Modals/Username'
import FullnameModal from './Staff Modals/Fullname'

const Profile: FC<{ profile: any }> = ({ profile }) => {
    const pathName: string = usePathname()
    const { state, dispatch }: IModal = useAuth()
    const isRoles = useRole("hr", "admin") as boolean
    const [onMouse, setOnMouse] = useState<boolean>(false)
    const [shortDate, setShortDate] = useState<string>("")

    useEffect(() => {
        setShortDate(convertISODate(profile?.createdAt))
    }, [profile])

    const authRoles: string[] = profile?.roles || []

    return (
        <main className="profile-main">
            {/* Modals */}
            <>
                <PswdModal state={state} dispatch={dispatch} />
                <RoleModal state={state} dispatch={dispatch} profile={profile} />
                <ResignModal state={state} dispatch={dispatch} profile={profile} />
                <AvatarModal state={state} dispatch={dispatch} profile={profile} />
                <UsernameModal state={state} dispatch={dispatch} profile={profile} />
                <FullnameModal state={state} dispatch={dispatch} profile={profile} />
            </>
            <section className="profile-header">
                <h1 className='profile-header-h1 md:text-3xl'>
                    {pathName === "/staff/profile" ? "Your Info" : "Staff Info"}
                </h1>
                {pathName === "/staff/profile" &&
                    <button className="change-pswd-btn"
                        onClick={() => dispatch({ type: "PSWD" })}>
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
                        {pathName !== "/staff/profile" ?
                            <div onMouseLeave={() => setOnMouse(false)}
                                onMouseEnter={() => setOnMouse(true)}
                                className={`profile-avatar md:w-[12rem] md:h-[12rem]`}>
                                {profile?.avatar?.url ?
                                    <Image src={profile?.avatar?.url} alt="avatar"
                                        title="change your avatar" width={300} height={300} priority /> :
                                    <Image src="https://res.cloudinary.com/kawojue/image/upload/v1685607626/TOOPCC/Staffs/avatar_ndluis.webp" alt="avatar" title="change your avatar" width={300} height={300} priority />}
                            </div> :
                            <div onMouseLeave={() => setOnMouse(false)}
                                onMouseEnter={() => setOnMouse(true)}
                                onClick={() => dispatch({ type: "AVATAR" })}
                                className={`${onMouse && 'before:content-[""] before:bg-clr-10 before:absolute before:top-0 before:right-0 before:w-full before:h-full before:z-[999] cursor-pointer'} profile-avatar md:w-[12rem] md:h-[12rem]`}>
                                {profile?.avatar?.url ?
                                    <Image src={profile?.avatar?.url} alt="avatar"
                                        title="change your avatar" width={300} height={300} priority /> :
                                    <Image src="https://res.cloudinary.com/kawojue/image/upload/v1685607626/TOOPCC/Staffs/avatar_ndluis.webp" alt="avatar" title="avatar" width={300} height={300} priority />}
                                <div className={`${onMouse && 'cam-ico'}`}>
                                    <AiOutlineCamera className="text-clr-0 text-4xl md:text-5xl lg:text-6xl" />
                                </div>
                            </div>}
                        <div>
                            <h3 title="edit fullname" onClick={() => pathName === "/staff/profile" && dispatch({ type: "FULLNAME" })}
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
                        {pathName === "/staff/profile" &&
                            <button className="profile-edit-btn"
                                onClick={() => dispatch({ type: "USERNAME" })}>
                                Edit Username
                            </button>}
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
                        {pathName !== "/staff/profile" &&
                            <div className="profile-card-info">
                                <p className="text-clr-3">Roles</p>
                                <p className="text-clr-2 capitalize">
                                    {authRoles.join(", ").trim()}
                                </p>
                                <button className="profile-edit-btn"
                                    onClick={() => dispatch({ type: "ROLES" })}>
                                    Edit Roles
                                </button>
                            </div>}
                        <div className="profile-card-info">
                            <p className="text-clr-3">Resigned</p>
                            <p title={`${profile?.resigned?.resign ? `Resigned ${getPeriod(profile?.resigned?.date)}` : "Staff hasn't resigned."}`} >
                                {profile?.resigned?.resign ? `Resigned on ${convertISODate(profile?.resigned.date)}` : "Null"}
                            </p>
                            {pathName !== "/staff/profile" && <button className="profile-edit-btn"
                                onClick={() => dispatch({ type: "RESIG" })}>
                                Edit Resignation
                            </button>}
                        </div>
                        <div className="flex justify-between py-1.5">
                            <p className="text-clr-3">Date Creation</p>
                            <p className="text-clr-2">{shortDate}</p>
                        </div>
                    </div>
                </article>
                {isRoles && <article className="mb-10">
                    <Staffs />
                </article>}
            </section>
        </main>
    )
}

export default Profile