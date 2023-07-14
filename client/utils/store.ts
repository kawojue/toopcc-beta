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
    picsArray: [],
    currentDate: '',
    nextAppDate: '',
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setPicsArray: (picsArray: string[]) => set({ picsArray }),
    setCurrentDate: (currentDate: string) => set({ currentDate }),
    setNextAppDate: (nextAppDate: string) => set({ nextAppDate })
}))

export { useTextEditor, useDiagnosis }