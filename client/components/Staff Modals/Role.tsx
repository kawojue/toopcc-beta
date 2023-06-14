"use client"
import notify from '@/utils/notify'
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'
import { SpinnerOne } from '../Spinner'
import { Fragment, useState } from 'react'
import throwError from '@/utils/throwError'
import { FaTimes } from '@/public/icons/ico'
import CustomDropDown from '../CustomDropDown'
import { Dialog, Transition } from '@headlessui/react'

const RoleModal: React.FC<IModal> = ({ state, dispatch, profile }) => {
    const { token }: any = useAuth()
    const [assLoading, setAssLoading] = useState<boolean>(false)
    const [remLoading, setRemLoading] = useState<boolean>(false)
    const [role, setRole]= useState<{
        label: string, value: string
    }>({
        label: "", value: ""
    })
    const options: string[] = ['HR', "Staff", "Admin"]

    const cancel = () => {
        setRole({ label: "", value: "" })
        dispatch({ type: "ROLES", toggle: false })
    }

    const handler = async (url: string, setLoad: (load: boolean) => void): Promise<void> => {
        setLoad(true)
        await axios.post(
            url,
            JSON.stringify({ role: role.value.toLowerCase() }),
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            },
        ).then((res: any) => {
            notify(res.data?.action, res.data?.msg)
            dispatch({ type: "ROLES", toggle: false })
            setTimeout(() => {
                document.location.reload()
            }, 350);
        }).catch((err: any) => throwError(err)).finally(() => setLoad(false))
    }

    return (
        <Transition appear show={state.roles} as={Fragment}>
            <Dialog as="div" className="modal"
            onClose={() => dispatch({ type: "ROLES", toggle: false })}>
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
                        <Dialog.Panel className="modal-panel min-h-[300px]">
                            <article className="flex items-center">
                                <div className="w-fit">
                                    <button className="modal-close-btn"
                                    onClick={() => dispatch({ type: "ROLES", toggle: false })}>
                                        <FaTimes />
                                    </button>
                                </div>
                                <h3 className="modal-header">Edit Role</h3>
                            </article>
                            <form className="modal-form">
                                <CustomDropDown get={role} set={setRole} options={options} />
                            </form>
                            <div className="modal-btn-container">
                                <button className="save-btn"
                                onClick={async () => await handler(`/auth/role/assign/${profile?.user}`, setAssLoading)}>
                                    {assLoading ? <SpinnerOne /> : 'Assign'}
                                </button>
                                <button className="del-btn"
                                onClick={async () => await handler(`/auth/role/remove/${profile?.user}`, setRemLoading)}>
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