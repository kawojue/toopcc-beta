/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import '../styles.css'
import notify from '@/utils/notify'
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
                sex: state.sex, age: state.age, date: state.date
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
            <form>
                <article>
                    <label>Card Number</label>
                    <input />
                </article>
                <article>
                    <label>Full name</label>
                    <input />
                </article>
                <article>
                    <label>Phone number</label>
                    <input />
                </article>
                <article>
                    <label>Address</label>
                    <input />
                </article>
                <article>
                    <div>
                        <label>Age</label>
                        <input />
                    </div>
                    <div>
                        <label>Sex</label>
                        <input />
                    </div>
                </article>
                <article>
                    <label>Date</label>
                    <input />
                </article>
            </form>
        </section>
    )
}

export default page