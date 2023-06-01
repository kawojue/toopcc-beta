import { Toaster } from "react-hot-toast"

export const metadata = {
    title: 'Patients',
    description: 'Patients Data (TOOPCC)',
}

export default function RootLayout({
    children,
    }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Toaster
            position="top-center"
            reverseOrder={false} />
            {children}
        </>
    )
}
