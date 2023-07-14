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
import formatCardNo from '@/utils/formatCardNo'
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

    const getAllPatients = async (token: string) => {
        setLoading(true)
        await axios.get(`/api/patients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: AxiosResponse) => {
            const pts: any[] = res.data?.patients || []
            const formattedPatients = pts.map((pt: any) => {
                return formatCardNo(pt)
            })
            setPatients(formattedPatients)
        }).catch((err: AxiosError) => {
            throwError(err)
            setTimeout(() => {
                router.push('/staff/profile')
            }, 500)
        }).finally(() => setLoading(false))
    }

    const handlePatient = async (card_no: string) => {
        setLoading(true)
        await axios.get(
            `/api/patients/patient/${card_no}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: AxiosResponse) => setPatient(formatCardNo(res.data.patient)))
            .catch((err: AxiosError) => throwError(err)).finally(() => setLoading(false))
    }

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
            state, dispatch, handlePatient,
            handleDelPatient, getAllPatients,
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