import {
    Questrial, Inter,
    Exo_2, Catamaran,
} from 'next/font/google'

const questrial = Questrial({
    weight: '400',
    subsets: ['latin']
})

const inter = Inter({
    weight: '400',
    subsets: ['latin']
})

const exo_2 = Exo_2({
    weight: ['400', '500', '600'],
    subsets: ['latin']
})

const catamaran = Catamaran({
    weight: ['400', '500', '600'],
    subsets: ['latin']
})

export {
    questrial, inter,
    exo_2, catamaran
}