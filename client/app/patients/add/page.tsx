/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import '../styles.css'
import notify from '@/utils/notify'
import { parseISO } from 'date-fns'
import axios from '@/app/api/instance'
import usePatient from '@/hooks/usePatient'
import throwError from '@/utils/throwError'
import { useState, FormEvent } from 'react'

const page = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const { token, state, dispatch }: IPatient = usePatient()

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        setLoading(true)
        await axios.post(
            '/patients/add',
            JSON.stringify({
                date: state.date ? parseISO(state.date).toISOString(): "",
                card_no: state.card_no, fullname: state.fullname,
                phone_no: state.phone_no, address: state.address,
                sex: state.sex, age: state.age,
            }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => notify(res.data?.action, res.data?.msg))
        .catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    return (
        <section className="add-patient">
            <h3>Add Patient</h3>
            <form onSubmit={handleSubmit} className="patient-form">
                <article>
                    <div>
                        <label>Card Number</label>
                        <input value={state.card_no} type='text'
                        onChange={(e) => dispatch({ type: 'CARD_NO', payload: e.target.value })} />
                    </div>
                    <div>
                        <label>Date</label>
                        <input value={state.date} type="date"
                        onChange={(e) => dispatch({ type: 'DATE', payload: e.target.value })} />
                    </div>
                </article>
                <article>
                    <label>Full name</label>
                    <input value={state.fullname} type='text'
                    onChange={(e) => dispatch({ type: 'FULLN', payload: e.target.value })} />
                </article>
                <div>
                    <article>
                            <label>Age</label>
                            <input value={state.age} type='number'
                            onChange={(e) => dispatch({ type: 'AGE', payload: e.target.value })} />
                    </article>
                    <article>
                        <p>Gender</p>
                        <div>
                            <div>
                                <label htmlFor='male'>Male</label>
                                <input value='Male' type="radio" id='male' name="sex"
                                onChange={(e) => dispatch({ type: "SEX", payload: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor='female'>Female</label>
                                <input value='Female' type="radio" id='female' name="sex"
                                onChange={(e) => dispatch({ type: "SEX", payload: e.target.value })} />
                            </div>
                        </div>
                    </article>
                </div>
                <article>
                    <label>Address</label>
                    <input value={state.address} type='text'
                    onChange={(e) => dispatch({ type: 'ADDR', payload: e.target.value })} />
                </article>
                <article>
                    <label>Phone number</label>
                    <input value={state.phone_no} type='number'
                    onChange={(e) => dispatch({ type: 'PHN', payload: e.target.value })} />
                </article>
                <button type="submit">
                    Submit
                </button>
            </form>
        </section>
    )
}

export default page