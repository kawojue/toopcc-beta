import { v4 as uuid } from 'uuid'
import formatName from './full_name'
import lastNextApp from './genNextApp'

function addExtension(extensions: any[], ext: any) {
    const formattedName: string = formatName(ext.name)
    const findByName = extensions.find((extension: any) => extension.name === formattedName)
    if (findByName) return [...extensions]
    const newExtensions: any[] = [
        ...extensions,
        {
            idx: uuid(),
            date: ext?.date,
            name: formattedName,
            occurence: ext?.occurence ? ext?.occurence : 1,
            given: ext?.given === undefined || null ? false : ext?.given
        }
    ]
    return newExtensions
}

function addMedic(recc: any, medics: any[]) {
    return recc?.date ? [
        ...medics,
        {
            idx: uuid(),
            date: recc.date,
            next_app: recc?.next_app ? recc.next_app : lastNextApp(recc.date),
        }
    ] : [...medics]
}

export { addExtension, addMedic }