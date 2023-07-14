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

export { useTextEditor, useDiagnosis, usePhoto }