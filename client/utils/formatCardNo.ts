const formatCardNo = (patient: any): any => {
    if (!patient) return
    
    const { card_no: cardNo, date: ISOStringDate } = patient
    let formattedDate: any
    if (ISOStringDate) {
        const date = new Date(ISOStringDate)
        const year = date.getFullYear()
        formattedDate = `/${String(year).slice(2)}`
    } else {
        formattedDate = ""
    }

    const card_no = cardNo + formattedDate
    return { ...patient, card_no }
}

export default formatCardNo