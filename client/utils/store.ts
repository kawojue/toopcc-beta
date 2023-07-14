import { create } from 'zustand'

const useTextEditor = create<TextEditorState>()((set) => ({
    isCopy: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    setIsCopy: (isCopy: boolean) => set({ isCopy }),
    setIsBold: (isBold: boolean) => set({ isBold }),
    setIsItalic: (isItalic: boolean) => set({ isItalic }),
    setIsUnderline: (isUnderline: boolean) => set({ isUnderline }),
}))

const useDiagnosis = create<DiagnosisState>()((set) => ({
    isLoading: false,
    photoArray: [],
    currentDate: '',
    nextAppDate: '',
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setPhotoArray: (photoArray: string[]) => set({ photoArray }),
    setCurrentDate: (currentDate: string) => set({ currentDate }),
    setNextAppDate: (nextAppDate: string) => set({ nextAppDate })
}))

const usePhoto = create<PhotoState>()((set) => ({
    photo1: '',
    photo2: '',
    photo3: '',
    setPhoto1: (photo1: string) => set({ photo1 }),
    setPhoto2: (photo2: string) => set({ photo2 }),
    setPhoto3: (photo3: string) => set({ photo3 }),
}))

const initialStore = {
    otp: '',
    user: '',
    pswd: '',
    pswd2: '',
    email: '',
    avatar: '',
    userId: '',
    fullname: '',
    currentPswd: '',
    verified: false
}

const useAuthStore = create<AuthStore>()((set) => ({
    token: '',
    auth: false,
    profile: {},
    loading: false,
    loadProf: false,
    ...initialStore,
    resetStates: () => set(initialStore),
    setOTP: (otp: string) => set({ otp }),
    setUser: (user: string) => set({ user }),
    setPswd: (pswd: string) => set({ pswd }),
    setAuth: (auth: boolean) => set({ auth }),
    setPswd2: (pswd2: string) => set({ pswd2 }),
    setToken: (token: string) => set({ token }),
    setEmail: (email: string) => set({ email }),
    setProfile: (profile: any) => set({ profile }),
    setUserId: (userId: string) => set({ userId }),
    setAvatar: (avatar: string) => set({ avatar }),
    setLoading: (loading: boolean) => set({ loading }),
    setFullname: (fullname: string) => set({ fullname }),
    setLoadProf: (loadProf: boolean) => set({ loadProf }),
    setVerified: (verified: boolean) => set({ verified }),
    setCurrentPswd: (currentPswd: string) => set({ currentPswd }),
}))

const usePatientStore = create<PatientStore>()((set) => ({
    patient: {},
    patients: [],
    btnLoad: false,
    loading: false,
    setPatient: (patient: any) => set({ patient }),
    setLoading: (loading: boolean) => set({ loading }),
    setBtnLoad: (btnLoad: boolean) => set({ btnLoad }),
    setPatients: (patients: any[]) => set({ patients }),
}))

export {
    useAuthStore, usePatientStore,
    useTextEditor, useDiagnosis, usePhoto,
}