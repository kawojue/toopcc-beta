import jwt, { Secret } from 'jsonwebtoken'

const genToken = (user: string, roles: string[]) => {
    const token: Secret = jwt.sign(
        { user, roles },
        process.env.JWT_SECRET as string,
        { expiresIn: '90d' }
    )
    return token
}

export default genToken