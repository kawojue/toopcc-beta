/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useRef, useState } from 'react';

const page = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>('');

    const handleBold = () => {
        document.execCommand('bold', false);
    };

    const handleSave = () => {
        if (!editorRef.current) return

        setContent(editorRef.current.innerHTML);
    };

    return (
        <>
        <div className="flex gap-3">
            <button onClick={handleBold}>Bold</button>
            <button onClick={() => document.execCommand('italic', false)}>Italic</button>
            <button onClick={handleSave}>Save</button>
        </div>

        <div
            ref={editorRef}
            contentEditable="true"
            style={{ border: '1px solid #ccc', minHeight: '100px', padding: '10px' }}
        />
        {/* <div>
            <h3>Rendered Content:</h3>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div> */}
        </>
    );
};

export default page;
