/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import useToken from '@/hooks/useToken'
import usePatient from '@/hooks/usePatient'
import PicsUpload from '@/components/PicsUpload'
import TextEditor from '@/components/TextEditor'
import { useState, FormEvent, useRef, useEffect } from 'react'

const page = () => {
    const token: string = useToken()
    const { pic1, pic2, pic3 } = usePatient()
    const textEditorRef = useRef<HTMLDivElement>(null)
    const [picsArray, setPicsArray] = useState<string[]>([])

    useEffect(() => {
        const array: string[] = [pic1, pic2, pic3].filter((arr: string) => arr !== '')
        setPicsArray(array)
    }, [pic1, pic2, pic3])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!textEditorRef.current) return

        console.log(picsArray.length)
        console.log(textEditorRef.current.innerHTML)
    }

    return (
        <form onSubmit={async (e) => await handleSubmit(e)}>
            <button onClick={handleSubmit}>
                Submit
            </button>
            <TextEditor textEditorRef={textEditorRef} />
            <PicsUpload />
        </form>
    )
}

export default page