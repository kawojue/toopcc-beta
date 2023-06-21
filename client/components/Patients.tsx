"use client"
import { catamaran } from '@/public/font/font'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Patients = ({ patients }: any) => {
    const router = useRouter()

    return (
        <>
        <section className="px-1.5 flex flex-col gap-3 mt-10 max-w-[600px] md:max-w-[800px] w-[98vw] mx-auto overflow-y-auto trans relative">
            <div className="absolute top-10 right-2">
                <input type="text"/>

            </div>
            <div className="w-full flex flex-col items-center gap-2 font-bold text-2xl md:text-3xl mb-5 tracking-wider">
                <h1 className={`${catamaran.className} text-clr-2`}>
                    List of All Patients
                </h1>
                <span className="rounded-md px-9 py-1 bg-clr-1"></span>
            </div>
            {patients.map((patient: any) => (
                <article key={patient._id} className="bg-clr-7 py-1 px-2 text-sm md:text-lg rounded-lg font-medium text-clr-2 trans hover:text-clr-3 hover:bg-clr-5">
                    <Link href={`/patients/${patient.card_no?.split('/')[0]}`}
                    className="flex justify-between items-center text-center">
                        <p className="w-14">
                            {patient.card_no}
                        </p>
                        <p className="font-semibold w-1/2">
                            {patient.fullname}
                        </p>
                        <p className="w-28">
                            {patient.phone_no}
                        </p>
                    </Link>
                </article>
            ))}
        </section>
        </>
    )
}

export default Patients