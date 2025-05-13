import FormLogin from "@/components/form-login"
import Image from "next/image"

const Login = () => {
  return (
    <div>
        <Image
          src={'/Logo.png'}
          alt="App Logo"
          width={280}
          height={280}
          className="mx-auto mb-4"
        />
        <FormLogin />
    </div>
  )
}

export default Login