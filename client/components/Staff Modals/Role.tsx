"use client"
import notify from '@/utils/notify'
import axios from '@/app/api/instance'
import { SpinnerOne } from '../Spinner'
import useToken from '@/hooks/useToken'
import throwError from '@/utils/throwError'
import { FaTimes } from '@/public/icons/ico'
import CustomDropDown from '../CustomDropDown'
import { Fragment, useState, FC } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const RoleModal: FC<IModal> = ({ state, dispatch, profile }) => {
    const token: string = useToken()
    const [role, setRole] = useState<string>("")
    const [assLoading, setAssLoading] = useState<boolean>(false)
    const [remLoading, setRemLoading] = useState<boolean>(false)
    const options: string[] = ['HR', "Staff", "Admin"]

    const cancel = () => {
        setRole("")
        dispatch({ type: "ROLES" })
    }

    const handler = async (type: string, setLoad: (load: boolean) => void): Promise<void> => {
        setLoad(true)
        await axios.post(
            `/auth/role/edit/${profile.user}?type=${type}`,
            { role: role.toLowerCase() },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            },
        ).then((res: any) => {
            notify("success", res.data?.msg)
            dispatch({ type: "ROLES" })
            setTimeout(() => {
                document.location.reload()
            }, 350);
        }).catch((err: any) => throwError(err)).finally(() => setLoad(false))
    }

    return (
        <Transition appear show={state.roles} as={Fragment}>
            <Dialog as="div" className="modal"
                onClose={() => dispatch({ type: "ROLES" })}>
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
                                            onClick={() => dispatch({ type: "ROLES" })}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <h3 className="modal-header">Edit Role</h3>
                                </article>
                                <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                                    <article className="modal-form-group">
                                        <CustomDropDown get={role} set={setRole} options={options} />
                                    </article>
                                </form>
                                <div className="modal-btn-container">
                                    <button className="save-btn"
                                        onClick={async () => await handler('assign', setAssLoading)}>
                                        {assLoading ? <SpinnerOne /> : 'Assign'}
                                    </button>
                                    <button className="del-btn"
                                        onClick={async () => await handler('remove', setRemLoading)}>
                                        {remLoading ? <SpinnerOne /> : 'Remove'}
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

export default RoleModal