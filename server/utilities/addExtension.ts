import { v4 as uuid } from 'uuid'
import formatName from "./full_name"

export default function addExtension(extensions: any[], ext: any) {
    const formattedName: string = formatName(ext.name)
    const findByName = extensions.find((extension: any) => extension.name === formattedName)
    if (findByName) return [ ...extensions ]
    const newExtensions: any[] = [
        ...extensions,
        {
            idx: uuid(),
            date: ext?.date,
            name: formattedName,
            occurence: ext?.occurence ? ext?.occurence : 1,
            given: ext?.given === undefined ? false: ext?.given
        }
    ]
    return newExtensions
}