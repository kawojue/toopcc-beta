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
            className=""
        />
        {/* <div>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div> */}
        </>
    );
};

export default page;
