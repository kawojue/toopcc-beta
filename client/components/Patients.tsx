"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Patients = ({ patients }: any) => {
    const router = useRouter()

    return (
        <section className="flex flex-col gap-2">
            {patients.map((patient: any) => (
                <article key={patient._id} className="bg-clr-5">
                    <Link href={`/patients/${patient.card_no?.split('/')[0]}`}
                    className="flex justify-between items-center">
                        <p>{patient.card_no}</p>
                        <p>{patient.fullname}</p>
                        <p>{patient.sex}</p>
                    </Link>
                </article>
            ))}
        </section>
    )
}

export default Patients