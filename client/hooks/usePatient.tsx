"use client"
import {
    createContext, Context,
    useContext, useReducer,
} from 'react'
import useToken from './useToken'
import notify from '@/utils/notify'
import axios from '@/app/api/instance'
import { useRouter } from 'next/navigation'
import throwError from '@/utils/throwError'
import { usePatientStore } from '@/utils/store'
import { AxiosError, AxiosResponse } from 'axios'
import patientReducer from '@/utils/patientReducer'

const Patient: Context<{}> = createContext({})

const initialStates: PatientStates = {
    sex: '',
    age: '',
    date: '',
    dead: '',
    cardNo: '',
    card_no: '',
    address: '',
    fullname: '',
    phone_no: '',
    deathDate: '',
}

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter()
    const token: string = useToken()

    const {
        setBtnLoad, setLoading,
        setPatient, setPatients,
    } = usePatientStore()

    const [state, dispatch] = useReducer(patientReducer, initialStates)

    const handleDelPatient = async (card_no: string) => {
        setBtnLoad(true)
        await axios.delete(
            `/patients/patient/${card_no}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: AxiosResponse) => notify(res.data?.action, res.data?.msg))
            .catch((err: AxiosError) => throwError(err)).finally(() => setBtnLoad(false))
    }

    return (
        <Patient.Provider value={{
            state, dispatch, handleDelPatient,
        }}>
            {children}
        </Patient.Provider>
    )
}

const usePatient = (): any => {
    const patient: any = useContext(Patient)
    return patient
}

export default usePatient