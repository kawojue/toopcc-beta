/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Link from 'next/link'
import { useEffect, FC } from 'react'
import axios from '@/app/api/instance'
import { SpinnerTwo } from './Spinner'
import useToken from '@/hooks/useToken'
import throwError from '@/utils/throwError'
import { Disclosure } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

const Staffs: FC = () => {
    const token: string = useToken()
    const { isLoading, refetch, data } = useQuery({
        queryKey: ['staffs_list'],
        queryFn: async () => {
            return await axios.get('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res: AxiosResponse) => {
                return res.data?.names
            }).catch((err: AxiosError) => throwError(err))
        },
        enabled: false
    })

    useEffect(() => {
        if (token) refetch()
    }, [token])

    if (isLoading) return <SpinnerTwo />

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
                                {data?.map((staff: any, index: number) => (
                                    <Link href={`/staff/profile/${staff.username}`}
                                        key={index} target='_blank' className='staff-url md:text-[1.125rem]'>
                                        {index + 1} - {staff.fullname}
                                    </Link>
                                ))}
                            </article>
                            <p className="total-staffs">
                                Total Staffs: {data?.length}
                            </p>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    )
}

export default Staffs