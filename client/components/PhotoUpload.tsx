"use client"
import { ChangeEvent, FC } from 'react'
import { useDiagnosis } from '@/utils/store'

const PhotoUpload: FC<any> = ({ onFileSelected }) => {
    const { pictures, setPictures } = useDiagnosis()

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList: File[] = []
        const files = e.target.files
        for (let i = 0; i < files!.length; i++) {
            fileList.push(files![i])
        }

        setPictures(fileList)
    }

    return (
        <section>
            <article>
                <div>
                    <label htmlFor='pictures'>Photos <span>*</span></label>
                    <input type="file" accept='image/*' id='pictures' className="hidden"
                        name="pictures" onChange={(e) => handleFile(e)} multiple />
                </div>
            </article>
        </section>
    )
}

export default PhotoUpload