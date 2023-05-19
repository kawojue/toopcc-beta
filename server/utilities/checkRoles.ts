export default function checkRoles(authRoles: string[], roles: string[]): boolean{
    if (!authRoles || !roles) {
        return false
    }

    const check: boolean[] = roles.map((role: string) => authRoles.includes(role))
    if (check.length === roles.length) {
        return true
    }
    return false
}