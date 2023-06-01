"use client"
import Link from 'next/link'

const Navbar = () => {
    return (
        <nav>
            <article>
                <p>Logo</p>
                <ul>
                    <li>
                        <Link href=""></Link>
                    </li>
                    <li>
                        <Link href="">Services</Link>
                    </li>
                    <li>
                        <Link href="">FAQs</Link>
                    </li>
                </ul>
            </article>
        </nav>
    )
}

export default Navbar