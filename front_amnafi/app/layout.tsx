import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ChatBot from '../components/ChatBot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AMNAFI - La bonne adresse des services',
  description: 'Trouvez les meilleurs prestataires près de chez vous au Sénégal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <ChatBot />
      </body>
    </html>
  )
}