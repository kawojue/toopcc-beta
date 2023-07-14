/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useAuthStore } from '@/utils/store'

const useToken = (): string => {
    const { token, setToken } = useAuthStore()

    useEffect(() => {
        const storedToken: string = JSON.parse(localStorage.getItem('token') as string)
        if (storedToken) setToken(storedToken)
    }, [])

    return token
}

export default useToken