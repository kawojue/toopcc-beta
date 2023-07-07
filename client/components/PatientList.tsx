"use client"
import Link from 'next/link'
import { lato } from '@/public/font/font'
import { FC, useRef, useState, useEffect } from 'react'

const PatientList: FC<{ patient: any }> = ({ patient }) => {
    const ptRef = useRef<HTMLElement>(null)
    const [show, setShow] = useState<boolean>(false)

    function swipe(): void {
        const current: HTMLElement | null = ptRef.current
        if (!current) return
        
        const bottom: number = window.innerHeight / 5 * (9 / 2)
        const containerTop: number = current.getBoundingClientRect().top
        if (containerTop < bottom) {
            setShow(true)
        } else {
            setShow(false)
        }
    }

    useEffect(() => {
        swipe()
        window.addEventListener('scroll', swipe)

        return () => window.removeEventListener('scroll', swipe)
    }, [])

    return (
        <article ref={ptRef} className={`${show && 'show'} patients-list hover:text-clr-3 hover:bg-clr-5`}>
            <Link href={`/patients/${patient.card_no?.split('/')[0]}`}
            className="patients-link">
                <div className="flex flex-col gap-1">
                    <p className="w-14">
                        {patient.card_no}
                    </p>
                    <p className="font-semibold tracking-wider">
                        {patient.fullname}
                    </p>
                </div>
                <p className={`${lato.className} tracking-wide w-28`}>
                    {patient.phone_no}
                </p>
            </Link>
        </article>
    )
}

export default PatientList