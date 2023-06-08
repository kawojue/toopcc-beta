"use client"
import Image from 'next/image'
import { useState } from 'react'
import {
    HiOutlineKey, AiOutlineCamera, AiOutlineMail
} from '@/public/icons/ico'

const UserProfile: React.FC<{ profile: any }> = ({ profile }) => {
    const [onMouse, setOnMouse] = useState(false)

    return (
        <main className="profile-main">
            <section className="profile-header">
                <h1 className='profile-header-h1'>Your Info</h1>
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
                        className={`${onMouse ? 'before:content-[""] before:bg-clr-10 before:absolute before:top-0 before:right-0 before:w-full before:h-full before:z-[999]' : ''} profile-avatar md:w-[12rem] md:h-[12rem]`}>
                            <Image src={profile?.avatar?.secure_url} alt="avatar"
                            title="avatar" width={300} height={300} priority/>
                        </div>
                        <div className="profile-ids md:gap-16">
                            <h3 className='profile-ids-h3'>
                                {profile?.fullname}
                            </h3>
                            <p className='profile-ids-p md:text-xs hover:underline trans'>
                                <AiOutlineMail />
                                <span>{profile?.mail?.email}</span>
                            </p>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}

export default UserProfile