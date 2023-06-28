import { useState, useEffect } from "react"

const useToken  = (): string => {
    const [token, setToken] = useState<string>("")

    useEffect(() => {
        const storedToken: string = JSON.parse(localStorage.getItem('token') as string)
        if (storedToken) setToken(storedToken)
    }, [])

    return token
}

export default useToken