import { ReactNode } from 'react'

const AuthLayout = ({children} : {children : ReactNode}) => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-cover bg-center" style={{ backgroundImage: "url('/banner 2.jpg')" }}>
      <div className="w-full max-w-sm">
            {children}
        </div>
    </div>
  )
}

export default AuthLayout