"use client"
import useToken from './useToken'
import notify from '@/utils/notify'
import axios from '@/app/api/instance'
import {
    createContext, useState, useRef,
    useContext, useEffect, useReducer
} from 'react'
import throwError from '@/utils/throwError'
import formatCardNo from '@/utils/formatCardNo'
import patientReducer from '@/utils/patientReducer'

const Patient = createContext({})

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
    const token: string = useToken()
    const [patient, setPatient] = useState({})
    const [btnLoad, setBtnLoad] = useState<boolean>(false)
    const [profLoad, setProfLoad] = useState<boolean>(false)
    const [state, dispatch]= useReducer(patientReducer, initialStates)

    const handlePatient = async (card_no: string) => {
        setProfLoad(true)
        await axios.get(
            `/api/patients/patient/${card_no}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((res: any) => setPatient(formatCardNo(res.data.patient)))
        .catch((err: any) => throwError(err)).finally(() => setProfLoad(false))
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
        ).then((res: any) => notify(res.data?.action, res.date?.msg))
        .catch((err: any) => throwError(err)).finally(() => setBtnLoad(false))
    }

    return (
        <Patient.Provider value={{
            state, dispatch, handlePatient, patient, profLoad,
            handleDelPatient, btnLoad
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