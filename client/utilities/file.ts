import notify from "@/utilities/notify"

const checkFile = (file: any): boolean => {
    if (!file) return false
    const maxSize: number = 3072 // 3MB
    const { name, size }: any = file
    const allowedFormats: string[] = ['jpg', 'png']
    const split: string[] = name.split('.')
    const extension: string = split[split.length - 1]
    if (allowedFormats.includes(extension) && size <= maxSize) {
        return true
    }
    return false
}

const handleFile = (e: any): void => {
    const file: any = e.target.files[0]
    if (checkFile(file)) {
        convertFile(file)
    } else {
        notify('error', "File size or format is not allowed.")
    }
}

const convertFile = (file: any): string => {
    const reader: FileReader = new FileReader()
    let converted: string = ""
    reader.readAsDataURL(file)
    reader.onload = () => {
        converted = reader.result as string
    }
    return converted
}

export { convertFile, checkFile, handleFile }