const modalReducer = (state: ModalStates, action: ModalActions) => {
    switch(action.type) {
        case "RESIG": {
            return { ...state, resignation: action.toggle }
        }
        case "PSWD": {
            return { ...state, password: action.toggle }
        }
        case "ROLES": {
            return { ...state, roles: action.toggle }
        }
        case "USERNAME": {
            return { ...state, username: action.toggle }
        }
        case "FULLNAME": {
            return { ...state, fullname: action.toggle }
        }
        case "AVATAR": {
            return { ...state, avatar: action.toggle }
        }

        default: {
            return state
        }
    }
}

export default modalReducer