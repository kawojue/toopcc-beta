"use client"
import convertISODate from "@/utils/shortDate"

const Patient = ({ patient }:any) => {
    console.log(patient)

    return (
        <section className="patients md:max-w-[800px] overflow-x-hidden">
            <div>
                <span>Card Number:</span>
                <span>{patient.card_no}</span>
            </div>
            <article className="w-full flex justify-between">
                <div className="flex flex-col gap-1.5">
                    <div>
                        <span>Full name:</span>
                        <span>{patient.fullname}</span>
                    </div>
                    <div>
                        <span>Address:</span>
                        <span>{patient.address || 'Null'}</span>
                    </div>
                    <div>
                        <span>Date:</span>
                        <span>{convertISODate(patient.date) || 'Null'}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <div>
                        <span>Age:</span>
                        <span>{patient.age}</span>
                    </div>
                    <div>
                        <span>Sex:</span>
                        <span>{patient.sex}</span>
                    </div>
                    <div>
                        <span>Phone Number:</span>
                        <span>{patient.phone_no || 'Null'}</span>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default Patient