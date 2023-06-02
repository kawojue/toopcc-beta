"use client"

const Patients = ({ patients }: any) => {
    return (
        <section>
            {patients.map((patient: any) => {
                <article key={patient.card_no} >

                </article>
            })}
        </section>
    )
}

export default Patients