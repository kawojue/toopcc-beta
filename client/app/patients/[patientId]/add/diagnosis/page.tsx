/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useState, FormEvent } from 'react'
import TextEditor from '@/components/TextEditor'

const page = () => {
    const [texts, setTexts] = useState<string>("")

    console.log(texts)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <button onClick={handleSubmit}>
                Submit
            </button>
            <TextEditor textsFn={setTexts} />
        </form>
    )
}

export default page