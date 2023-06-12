"use client"
import { Fragment } from 'react'
import useAuth from '@/hooks/useAuth'
import { SpinnerOne } from './Spinner'
import { handleFile } from '@/utils/file'
import { FaTimes } from '@/public/icons/ico'
import { Dialog, Transition } from '@headlessui/react'

const FullnameModal: React.FC<IModal> = ({ state, dispatch, profile }) => {
    const { fullname, setFullname, handleFullname, loading, avatar, setAvatar }: any = useAuth()

    const avatarPbId: string = profile?.avatar?.public_id
    const eligible: boolean = Boolean(profile?.fullname !== fullname ) && Boolean(fullname)

    return (
        <Transition appear show={state?.fullname} as={Fragment}>
            <Dialog as="div" className="modal"
            onClose={() => dispatch({ type: "AVATAR", toggle: false })}>
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
                            <h3 className="modal-header">Edit Profile Picture</h3>
                            <form className="modal-form">
                                <article className="modal-form-group">
                                    <label htmlFor='username'>Fullname</label>
                                    <input type="text" id="username" placeholder={profile?.fullname}
                                    value={fullname} onChange={e => setFullname(e.target.value)} /> 
                                </article>
                                <div className="modal-btn-container">
                                <button className="save-btn" disabled={!eligible}
                                type="submit" onClick={async () => await handleFullname()}>
                                    {loading ? <SpinnerOne/> : 'Save'}
                                </button>
                                <button className="cancel-btn" type="reset"
                                onClick={() => dispatch({ type: "AVATAR", toggle: false })}>
                                    Cancel
                                </button>
                            </div>
                            </form>
                            <div className="mt-4">
                                <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => dispatch({ type: "AVATAR", toggle: false })}>
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

export default FullnameModal