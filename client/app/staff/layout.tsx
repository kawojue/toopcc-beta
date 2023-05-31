import { Toaster } from "react-hot-toast"
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
        <main className="staff-main">
            <Toaster
            position="top-center"
            reverseOrder={false}/>
            {children}
        </main>
    )
}