import notify from "@/utils/notify"

const checkFile = (file: any): boolean => {
    if (!file) return false
    const maxSize: number = 5242880 // 5MB
    const { name, size }: any = file
    const allowedFormats: string[] = ['jpg', 'png']
    const split: string[] = name.split('.')
    const extension: string = split[split.length - 1]
    if (allowedFormats.includes(extension) && size <= maxSize) {
        return true
    }
    return false
}

const blob = (e: any, set: (get: string) => void): void => {
    const file: any = e.target.files[0]
    const reader: FileReader = new FileReader()
    if (checkFile(file)) {
        reader.readAsDataURL(file)
        reader.onload = () => {
            set(reader.result as string)
        }
    } else {
        notify('error', "File size or format is not allowed.")
    }
}

export default blob