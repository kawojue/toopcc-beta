"use client"
import { Fragment } from 'react'
import useAuth from '@/hooks/useAuth'
import { SpinnerOne } from './Spinner'
import { FaTimes } from '@/public/icons/ico'
import { Dialog, Transition } from '@headlessui/react'


const UsernameModal: React.FC<IModal> = ({ state, dispatch, profile }) => {
    const { user, setUser, handleUsername, loading }: any = useAuth()

    const eligible: boolean = Boolean(profile?.user !== user ) && Boolean(user)

    return (
        <Transition appear show={state.username} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" onClose={() => dispatch({ type: "USERNAME", toggle: false })}>
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

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="flex flex-col w-full min-h-[180px] max-w-md transform overflow-hidden rounded-2xl bg-white px-5 pb-0.5 pt-2 text-left align-middle shadow-xl transition-all gap-2">
                            <h3 className="modal-header">Edit Username</h3>
                            <form className="modal-form">
                                <article className="modal-form-group">
                                    <label htmlFor='username'>Username</label>
                                    <input type="text" id="username" placeholder={profile?.user}
                                    value={user} onChange={e => setUser(e.target.value)} /> 
                                </article>
                            </form>
                            <div className="modal-btn-container">
                                <button className="save-btn" disabled={!eligible}
                                onClick={async () => await handleUsername()}>
                                    {loading ? <SpinnerOne/> : 'Save'}
                                </button>
                                <button className="cancel-btn"
                                onClick={() => dispatch({ type: "USERNAME", toggle: false })}>
                                    Cancel
                                </button>
                            </div>
                            <div className="mt-4">
                                <button
                                type="button"
                                className="absolute top-2 right-3 text-2xl justify-center rounded-md border border-transparent bg-clr-1 px-3 py-1.5 font-medium text-clr-0 hover:bg-clr-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-clr-4 focus-visible:ring-offset-2"
                                onClick={() => dispatch({ type: "USERNAME", toggle: false })}>
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

export default UsernameModal