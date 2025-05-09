import Header from '@/components/header'
import { ReactNode } from 'react'

const AuthLayout = ({children} : {children : ReactNode}) => {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/banner.webp')" }}>
        <Header />
        <div className="backdrop-blur-sm min-h-screen bg-white/30 p-10 md:p-18">
            {children}
        </div>
    </div>
  )
}

export default AuthLayout