import { questrial } from "@/public/font/font"

export const metadata = {
    title: 'Staff',
    description: 'TOOPCC Staffs',
}

export default function RootLayout({
    children,
    }: {
    children: React.ReactElement
}) {
    return (
        <main className={`staff-main ${questrial.className}`}>
            {children}
        </main>
    )
}