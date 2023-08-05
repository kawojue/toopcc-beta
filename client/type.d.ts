interface IPswdButton {
    get: boolean
    set: (x: boolean) => void
}

interface ISubmitBtn {
    loading?: boolean
    texts: string
    styles?: string
    handler?: () => Promise<void>
}

interface JWT { roles: string[]; user: string }

interface IPt { params: { patientId: string } }

interface IProfile { params: { profile: string } }

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
    isBold: boolean
    isItalic: boolean
    isUnderline: boolean
    setIsBold: (isBold: boolean) => void
    setIsItalic: (isItalic: boolean) => void
    setIsUnderline: (isUnderline: boolean) => void
}

interface DiagnosisState {
    pictures: null | FileList
    loading: boolean
    currentDate: string
    nextAppDate: string
    setLoading: (loading: boolean) => void
    setCurrentDate: (currentDate: string) => void
    setNextAppDate: (nextAppDate: string) => void
    setPictures: (pictures: null | FileList) => void
}

interface AuthStore {
    otp: string
    user: string
    pswd: string
    auth: boolean
    token: string
    pswd2: string
    email: string
    userId: string
    avatar: any
    loading: boolean
    pswdBtn: boolean
    fullname: string
    verified: boolean
    currentPswd: string
    avatarPreview: string
    resetStates: () => void
    setOTP: (otp: string) => void
    setUser: (user: string) => void
    setPswd: (pswd: string) => void
    setAuth: (auth: boolean) => void
    setAvatar: (avatar: any) => void
    setToken: (token: string) => void
    setPswd2: (pswd2: string) => void
    setEmail: (email: string) => void
    setUserId: (userId: string) => void
    setPswdBtn: (pswdBtn: boolean) => void
    setLoading: (loading: boolean) => void
    setFullname: (fullname: string) => void
    setVerified: (verified: boolean) => void
    setCurrentPswd: (currentPswd: string) => void
    setAvatarPreview: (avatarPreview: string) => void
}

interface PatientStore {
    search: string
    btnLoad: boolean
    setSearch: (search: string) => void
    setBtnLoad: (btnLoad: boolean) => void
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