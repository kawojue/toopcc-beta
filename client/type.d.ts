interface IPswdButton {
    get: boolean
    set: (x: boolean) => void
}

interface ISubmitBtn {
    loading?: boolean
    texts: string
    styles?: string
    handler: () => Promise<void>
}

interface JWT {
    roles: string[]
    user: string
}

interface IProfile { params: { profile: string } }

interface IPt { params: { patientId: string } }

interface ModalStates {
    roles: boolean
    avatar: boolean
    username: boolean
    fullname: boolean
    password: boolean
    resignation: boolean
}

interface IModal {
    profile?: any
    state: ModalStates
    dispatch: (obj: ModalActions) => void
}

interface PatientStates {
    sex: string
    date: string
    age: string
    dead: string
    cardNo: string
    card_no: string
    address: string
    fullname: string
    phone_no: string
    deathDate: string
}

interface IComponent {
    get?: any
    set: (get: any) => void
    options?: string[]
}

interface IPatient {
    state: PatientStates
    dispatch: (obj: PatientActions) => void
}

interface TextEditorState {
    isCopy: boolean
    isBold: boolean
    isItalic: boolean
    isUnderline: boolean
    setIsCopy: (isCopy: boolean) => void
    setIsBold: (isBold: boolean) => void
    setIsItalic: (isItalic: boolean) => void
    setIsUnderline: (isUnderline: boolean) => void
}

interface DiagnosisState {
    isLoading: boolean
    picsArray: string[]
    currentDate: string
    nextAppDate: string
    setIsLoading: (isLoading: boolean) => void
    setPicsArray: (picsArray: string[]) => void
    setCurrentDate: (currentDate: string) => void
    setNextAppDate: (nextAppDate: string) => void
}

type ModalActions =
    | { type: 'RESIG' }
    | { type: 'PSWD' }
    | { type: 'ROLES' }
    | { type: 'USERNAME' }
    | { type: 'FULLNAME' }
    | { type: 'AVATAR' }

type PatientActions =
    | { type: 'RESET' }
    | { type: 'PHN'; payload: string }
    | { type: 'SEX'; payload: string }
    | { type: 'AGE'; payload: string }
    | { type: 'DEAD'; payload: string }
    | { type: 'ADDR'; payload: string }
    | { type: 'DATE'; payload: string }
    | { type: 'FULLN'; payload: string }
    | { type: 'CARDNO'; payload: string }
    | { type: 'CARD_NO'; payload: string }
    | { type: 'DEATH_D'; payload: string }