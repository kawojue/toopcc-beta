/* eslint-disable react-hooks/rules-of-hooks */
import useAuth from '@/hooks/useAuth'
import axios from '@/app/api/instance'

const getAllPatients = async () => {
    let data: any[] = []
    await axios.get(`/api/patients`, {
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
        }
    })
    .then((res: any) => { data = res.data?.patients })
    .catch((err: any) => { data = [] })

    return data
}

export default getAllPatients