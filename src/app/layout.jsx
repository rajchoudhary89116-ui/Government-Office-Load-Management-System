import './globals.css'
import Layout from '../components/Layout'

export const metadata = {
  title: 'SmartGov',
  description: 'Smart Government Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}
