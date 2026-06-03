import { AuthProvider } from '@/contexts/AuthContext'
import LoginSignup from '@/view/LoginPage'

export default function App() {
  return (
    <AuthProvider>
      <LoginSignup />
    </AuthProvider>
  )
}