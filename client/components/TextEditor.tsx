/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useRef } from 'react'

const TextEditor: React.FC<{ textsFn: (texts: string) => void }> = ({ textsFn }) => {
    const editorRef = useRef<HTMLDivElement>(null)

    const handleTexts = () => {
        if (!editorRef.current) return
        textsFn(editorRef.current.innerHTML)
    }

    return (
        <section>
            <div className="flex gap-3">
                <button onClick={() => document.execCommand('bold', false)}>
                    Bold
                </button>
                <button onClick={() => document.execCommand('italic', false)}>
                    Italic
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable="true"
                onChange={handleTexts}
                style={{ border: '1px solid #ccc', minHeight: '100px', padding: '10px' }} />
        </section>
    )
}

export default TextEditor
