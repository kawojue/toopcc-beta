"use client"
import useAuth from './useAuth'
import { createContext, useContext, useEffect, useState, useRef } from 'react'

const Patient = createContext({})

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, auth }: any = useAuth()

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