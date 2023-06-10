const modalReducer = (state: ModalStates, action: ModalActions) => {
    switch(action.type) {
        case "RESIG": {
            return {
                ...state, resignation: action.toggle
            }
        }
        case "PSWD": {
            return {
                ...state, password: action.toggle
            }
        }
        case "ROLES": {
            return {
                ...state, username: action.toggle
            }
        }
        case "USERNAME": {
            return {
                ...state, roles: action.toggle
            }
        }

        default: {
            return state
        }
    }
}