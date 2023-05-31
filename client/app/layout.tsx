import './globals.css'
import { Toaster } from "react-hot-toast"
import { AuthProvider } from '@/hooks/useAuth'

export const metadata = {
  title: 'TOOPCC',
  description: 'Thani-Oladunjoye Old People Care Centre',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toaster
        position="top-center"
        reverseOrder={false} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
