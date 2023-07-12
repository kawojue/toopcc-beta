"use client"
import useToken from './useToken'
import notify from '@/utils/notify'
import axios from '@/app/api/instance'
import {
    createContext, useState, useRef,
    useContext, useReducer, Context
} from 'react'
import { useRouter } from 'next/navigation'
import throwError from '@/utils/throwError'
import formatCardNo from '@/utils/formatCardNo'
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

    const [pic1, setPic1] = useState<string>('')
    const [pic2, setPic2] = useState<string>('')
    const [pic3, setPic3] = useState<string>('')

    const [patient, setPatient] = useState({})
    const [patients, setPatients] = useState<any[]>([])
    const [btnLoad, setBtnLoad] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [state, dispatch] = useReducer(patientReducer, initialStates)

    const getAllPatients = async (token: string) => {
        setLoading(true)
        await axios.get(`/api/patients`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res: any) => {
            const pts: any[] = res.data?.patients || []
            const formattedPatients = pts.map((pt: any) => {
                return formatCardNo(pt)
            })
            setPatients(formattedPatients)
        }).catch((err: any) => {
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
        ).then((res: any) => setPatient(formatCardNo(res.data.patient)))
            .catch((err: any) => throwError(err)).finally(() => setLoading(false))
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
            state, dispatch, handlePatient, patient, loading,
            handleDelPatient, btnLoad, getAllPatients, patients,
            pic1, setPic1, pic2, setPic2, pic3, setPic3
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