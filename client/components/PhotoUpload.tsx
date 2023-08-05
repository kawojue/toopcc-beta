"use client"
import { useDiagnosis } from '@/utils/store'
import { ChangeEvent, useState } from 'react'

const PhotoUpload: React.FC = () => {
    const { pictures, setPictures } = useDiagnosis()
    const [fileList, setFileList] = useState<any[]>([])

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        setPictures(e.target.files)
    }

    return (
        <section>
            <article>
                <div>
                    <label htmlFor='Photos'>Photos <span>*</span></label>
                    <input type="file" accept='image/*' id='Photos' className="hidden"
                        onChange={(e) => handleFile(e)} multiple />
                </div>
            </article>
        </section>
    )
}

export default PhotoUpload