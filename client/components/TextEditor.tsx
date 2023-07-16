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
    }, 2000)

    return (
        <article className="my-5">
            <div className="w-full flex items-center justify-end gap-4 mb-2 pr-5">
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
                    onClick={() => {
                        document.execCommand('copy', false)
                        setIsCopy(!isBold)
                    }}>
                    {isCopy ? 'Copied' : <FaCopy />}
                </button>
            </div>
            <div ref={textEditorRef} contentEditable="true"
                className="outline-none h-[120px] px-1 py-0.5 rounded-lg text-lg overflow-y-auto border-[1px] border-clr-3 focus:border-2 focus:border-clr-2" />
        </article>
    )
}

export default TextEditor
