interface JWT {
    roles: string[]
    user: string
}

interface IProfile {
    params: {
        profile: string
    }
}

interface ModalStates {
    roles: boolean
    avatar: boolean
    username: boolean
    fullname: boolean
    password: boolean
    resignation: boolean
}

type ModalActions =
| { type: 'RESIG'; toggle: boolean }
| { type: 'PSWD'; toggle: boolean }
| { type: 'ROLES'; toggle: boolean }
| { type: 'USERNAME'; toggle: boolean }
| { type: 'FULLNAME'; toggle: boolean }
| { type: 'AVATAR'; toggle: boolean }