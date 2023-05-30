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

const convertFile = (file: any, set: any): void => {
    const reader: FileReader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        set(reader.result as string)
    }
}

export { convertFile, checkFile }