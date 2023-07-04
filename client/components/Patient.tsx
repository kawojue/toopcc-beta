"use client"
import getPeriod from "@/utils/period"
import convertISODate from "@/utils/shortDate"

const Patient = ({ patient }:any) => {

    return (
        <section className="patients md:max-w-[800px] overflow-x-hidden">
            <article className="w-full flex justify-between">
                <div className="patient_info tracking-wider"
                title={`${patient.death?.dead ? getPeriod(patient.death?.date): ''}`}>
                    <span className="font-bold">Status :</span>
                    <span className="font-semibold">
                        {patient.death?.dead === true ?
                        `Dead ${convertISODate(patient.death?.date)}`: 'Active'}
                    </span>
                </div>
                <div className="patient_info tracking-wider ">
                    <span className="font-bold">Card No :</span>
                    <span className="font-semibold">
                        {patient.card_no}
                    </span>
                </div>
            </article>
            <article className={`flex flex-col justify-between gap-5 mt-5 md:items-center md:flex-row`}>
                <div className="patient_info flex-col">
                    <div className="patient_info">
                        <span>Full name :</span>
                        <span>{patient.fullname}</span>
                    </div>
                    <div className="patient_info">
                        <span>Address :</span>
                        <span>{patient.address || 'Null'}</span>
                    </div>
                    <div className="patient_info">
                        <span>Date :</span>
                        <span>{convertISODate(patient.date) || 'Null'}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <div className="patient_info">
                        <span>Age :</span>
                        <span>{patient.age}</span>
                    </div>
                    <div className="patient_info">
                        <span>Sex :</span>
                        <span>{patient.sex}</span>
                    </div>
                    <div className="patient_info">
                        <span>Phone No :</span>
                        <span>{patient.phone_no || 'Null'}</span>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default Patient