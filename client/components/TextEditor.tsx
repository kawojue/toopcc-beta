/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import {
    FaItalic, FaBold,
    FaUnderline, FaCopy,
} from '@/public/icons/ico'
import { useTextEditor } from '@/utils/store'

const TextEditor: React.FC<{ textEditorRef: any }> = ({ textEditorRef }) => {
    const {
        isCopy, setIsCopy,
        isBold, setIsBold,
        isItalic, setIsItalic,
        isUnderline, setIsUnderline
    }: TextEditorState = useTextEditor()

    setTimeout(() => {
        setIsCopy(false)
    }, 1200)

    return (
        <section>
            <div className="w-full flex items-center justify-end gap-5 mb-2">
                <button type="button" title='Bold'
                    className={`${isBold && 'active'} editor-btn`}
                    onClick={() => {
                        document.execCommand('bold', false)
                        setIsBold(!isBold)
                    }}>
                    <FaBold />
                </button>
                <button type="button" title='Italic' className="editor-btn"
                    onClick={() => document.execCommand('italic', false)}>
                    <FaItalic />
                </button>
                <button type="button" title='Underline' className="editor-btn"
                    onClick={() => document.execCommand('underline', false)}>
                    <FaUnderline />
                </button>
                <button type="button" title='Copy' className="editor-btn"
                    onClick={() => document.execCommand('copy', false)}>
                    <FaCopy />
                </button>
            </div>
            <div ref={textEditorRef} contentEditable="true"
                className="outline-none h-[100px] px-0.5 rounded-lg text-lg overflow-y-auto" />
        </section>
    )
}

export default TextEditor
