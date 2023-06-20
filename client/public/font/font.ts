import {
    Questrial, Inter,
    Lato, Catamaran,
} from 'next/font/google'

const questrial = Questrial({
    weight: '400',
    subsets: ['latin']
})

const inter = Inter({
    weight: '400',
    subsets: ['latin']
})

const lato = Lato({
    weight: '400',
    subsets: ['latin']
})

const catamaran = Catamaran({
    weight: ['400', '500', '600'],
    subsets: ['latin']
})

export {
    questrial, inter,
    lato, catamaran
}