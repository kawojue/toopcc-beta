import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import QueryProvider from '@/components/QueryProvider'

export const metadata = {
  title: 'TOOPCC',
  description: '___',
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
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
