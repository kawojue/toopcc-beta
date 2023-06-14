/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'
import { SpinnerTwo } from './Spinner'
import { useState, useEffect } from 'react'
import throwError from '@/utils/throwError'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

const Staffs: React.FC = () => {
    const { token }: any = useAuth()
    const [staffs, setStaffs] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const handleStaffs = async (): Promise<void> => {
        setLoading(true)
        await axios.get('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => setStaffs(res.data?.names))
        .catch((err: any) => throwError(err))
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
                            className={`${
                                open ? 'rotate-180 transform' : ''
                            } h-5 w-5 text-clr-2`}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className="disclosure-panel">
                            {staffs?.map((staff: any, index: number) => (
                                <Link href={`/staff/profile/${staff.username}`}
                                key={index} target='_blank' className='staff-url'>
                                    {staff.fullname}
                                </Link>
                            ))}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    )
}

export default Staffs