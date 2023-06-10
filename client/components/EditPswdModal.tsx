"use client"
import { Fragment } from 'react'
import useAuth from '@/hooks/useAuth'
import { SpinnerOne } from './Spinner'
import { FaTimes } from '@/public/icons/ico'
import { Dialog, Transition } from '@headlessui/react'


const EditPswdModal: React.FC<IModal> = ({ state, dispatch }) => {
    const {
        pswd, setPswd, handleEditPswd, currentPswd,
        loading, pswd2, setPswd2, setCurrentPswd,
    }: any = useAuth()

    const eligible: boolean = Boolean(currentPswd) && Boolean(pswd) && Boolean(pswd2)

    return (
        <Transition appear show={state?.password} as={Fragment}>
            <Dialog as="div" className="modal"
            onClose={() => dispatch({ type: "PSWD", toggle: false })}>
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
                            <h3 className="modal-header">Edit Password</h3>
                            <form className="modal-form">
                                <article className="modal-form-group">
                                    <label htmlFor='current-pswd'>Current Password</label>
                                    <input type="text" id="current-pswd" value={currentPswd}
                                    onChange={e => setCurrentPswd(e.target.value)} /> 
                                </article>
                                <article className="modal-form-group">
                                    <label htmlFor='pswd'>New Password</label>
                                    <input type="text" id="pswd" value={pswd}
                                    onChange={e => setPswd(e.target.value)} /> 
                                </article>
                                <article className="modal-form-group">
                                    <label htmlFor='pswd2'>Confirm Password</label>
                                    <input type="password" id="pswd2" value={pswd2}
                                    onChange={e => setPswd2(e.target.value)} /> 
                                </article>
                                <div className="modal-btn-container">
                                <button className="save-btn" disabled={!eligible}
                                type="submit" onClick={async () => await handleEditPswd()}>
                                    {loading ? <SpinnerOne/> : 'Save'}
                                </button>
                                <button className="cancel-btn"
                                onClick={() => dispatch({ type: "PSWD", toggle: false })}>
                                    Cancel
                                </button>
                            </div>
                            </form>
                            <div className="mt-4">
                                <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => dispatch({ type: "PSWD", toggle: false })}>
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

export default EditPswdModal