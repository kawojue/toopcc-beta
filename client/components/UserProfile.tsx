"use client"
import { HiOutlineKey } from '@/public/icons/ico'

const UserProfile: React.FC<{ profile: any }> = ({ profile }) => {
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

                </article>
            </section>
        </main>
    )
}

export default UserProfile