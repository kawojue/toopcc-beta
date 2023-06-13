"use client"
import PickDate from './PickDate'
import SwitchBtn from './SwitchBtn'
import notify from '@/utils/notify'
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'
import { SpinnerOne } from './Spinner'
import { Fragment, useState } from 'react'
import throwError from '@/utils/throwError'
import { FaTimes } from '@/public/icons/ico'
import { Dialog, Transition } from '@headlessui/react'

const ResignationModal: React.FC<IModal> = ({ state, dispatch, profile }) => {
    const { token }: any = useAuth()
    const [loading, setLoading]= useState<boolean>(false)
    const [date, setDate] = useState<any>(null)
    const [resig, setResig] = useState<boolean>(profile.resigned?.resign ? true: false)

    const handleResignation = async (): Promise<void> => {
        setLoading(true)
        await axios.post(
            `/auth/role/resign/${profile?.user}`,
            JSON.stringify({ resign: resig, date: date?.toISOString() }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => {
            notify(res.data?.action, "Successful.")
            dispatch({ type: "RESIG", toggle: false })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const cancel = () => {
        setDate(null)
        setResig(profile.resigned?.resign)
        dispatch({ type: "RESIG", toggle: false })
    }

    const eligible: boolean = Boolean(profile.resigned?.resign !== resig) || Boolean(date !== null)

    return (
        <Transition appear show={state.resignation} as={Fragment}>
            <Dialog as="div" className="modal"
            onClose={() => dispatch({ type: "RESIG", toggle: false })}>
            <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="modal-main">
                <div className="modal-center">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="modal-panel">
                            <h3 className="modal-header">Edit Resignation</h3>
                            <form className="modal-form">
                                <section className="flex flex-col items-center gap-5">
                                    <SwitchBtn get={resig} set={setResig} />
                                    <PickDate get={date} set={setDate} />
                                </section>
                            </form>
                            <div className="modal-btn-container">
                                <button className="save-btn" disabled={!eligible}
                                onClick={async () => await handleResignation()}>
                                    {loading ? <SpinnerOne /> : 'Save'}
                                </button>
                                <button className="cancel-btn"
                                onClick={() => cancel()}>
                                    Cancel
                                </button>
                            </div>
                            <div className="mt-4">
                                <button className="modal-close-btn"
                                onClick={() => dispatch({ type: "RESIG", toggle: false })}>
                                    <FaTimes />
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
    )
}

export default ResignationModal