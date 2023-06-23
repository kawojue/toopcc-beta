import { questrial } from "@/public/font/font"
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
                <main className={`w-full ${questrial.className}`}>
                    {children}
                </main>
            </PatientProvider>
        </>
    )
}
