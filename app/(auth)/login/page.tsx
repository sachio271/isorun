import FormLogin from "@/components/form-login"
import { ReportProblemSection } from "@/components/report-problem-section"
import Image from "next/image"

const Login = () => {
  return (
    <div>
        <Image
          src="/isoplus.png"
          alt="App Logo"
          width={280}
          height={280}
          className="mx-auto mb-4"
        />
        <FormLogin />
        <ReportProblemSection />
    </div>
  )
}

export default Login