"use client"
import PatientList from './PatientList'
import { catamaran } from '@/public/font/font'
import { usePatientStore } from '@/utils/store'
import { RxMagnifyingGlass } from '@/public/icons/ico'

const Patients = ({ patients }: any) => {
    const { search, setSearch } = usePatientStore()

    // search
    const searchQuery: any[] = patients.filter((patient: any) =>
        (patient.fullname?.toLowerCase()?.includes(search.toLowerCase())) // by name
        || (patient.address?.toLowerCase()?.includes(search.toLowerCase())) // by address
        || (patient.card_no?.includes(search.toUpperCase())) // by card number
        || (patient.phone_no?.includes(search))) // by phone number

    return (
        <>
            <section className="patients md:max-w-[800px] overflow-x-hidden">
                <div className="absolute top-10 right-2">
                    <div className="relative">
                        <input type="text" value={search} className="w-20 md:w-24 lg:w-28"
                            onChange={(e) => setSearch(e.target.value)} />
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
                        {searchQuery.map((patient: any) => (<PatientList patient={patient} key={patient._id} />))}
                    </>}
            </section>
        </>
    )
}

export default Patients