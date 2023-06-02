import { Toaster } from "react-hot-toast"
import { PatientProvider } from "@/hooks/usePatient"

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
            <PatientProvider>
                <Toaster
                position="top-center"
                reverseOrder={false} />
                {children}
            </PatientProvider>
        </>
    )
}
