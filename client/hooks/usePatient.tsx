"use client"
import useAuth from './useAuth'
import axios from '@/app/api/instance'
import {
    createContext, useState, useRef,
    useContext, useEffect, useReducer
} from 'react'
import throwError from '@/utils/throwError'
import patientReducer from '@/utils/patientReducer'

const Patient = createContext({})

const initialStates: PatientStates = {
    sex: '',
    age: '',
    date: '',
    cardNo: '',
    card_no: '',
    address: '',
    fullname: '',
    phone_no: '',
    deathDate: '',
    dead: null
}

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, auth }: any = useAuth()
    const [patient, setPatient] = useState({})
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
        ).then((res: any) => setPatient(res.data?.patient))
        .catch((err: any) => throwError(err)).finally(() => setProfLoad(false))
    }

    return (
        <Patient.Provider value={{
            token, auth, state, dispatch, handlePatient, patient, profLoad
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