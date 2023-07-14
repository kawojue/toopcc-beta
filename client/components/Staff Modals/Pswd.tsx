"use client"
import { Fragment, FC } from 'react'
import useAuth from '@/hooks/useAuth'
import { SpinnerOne } from '../Spinner'
import { FaTimes } from '@/public/icons/ico'
import { useAuthStore } from '@/utils/store'
import { Dialog, Transition } from '@headlessui/react'


const PswdModal: FC<IModal> = ({ state, dispatch }) => {
    const { handleEditPswd }: any = useAuth()
    const {
        setPswd2, setCurrentPswd, pswd, setPswd,
        resetStates, loading, pswd2, currentPswd,
    } = useAuthStore()

    const eligible: boolean = Boolean(currentPswd) && Boolean(pswd) && Boolean(pswd2)

    const cancel = (): void => {
        resetStates()
        dispatch({ type: "PSWD" })
    }

    return (
        <Transition appear show={state.password} as={Fragment}>
            <Dialog as="div" className="modal"
                onClose={() => dispatch({ type: "PSWD" })}>
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
                                            onClick={() => dispatch({ type: "PSWD" })}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <h3 className="modal-header">Edit Password</h3>
                                </article>
                                {/* <section> */}
                                <form className="modal-form" onSubmit={async (e: any) => {
                                    e.preventDefault();
                                    (async () => await handleEditPswd())()
                                }}>
                                    <article className="modal-form-group">
                                        <label htmlFor='current-pswd'>Current Password</label>
                                        <input type="password" id="current-pswd" value={currentPswd}
                                            onChange={e => setCurrentPswd(e.target.value)} />
                                    </article>
                                    <article className="modal-form-group">
                                        <label htmlFor='pswd'>New Password</label>
                                        <input type="password" id="pswd" value={pswd}
                                            onChange={e => setPswd(e.target.value)} />
                                    </article>
                                    <article className="modal-form-group mb-14">
                                        <label htmlFor='pswd2'>Confirm Password</label>
                                        <input type="password" id="pswd2" value={pswd2}
                                            onChange={e => setPswd2(e.target.value)} />
                                    </article>
                                </form>
                                <div className="modal-btn-container">
                                    <button className="save-btn" disabled={!eligible}
                                        type="submit" onClick={async () => await handleEditPswd()}>
                                        {loading ? <SpinnerOne /> : 'Save'}
                                    </button>
                                    <button className="cancel-btn"
                                        onClick={() => cancel()}>
                                        Cancel
                                    </button>
                                </div>
                                {/* </section> */}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default PswdModal