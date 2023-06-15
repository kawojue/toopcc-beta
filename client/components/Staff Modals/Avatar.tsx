/* eslint-disable @next/next/no-img-element */
"use client"
import {
    AiOutlineCloudUpload,
    FaTimes, RiDeleteBin6Line,
} from '@/public/icons/ico'
import Image from 'next/image'
import { Fragment } from 'react'
import useAuth from '@/hooks/useAuth'
import { SpinnerOne } from '../Spinner'
import { handleFile } from '@/utils/file'
import { Dialog, Transition } from '@headlessui/react'


const AvatarModal: React.FC<IModal> = ({ state, dispatch, profile }) => {
    const {
        loading, avatar, changeAvatar, delAvatar,
        setAvatar, setStatesToDefault
    }: any = useAuth()

    const eligible: boolean = Boolean(avatar)

    const cancel = () => {
        setStatesToDefault()
        dispatch({ type: "AVATAR", toggle: false })
    }

    return (
        <Transition appear show={state.avatar} as={Fragment}>
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
                        <Dialog.Panel className="modal-panel min-h-[180px]">
                            <article className="flex items-center">
                                <div className="w-fit">
                                    <button
                                    type="button"
                                    className="modal-close-btn"
                                    onClick={() => dispatch({ type: "AVATAR", toggle: false })}>
                                        <FaTimes />
                                    </button>
                                </div>
                                <h3 className="modal-header">Change photo</h3>
                            </article>
                            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                                <div className='profile-avatar md:w-[12rem] md:h-[12rem] mx-auto'>
                                    {avatar ?
                                    <img src={avatar} alt="avatar" /> :
                                    <>
                                        {profile?.avatar?.secure_url ?
                                            <Image src={profile?.avatar?.secure_url}
                                            width={300} height={300} alt="avatar" priority /> :
                                            <Image src="https://res.cloudinary.com/kawojue/image/upload/v1685607626/TOOPCC/Staffs/avatar_ndluis.webp"
                                            width={300} height={300} alt="avatar" priority />
                                        }
                                    </>
                                    }
                                </div>
                                <input type="file" accept="image/*" id="avatar"
                                onChange={(e) => handleFile(e, setAvatar)} className="hidden" />
                                <article className="profile-avatar-btn">
                                    <label htmlFor='avatar' className="change-avatar">
                                        <AiOutlineCloudUpload />
                                        <span>Change photo</span>
                                    </label>
                                    <button type='button' className="del-avatar"
                                    onClick={async () => await delAvatar()}>
                                        <RiDeleteBin6Line />
                                        <span>Remove photo</span>
                                    </button>
                                </article>
                            </form>
                            <div className="modal-btn-container">
                                <button className="save-btn" disabled={!eligible}
                                type="submit" onClick={async () => await changeAvatar()}>
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

export default AvatarModal