import axios from '@/app/api/instance'

const getPatient = async (card_no: string, token: string) => {
    let data: any
    await axios.get(`/api/patients/${card_no}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res: any) => { data = res.data?.patient })
    .catch((err: any) => { data = undefined })

    return data
}

export default getPatient