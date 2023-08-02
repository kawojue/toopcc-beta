/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useTextEditor } from '@/utils/store'
import { FaUnderline, FaItalic, FaBold } from '@/public/icons/ico'

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
        <section className="rounded-md border-[0.1325rem] border-clr-7 focus:border-clr-4">
            <div className="border-b-[0.125rem] py-2 flex gap-5 pl-5">
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
            <div ref={textEditorRef} contentEditable="true" className="editor-box" />
        </section>
    )
}

export default TextEditor
