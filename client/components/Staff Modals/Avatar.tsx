/* eslint-disable @next/next/no-img-element */
"use client"
import {
    AiOutlineCloudUpload,
    FaTimes, RiDeleteBin6Line,
} from '@/public/icons/ico'
import Image from 'next/image'
import blob from '@/utils/file'
import notify from '@/utils/notify'
import axios from '@/app/api/instance'
import useToken from '@/hooks/useToken'
import { SpinnerOne } from '../Spinner'
import throwError from '@/utils/throwError'
import { useAuthStore } from '@/utils/store'
import { Fragment, FC, ChangeEvent } from 'react'
import { AxiosResponse, AxiosError } from 'axios'
import { Dialog, Transition } from '@headlessui/react'


const AvatarModal: FC<IModal> = ({ state, dispatch, profile }) => {
    const token: string = useToken()
    const {
        loading, avatar, setAvatarPreview,
        avatarPreview, resetStates, setAvatar,
        setLoading
    } = useAuthStore()

    const eligible: boolean = Boolean(avatar)

    const cancel = () => {
        resetStates()
        dispatch({ type: "AVATAR" })
    }

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        blob(e, setAvatarPreview)
        setAvatar(e.target.files![0])
    }

    const delAvatar = async (): Promise<void> => {
        await axios.delete('/auth/avatar', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: AxiosResponse) => {
            resetStates()
            notify("success", res.data?.msg)
            dispatch({ type: "AVATAR" })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: AxiosError) => throwError(err))
    }

    const changeAvatar = async (): Promise<void> => {
        setLoading(true)
        const formData: FormData = new FormData()
        formData.append('avatar', avatar)
        await axios.post(
            '/auth/avatar',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then((res: AxiosResponse) => {
            resetStates()
            notify("success", res.data?.msg)
            dispatch({ type: "AVATAR" })
            setTimeout(() => {
                document.location.reload()
            }, 300)
        }).catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

    return (
        <Transition appear show={state.avatar} as={Fragment}>
            <Dialog as="div" className="modal"
                onClose={() => dispatch({ type: "AVATAR" })}>
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
                                            onClick={() => dispatch({ type: "AVATAR" })}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <h3 className="modal-header">Change photo</h3>
                                </article>
                                <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                                    <div className='profile-avatar md:w-[12rem] md:h-[12rem] mx-auto'>
                                        {avatarPreview ?
                                            <img src={avatarPreview} alt="avatar" /> :
                                            <>
                                                {profile?.avatar?.url ?
                                                    <Image src={profile?.avatar?.url}
                                                        width={300} height={300} alt="avatar" loading='lazy' /> :
                                                    <Image src="https://res.cloudinary.com/kawojue/image/upload/v1685607626/TOOPCC/Staffs/avatar_ndluis.webp"
                                                        width={300} height={300} alt="avatar" loading='lazy' />
                                                }
                                            </>
                                        }
                                    </div>
                                    <input type="file" accept="image/*" id="avatar"
                                        onChange={(e) => handleFile(e)} className="hidden" />
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