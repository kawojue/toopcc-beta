/* eslint-disable react-hooks/rules-of-hooks */
"use client"

const TextEditor: React.FC<{ textEditorRef: any }> = ({ textEditorRef }) => {

    return (
        <section>
            <div className="flex gap-3">
                <button type="button" onClick={() => document.execCommand('bold', false)}>
                    Bold
                </button>
                <button type="button" onClick={() => document.execCommand('italic', false)}>
                    Italic
                </button>
            </div>
            <div
                ref={textEditorRef}
                contentEditable="true"
                style={{ border: '1px solid #ccc', minHeight: '100px', padding: '10px' }} />
        </section>
    )
}

export default TextEditor
