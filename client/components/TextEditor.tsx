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

    return (
        <section>
            <div>
                <button type="button" title='Bold' className={`${isBold ? 'text-lg' : ''} editor-btn`}
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
                style={{ border: '1px solid #ccc', minHeight: '100px', padding: '10px', resize: 'both' }} />
        </section>
    )
}

export default TextEditor
