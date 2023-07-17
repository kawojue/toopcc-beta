/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import {
    FaUnderline,
    FaItalic, FaBold,
} from '@/public/icons/ico'
import { useTextEditor } from '@/utils/store'

const TextEditor: React.FC<{ textEditorRef: any }> = ({ textEditorRef }) => {
    const {
        isBold, setIsBold,
        isItalic, setIsItalic,
        isUnderline, setIsUnderline
    }: TextEditorState = useTextEditor()

    const exec = (command: string, get: boolean, set: (get: boolean) => void) => {
        document.execCommand(command, false)
        set(!get)
    }

    return (
        <article className="my-5">
            <div className="w-full flex items-center justify-end gap-4 mb-2 pr-5">
                <button type="button" title='Bold'
                    className={`${isBold && 'active'} editor-btn`}
                    onClick={() => exec('bold', isBold, setIsBold)}>
                    <FaBold />
                </button>
                <button type="button" title='Italic'
                    className={`${isItalic && 'active'} editor-btn`}
                    onClick={() => exec('italic', isItalic, setIsItalic)}>
                    <FaItalic />
                </button>
                <button type="button" title='Underline'
                    className={`${isUnderline && 'active'} editor-btn`}
                    onClick={() => exec('underline', isUnderline, setIsUnderline)}>
                    <FaUnderline />
                </button>
            </div>
            <div ref={textEditorRef} contentEditable="true"
                className="editor-box focus:border-2 focus:border-clr-2 focus:bg-clr-5" />
        </article>
    )
}

export default TextEditor
