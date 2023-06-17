"use client"
import { parseISO } from 'date-fns'
import notify from '@/utils/notify'
import SwitchBtn from '../SwitchBtn'
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'
import { SpinnerOne } from '../Spinner'
import throwError from '@/utils/throwError'
import { FaTimes } from '@/public/icons/ico'
import { FormEvent, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const ResignModal: React.FC<IModal> = ({ state, dispatch, profile }) => {
    const { token }: any = useAuth()
    const [date, setDate] = useState<any>("")
    const [loading, setLoading]= useState<boolean>(false)
    const [resig, setResig] = useState<boolean>(profile.resigned?.resign ? true: false)

    const handleResignation = async (): Promise<void> => {
        setLoading(true)
        await axios.post(
            `/auth/role/resign/${profile?.user}`,
            JSON.stringify({ resign: resig, date: date ? parseISO(date).toISOString() : "" }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => {
            notify(res.data?.action, "Successful.")
            dispatch({ type: "RESIG" })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: any) => throwError(err)).finally(() => setLoading(false))
    }

    const cancel = () => {
        setDate(null)
        setResig(profile.resigned?.resign)
        dispatch({ type: "RESIG" })
    }

    const eligible: boolean = Boolean(profile.resigned?.resign !== resig) || Boolean(date !== null)

    return (
        <Transition appear show={state.resignation} as={Fragment}>
            <Dialog as="div" className="modal"
            onClose={() => dispatch({ type: "RESIG" })}>
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
                        <Dialog.Panel className="modal-panel min-h-[200px]">
                            <article className="flex items-center">
                                <div className="w-fit">
                                    <button className="modal-close-btn"
                                    onClick={() => dispatch({ type: "RESIG" })}>
                                        <FaTimes />
                                    </button>
                                </div>
                                <h3 className="modal-header">Edit Resignation</h3>
                            </article>
                            <form className="modal-form" onSubmit={async (e: any) => {
                                e.preventDefault();
                                (async () => await handleResignation())()
                            }}>
                                <form className="modal-form" onSubmit={(e: FormEvent) => {
                                    e.preventDefault();
                                    (async () => await handleResignation())()
                                }}>
                                    <SwitchBtn get={resig} set={setResig} />
                                    <article className="modal-form-group">
                                        <label htmlFor='date' />
                                        <input type='date' id='date' value={date}
                                        onChange={(e) => setDate(e.target.value)}/>
                                    </article>
                                </form>
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
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
    )
}

export default ResignModal