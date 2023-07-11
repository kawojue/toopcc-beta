/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { handleFile } from '@/utils/file'
import TextEditor from '@/components/TextEditor'
import { useState, FormEvent, useRef } from 'react'

const page = () => {
    const textEditorRef = useRef<HTMLDivElement>(null)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!textEditorRef.current) return

        console.log(textEditorRef.current.innerHTML)
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <button onClick={handleSubmit}>
                Submit
            </button>
            <TextEditor textEditorRef={textEditorRef} />
        </form>
    )
}

export default page