export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Georgia, serif', margin: 24 }}>{children}</body>
    </html>
  )
}
