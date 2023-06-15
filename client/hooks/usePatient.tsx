"use client"
import useAuth from './useAuth'
import {
    createContext, useState, useRef,
    useContext, useEffect, useReducer
} from 'react'
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
    death: {
        dead: false,
        date: ''
    },
}

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, auth }: any = useAuth()
    const [state, dispatch]= useReducer(patientReducer, initialStates)

    return (
        <Patient.Provider value={{
            token, auth
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