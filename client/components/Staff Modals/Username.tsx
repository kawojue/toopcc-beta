"use client"
import { Fragment, FC } from 'react'
import useAuth from '@/hooks/useAuth'
import { SpinnerOne } from '../Spinner'
import { useAuthStore } from '@/utils/store'
import { FaTimes } from '@/public/icons/ico'
import { Dialog, Transition } from '@headlessui/react'


const UsernameModal: FC<IModal> = ({ state, dispatch, profile }) => {
    const { handleUsername }: any = useAuth()
    const { user, setUser, loading } = useAuthStore()

    const eligible: boolean = Boolean(profile?.user !== user) && Boolean(user)

    const cancel = () => {
        setUser("")
        dispatch({ type: "USERNAME" })
    }

    return (
        <Transition appear show={state.username} as={Fragment}>
            <Dialog as="div" className="modal"
                onClose={() => dispatch({ type: "USERNAME" })}>
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
                                    <div className="w-fit">
                                        <button className="modal-close-btn"
                                            onClick={() => dispatch({ type: "USERNAME" })}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <h3 className="modal-header">Edit Username</h3>
                                </article>
                                <form className="modal-form" onSubmit={async (e: any) => {
                                    e.preventDefault();
                                    (async () => await handleUsername())()
                                }}>
                                    <article className="modal-form-group">
                                        <label htmlFor='username'>Username</label>
                                        <input type="text" id="username" placeholder={profile?.user}
                                            value={user} onChange={e => setUser(e.target.value)} />
                                    </article>
                                </form>
                                <div className="modal-btn-container">
                                    <button className="save-btn" disabled={!eligible}
                                        onClick={async () => await handleUsername()}>
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

export default UsernameModal