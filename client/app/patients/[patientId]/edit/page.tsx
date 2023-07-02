/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import notify from '@/utils/notify'
import { parseISO } from 'date-fns'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import { lato } from '@/public/font/font'
import { useRouter } from 'next/navigation'
import usePatient from '@/hooks/usePatient'
import throwError from '@/utils/throwError'
import { useState, FormEvent } from 'react'
import { SpinnerOne } from '@/components/Spinner'

const page = ({ params: { patientId } }: IPt) => {
    const router = useRouter()
    const token: string = useToken()
    const { state, dispatch }: IPatient = usePatient()
    const [loading, setLoading] = useState<boolean>(false)

    const death = {
        dead: state.dead === 'yes' ? true : state.dead === 'no' ? false : null,
        date: state.deathDate ? parseISO(state.deathDate).toISOString(): ''
    }

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()

        if (death.date) {
            if (new Date(death.date) > new Date()) {
                notify('error', 'Invalid Death Date.')
                return
            }
        }

        setLoading(true)
        await axios.put(
            `/patients/patient/${patientId}`,
            JSON.stringify({
                sex: state.sex, age: state.age,
                death: death.dead === null ? '': death,
                cardNo: state.cardNo, fullname: state.fullname,
                phone_no: state.phone_no, address: state.address,
                date: state.date ? parseISO(state.date).toISOString(): '',
            }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => {
            notify(res.data?.action, res.data?.msg)
            setTimeout(() => {
                router.push(`/patients/${patientId}`)
            }, 230);
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    return (
        <section className="form-section md:mt-14">
            <h3 className={`${lato.className} form-header`}>
                Edit Patient
            </h3>
            <form onSubmit={handleSubmit} className="patient-form">
                <article className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <label>Card Number</label>
                        <input value={state.cardNo} type='text' className="w-24"
                        onChange={(e) => dispatch({ type: 'CARDNO', payload: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Date</label>
                        <input value={state.date} type="date"
                        onChange={(e) => dispatch({ type: 'DATE', payload: e.target.value })} />
                    </div>
                </article>
                <article className="flex items-center gap-3">
                    <label>Full name</label>
                    <input value={state.fullname} type='text' className="flex-grow"
                    onChange={(e) => dispatch({ type: 'FULLN', payload: e.target.value })} />
                </article>
                <article className="flex items-center gap-3">
                    <label>Address</label>
                    <input value={state.address} type='text' className="flex-grow"
                    onChange={(e) => dispatch({ type: 'ADDR', payload: e.target.value })} />
                </article>
                <div className="flex justify-between">
                    <article className="flex gap-1.5 self-end items-center">
                            <label>Age</label>
                            <input value={state.age} type='text' className="w-10"
                            onChange={(e) => dispatch({ type: 'AGE', payload: e.target.value })} />
                    </article>
                    <article>
                        <p className="mb-1">Gender</p>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1 items-center">
                                <input value='Male' type="radio" id='male' name="sex"
                                onChange={(e) => dispatch({ type: "SEX", payload: e.target.value })} />
                                <label htmlFor='male'>Male</label>
                            </div>
                            <div className="flex gap-1 items-center">
                                <input value='Female' type="radio" id='female' name="sex"
                                onChange={(e) => dispatch({ type: "SEX", payload: e.target.value })} />
                                <label htmlFor='female'>Female</label>
                            </div>
                        </div>
                    </article>
                </div>
                <div className="flex justify-between">
                    <article>
                        <p className="mb-1">Dead</p>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1 items-center">
                                <input value='yes' type="radio" id='death_yes' name="death"
                                onChange={(e) => dispatch({ type: 'DEAD', payload: e.target.value })} />
                                <label htmlFor='death_yes'>Yes</label>
                            </div>
                            <div className="flex gap-1 items-center">
                                <input value='no' type="radio" id='death_no' name="death"
                                onChange={(e) => dispatch({ type: "DEAD", payload: e.target.value })} />
                                <label htmlFor='death_no'>No</label>
                            </div>
                        </div>
                    </article>
                    <article className="flex gap-1.5 self-end items-center">
                        <div className="flex flex-col gap-1">
                            <label>Date of Death</label>
                            <input value={state.deathDate} type="date"
                            onChange={(e) => dispatch({ type: 'DEATH_D', payload: e.target.value })} />
                        </div>
                    </article>
                </div>
                <article className="flex items-center gap-3">
                    <label>Phone number</label>
                    <input value={state.phone_no} type='text' className='flex-grow'
                    onChange={(e) => dispatch({ type: 'PHN', payload: e.target.value })} />
                </article>
                <button type="submit"
                className="submit-btn hover:bg-clr-6 hover: text-clr-5">
                    {loading ? <SpinnerOne />: 'Submit'}
                </button>
            </form>
        </section>
    )
}

export default page