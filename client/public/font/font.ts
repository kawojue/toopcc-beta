import {
    Questrial, Inter
} from 'next/font/google'

const questrial = Questrial({
    weight: '400',
    subsets: ['latin']
})

const inter = Inter({
    weight: '400',
    subsets: ['latin']
})

export { questrial, inter }