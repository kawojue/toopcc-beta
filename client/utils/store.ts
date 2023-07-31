import { create } from 'zustand'

const useTextEditor = create<TextEditorState>()((set) => ({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    setIsBold: (isBold: boolean) => set({ isBold }),
    setIsItalic: (isItalic: boolean) => set({ isItalic }),
    setIsUnderline: (isUnderline: boolean) => set({ isUnderline }),
}))

const useDiagnosis = create<DiagnosisState>()((set) => ({
    photoArray: [],
    currentDate: '',
    nextAppDate: '',
    isLoading: false,
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
    staffs: [],
    auth: false,
    profile: {},
    loading: false,
    pswdBtn: false,
    ...initialStore,
    resetStates: () => set(initialStore),
    setOTP: (otp: string) => set({ otp }),
    setUser: (user: string) => set({ user }),
    setPswd: (pswd: string) => set({ pswd }),
    setAuth: (auth: boolean) => set({ auth }),
    setPswd2: (pswd2: string) => set({ pswd2 }),
    setToken: (token: string) => set({ token }),
    setEmail: (email: string) => set({ email }),
    setStaffs: (staffs: any[]) => set({ staffs }),
    setUserId: (userId: string) => set({ userId }),
    setAvatar: (avatar: string) => set({ avatar }),
    setPswdBtn: (pswdBtn: boolean) => set({ pswdBtn }),
    setLoading: (loading: boolean) => set({ loading }),
    setFullname: (fullname: string) => set({ fullname }),
    setVerified: (verified: boolean) => set({ verified }),
    setCurrentPswd: (currentPswd: string) => set({ currentPswd }),
}))

const usePatientStore = create<PatientStore>()((set) => ({
    search: '',
    btnLoad: false,
    setSearch: (search: string) => set({ search }),
    setBtnLoad: (btnLoad: boolean) => set({ btnLoad }),
}))

export {
    useAuthStore, usePatientStore,
    useTextEditor, useDiagnosis, usePhoto,
}