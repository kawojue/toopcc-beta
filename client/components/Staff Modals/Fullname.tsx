"use client"
import { Fragment } from 'react'
import useAuth from '@/hooks/useAuth'
import { SpinnerOne } from '../Spinner'
import { FaTimes } from '@/public/icons/ico'
import { Dialog, Transition } from '@headlessui/react'

const FullnameModal: React.FC<IModal> = ({ state, dispatch, profile }) => {
    const { fullname, setFullname, handleFullname, loading }: any = useAuth()

    const eligible: boolean = Boolean(profile?.fullname?.toLowerCase() !== fullname.toLowerCase()) && Boolean(fullname)

    const cancel = () => {
        setFullname("")
        dispatch({ type: "FULLNAME" })
    }

    return (
        <Transition appear show={state.fullname} as={Fragment}>
            <Dialog as="div" className="modal"
            onClose={() => dispatch({ type: "FULLNAME" })}>
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
                        <Dialog.Panel className="modal-panel min-h-[180px]">
                            <article className="flex items-center">
                                <div className="mt-4">
                                    <button className="modal-close-btn"
                                    onClick={() => dispatch({ type: "FULLNAME" })}>
                                        <FaTimes />
                                    </button>
                                </div>
                                <h3 className="modal-header">Edit Fullname</h3>
                            </article>
                            <form className="modal-form" onSubmit={async (e: any) => {
                                e.preventDefault();
                                (async () => await handleFullname())()
                            }}>
                                <article className="modal-form-group">
                                    <label htmlFor='username'>Fullname</label>
                                    <input type="text" id="username" placeholder={profile?.fullname}
                                    value={fullname} onChange={e => setFullname(e.target.value)} /> 
                                </article>
                            </form>
                            <div className="modal-btn-container">
                                <button className="save-btn" disabled={!eligible}
                                type="submit" onClick={async () => await handleFullname()}>
                                    {loading ? <SpinnerOne /> : 'Save'}
                                </button>
                                <button className="cancel-btn" type="reset"
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

export default FullnameModal