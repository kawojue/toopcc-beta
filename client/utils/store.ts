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
    pictures: null,
    loading: false,
    currentDate: '',
    nextAppDate: '',
    setPictures: (pictures: null | FileList) => set({ pictures }),
    setLoading: (loading: boolean) => set({ loading }),
    setCurrentDate: (currentDate: string) => set({ currentDate }),
    setNextAppDate: (nextAppDate: string) => set({ nextAppDate })
}))

const initialStore = {
    otp: '',
    user: '',
    pswd: '',
    pswd2: '',
    email: '',
    avatar: {},
    userId: '',
    fullname: '',
    currentPswd: '',
    verified: false,
    avatarPreview: ''
}

const useAuthStore = create<AuthStore>()((set) => ({
    token: '',
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
    setUserId: (userId: string) => set({ userId }),
    setAvatar: (avatar: any) => set({ avatar }),
    setPswdBtn: (pswdBtn: boolean) => set({ pswdBtn }),
    setLoading: (loading: boolean) => set({ loading }),
    setFullname: (fullname: string) => set({ fullname }),
    setVerified: (verified: boolean) => set({ verified }),
    setCurrentPswd: (currentPswd: string) => set({ currentPswd }),
    setAvatarPreview: (avatarPreview: string) => set({ avatarPreview }),
}))

const usePatientStore = create<PatientStore>()((set) => ({
    search: '',
    btnLoad: false,
    setSearch: (search: string) => set({ search }),
    setBtnLoad: (btnLoad: boolean) => set({ btnLoad }),
}))

export {
    useTextEditor, useDiagnosis,
    useAuthStore, usePatientStore,
}