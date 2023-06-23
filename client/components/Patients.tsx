"use client"
import Link from 'next/link'
import { useState } from 'react'
import '../app/patients/styles.css'
import { catamaran, lato } from '@/public/font/font'
import { RxMagnifyingGlass } from '@/public/icons/ico'

const Patients = ({ patients }: any) => {
    const [search, setSeach]= useState<string>("")

    const searchQuery: any[] = patients.filter((patient: any) =>
    (patient.fullname?.toLowerCase()?.includes(search.toLowerCase()))
    || (patient.address?.toLowerCase()?.includes(search.toLowerCase()))
    || (patient.card_no?.includes(search.toUpperCase()))
    || (patient.phone_no?.includes(search)))

    return (
        <>
        <section className="patients md:max-w-[800px] overflow-x-hidden">
            <div className="absolute top-10 right-2">
                <div className="relative">
                    <input type="text" value={search} className="w-20 md:w-24 lg:w-28"
                    onChange={(e) => setSeach(e.target.value)} />
                    <RxMagnifyingGlass className="absolute top-1.5 right-2.5" />
                </div>
            </div>
            <div className="patients-header">
                <h1 className={`${catamaran.className} text-clr-2`}>
                    List of All Patients
                </h1>
                <span></span>
            </div>
            {searchQuery.length === 0 ?
            <p className='text-clr-8 font-semibold text-2xl text-center'>
                Patient does not exist.
            </p> : 
            <>
                {searchQuery.map((patient: any) => (
                    <article key={patient._id}
                    className={`show patients-list hover:text-clr-3 hover:bg-clr-5`}>
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
                ))}
            </> }
        </section>
        </>
    )
}

export default Patients