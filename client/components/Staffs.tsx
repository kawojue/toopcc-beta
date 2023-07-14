/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Link from 'next/link'
import { useEffect, FC } from 'react'
import axios from '@/app/api/instance'
import { SpinnerTwo } from './Spinner'
import useToken from '@/hooks/useToken'
import throwError from '@/utils/throwError'
import { useAuthStore } from '@/utils/store'
import { Disclosure } from '@headlessui/react'
import { AxiosResponse, AxiosError } from 'axios'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

const Staffs: FC = () => {
    const token: string = useToken()
    const {
        staffs, setStaffs,
        loading, setLoading
    } = useAuthStore()

    const handleStaffs = async (): Promise<void> => {
        setLoading(true)
        await axios.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: AxiosResponse) => setStaffs(res.data?.names))
            .catch((err: AxiosError) => throwError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (token) (async () => await handleStaffs())()
    }, [token])

    if (loading) {
        return <SpinnerTwo />
    }

    return (
        <div className="mx-auto w-full rounded-2xl bg-white p-2">
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button className="disclosure-btn md:text-xl">
                            <span>List of Staffs</span>
                            <ChevronUpIcon
                                className={`${open ? 'rotate-180 transform' : ''
                                    } h-5 w-5 text-clr-2`}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className="disclosure-panel">
                            <article className="staff-lists">
                                {staffs?.map((staff: any, index: number) => (
                                    <Link href={`/staff/profile/${staff.username}`}
                                        key={index} target='_blank' className='staff-url md:text-[1.125rem]'>
                                        {index + 1} - {staff.fullname}
                                    </Link>
                                ))}
                            </article>
                            <p className="total-staffs">
                                Total Staffs: {staffs?.length}
                            </p>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    )
}

export default Staffs