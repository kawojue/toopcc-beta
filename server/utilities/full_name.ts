export default function full_name(fullname: string): string {
    let actualName: string = ""
    const names: any = fullname.split(" ")
    names.forEach((name: string) => {
        actualName += name[0].toUpperCase() + name.slice(1).toLowerCase() + " "
    })

    return actualName.trim()
}