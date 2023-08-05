/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import notify from '@/utils/notify'
import { parseISO } from 'date-fns'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import { FormEvent, useRef } from 'react'
import throwError from '@/utils/throwError'
import { useDiagnosis } from '@/utils/store'
import TextEditor from '@/components/TextEditor'
import { AxiosError, AxiosResponse } from 'axios'
import PhotoUpload from '@/components/PhotoUpload'

const page = ({ params: { patientId } }: IPt) => {
    const token: string = useToken()
    const {
        currentDate, setCurrentDate,
        nextAppDate, setNextAppDate,
        loading, setLoading, pictures,
    } = useDiagnosis()
    const textEditorRef = useRef<HTMLDivElement>(null)

    function formatDate(date: string): string {
        return date ? parseISO(date).toISOString() : ''
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (!textEditorRef.current) return

        const payload = {
            pictures,
            texts: textEditorRef.current.innerHTML,
            next_app: formatDate(nextAppDate),
            date: formatDate(currentDate)
        }

        const formData: FormData = new FormData()
        for (const key in payload) {
            const value = payload[key as keyof typeof payload]
            formData.append(key, value as string | Blob)
        }

        await axios.post(
            `/patients/diagnosis/${patientId}`, formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res: AxiosResponse) => notify("success", res.data?.msg))
            .catch((err: AxiosError) => throwError(err))
            .finally(() => setLoading(false))
    }

    return (
        <form onSubmit={async (e) => await handleSubmit(e)}
            className="">
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
            <div className="w-full">
                <button type='submit' onClick={handleSubmit}
                    className="px-2 py-1 bg-clr-4 text-clr-0 hover:bg-clr-1 hover:text-clr-9 rounded-lg tracking-widest font-semibold text-xl w-full">
                    Save
                </button>
            </div>
        </form>
    )
}

export default page