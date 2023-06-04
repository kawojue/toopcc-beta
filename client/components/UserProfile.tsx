"use client"
import { GoKey } from '@/public/icons/ico'

const UserProfile: React.FC<any> = ({ profile }) => {
    return (
        <main className="profile-main">
            <section className="profile-header">
                <h1>Your Info</h1>
                <button>
                    <GoKey />
                    <p>
                        <span>Change Password</span>
                        <span>Security</span>
                    </p>
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