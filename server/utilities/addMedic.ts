import { v4 as uuid } from 'uuid'
import lastNextApp from "./genNextApp"

export default function addMedic(recc: any, medics: any[]) {
    return recc?.date ? [
        ...medics,
        {
            idx: uuid(),
            date: recc.date,
            next_app: recc?.next_app ? recc.next_app : lastNextApp(recc.date),
        }
    ] : [ ...medics ]
}