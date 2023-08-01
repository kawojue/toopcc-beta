/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import notify from '@/utils/notify'
import { parseISO } from 'date-fns'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import throwError from '@/utils/throwError'
import TextEditor from '@/components/TextEditor'
import { AxiosError, AxiosResponse } from 'axios'
import PhotoUpload from '@/components/PhotoUpload'
import { FormEvent, useRef, useEffect } from 'react'
import { useDiagnosis, usePhoto } from '@/utils/store'

const page = ({ params: { patientId } }: IPt) => {
    const token: string = useToken()
    const { photo1, photo2, photo3 } = usePhoto()
    const {
        isLoading, setIsLoading,
        photoArray, setPhotoArray,
        currentDate, setCurrentDate,
        nextAppDate, setNextAppDate,
    } = useDiagnosis()
    const textEditorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const array: string[] = [photo1, photo2, photo3].filter((arr: string) => arr !== '')
        setPhotoArray(array)
    }, [photo1, photo2, photo3])

    function formatDate(date: string): string {
        return date ? parseISO(date).toISOString() : ''
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        if (!textEditorRef.current) return

        await axios.post(
            `/patients/diagnosis/${patientId}`,
            JSON.stringify({
                images: photoArray, texts: textEditorRef.current.innerHTML,
                next_app: formatDate(nextAppDate), date: formatDate(currentDate)
            }), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res: AxiosResponse) => notify("success", res.data?.msg))
            .catch((err: AxiosError) => throwError(err))
            .finally(() => setIsLoading(false))
    }

    return (
        <form onSubmit={async (e) => await handleSubmit(e)}
            className="form-section">
            <article className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <label>Current Date</label>
                    <input value={currentDate} type="date"
                        onChange={(e) => setCurrentDate(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Next Appointment Date</label>
                    <input value={nextAppDate} type="date"
                        onChange={(e) => setNextAppDate(e.target.value)} />
                </div>
            </article>
            <TextEditor textEditorRef={textEditorRef} />
            <PhotoUpload />
            <button type='submit' onClick={handleSubmit}>
                Submit
            </button>
        </form>
    )
}

export default page