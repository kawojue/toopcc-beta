export default function checkRoles(authRoles: string[], roles: string[]): boolean {
    if (!authRoles || !roles) {
        return false
    }

    const result: any = roles.map((role: string) => authRoles.includes(role)).find((value: boolean) => value === true)
    if (!result) {
        return false
    }

    return true
}