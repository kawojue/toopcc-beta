import axios from 'axios'

const BASE_URL: unknown = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SERVER_URL:  'http://localhost:1002'

export default axios.create({
    baseURL: BASE_URL as string,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})