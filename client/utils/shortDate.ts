import { format, parseISO } from "date-fns"

const convertISODate = (ISODate: string): string => {
    let shortDate: string = ""
    try {
        const createdAt: Date = parseISO(ISODate)
        shortDate = format(createdAt, "dd/MM/yyyy")
    } catch {
        shortDate = ""
    }

    return shortDate
}

export default convertISODate