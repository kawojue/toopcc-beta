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
                card_no: state.card_no, fullname: state.fullname,
                phone_no: state.phone_no, address: state.address,
                sex: state.sex, age: state.age, date: parseISO(state.date).toISOString()
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
        <section>
            <h3>Add Patient</h3>
            <form onSubmit={handleSubmit}>
                <article>
                    <label>Card Number</label>
                    <input value={state.card_no} type='text'
                    onChange={(e) => dispatch({ type: 'CARD_NO', payload: e.target.value })} />
                </article>
                <article>
                    <label>Full name</label>
                    <input value={state.fullname} type='text'
                    onChange={(e) => dispatch({ type: 'FULLN', payload: e.target.value })} />
                </article>
                <article>
                    <label>Phone number</label>
                    <input value={state.phone_no} type='number'
                    onChange={(e) => dispatch({ type: 'PHN', payload: e.target.value })} />
                </article>
                <article>
                    <label>Address</label>
                    <input value={state.address} type='text'
                    onChange={(e) => dispatch({ type: 'ADDR', payload: e.target.value })} />
                </article>
                <article>
                    <div>
                        <label>Age</label>
                        <input value={state.age} type='number'
                        onChange={(e) => dispatch({ type: 'AGE', payload: e.target.value })} />
                    </div>
                    <div>
                        <label>Sex</label>
                        <input value={state.sex}
                        onChange={(e) => dispatch({ type: 'SEX', payload: e.target.value })} />
                    </div>
                </article>
                <article>
                    <label>Date</label>
                    <input value={state.date} type="date"
                    onChange={(e) => dispatch({ type: 'DATE', payload: e.target.value })} />
                </article>
                <button type="submit">
                    Submit
                </button>
            </form>
        </section>
    )
}

export default page