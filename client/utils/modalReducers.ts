const modalReducer = (state: ModalStates, action: ModalActions) => {
    switch(action.type) {
        case "RESIG": {
            return { ...state, resignation: !state.resignation }
        }
        case "PSWD": {
            return { ...state, password: !state.password }
        }
        case "ROLES": {
            return { ...state, roles: !state.roles }
        }
        case "USERNAME": {
            return { ...state, username: !state.username }
        }
        case "FULLNAME": {
            return { ...state, fullname: !state.fullname }
        }
        case "AVATAR": {
            return { ...state, avatar: !state.avatar }
        }

        default: {
            return state
        }
    }
}

export default modalReducer