/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { FormEvent } from 'react'
import notify from '@/utils/notify'
import { parseISO } from 'date-fns'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import { lato } from '@/public/font/font'
import usePatient from '@/hooks/usePatient'
import throwError from '@/utils/throwError'
import { useAuthStore } from '@/utils/store'
import { SpinnerOne } from '@/components/Spinner'
import { AxiosError, AxiosResponse } from 'axios'

const page = () => {
    const token: string = useToken()
    const { loading, setLoading } = useAuthStore()
    const { state, dispatch }: IPatient = usePatient()

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        setLoading(true)
        await axios.post(
            '/patients/add',
            JSON.stringify({
                sex: state.sex, age: state.age,
                phone_no: state.phone_no, address: state.address,
                card_no: state.card_no, fullname: state.fullname,
                date: state.date ? parseISO(state.date).toISOString() : "",
            }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: AxiosResponse) => {
            dispatch({ type: 'RESET' })
            notify(res.data?.action, res.data?.msg)
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

    return (
        <section className="form-section md:mt-14">
            <h3 className={`${lato.className} form-header`}>
                Add New Patient
            </h3>
            <form onSubmit={handleSubmit} className="patient-form">
                <article className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <label>Card Number</label>
                        <input value={state.card_no} type='text' className="w-24"
                            onChange={(e) => dispatch({ type: 'CARD_NO', payload: e.target.value })} />
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
                        <div className="flex gap-3 items-center">
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
                <article className="flex items-center gap-3">
                    <label>Phone number</label>
                    <input value={state.phone_no} type='text' className='flex-grow'
                        onChange={(e) => dispatch({ type: 'PHN', payload: e.target.value })} />
                </article>
                <button type="submit"
                    className="submit-btn hover:bg-clr-6 hover: text-clr-5">
                    {loading ? <SpinnerOne /> : 'Submit'}
                </button>
            </form>
        </section>
    )
}

export default page