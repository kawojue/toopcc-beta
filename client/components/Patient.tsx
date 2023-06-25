"use client"
import convertISODate from "@/utils/shortDate"

const Patient = ({ patient }: any) => {
    console.log(patient)

    return (
        <section>
            <article className="relative">
                <div>
                    <span>Card Number: </span>
                    <span>{patient.card_no}</span>
                </div>
                <div>
                    <div>
                        <span>Full name: </span>
                        <span>{patient.fullname}</span>
                    </div>
                    <div>
                        <span>Address: </span>
                        <span>{patient.address || 'Null'}</span>
                    </div>
                    <div>
                        <span>Date: </span>
                        <span>{convertISODate(patient.date) || 'Null'}</span>
                    </div>
                </div>
                <div>
                    <div>
                        <span>Age: </span>
                        <span>{patient.age}</span>
                    </div>
                    <div>
                        <span>Sex: </span>
                        <span>{patient.sex}</span>
                    </div>
                    <div>
                        <span>Phone Number: </span>
                        <span>{patient.phone_no || 'Null'}</span>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default Patient