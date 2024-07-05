import useAuth from "./useAuth"
import LoginForm from "../../components/LoginForm";

const OnBoarding = () => {
  const {
    state: {
      email,
      errors,
      isShow,
      password,
    },
    methods: {
      setEmail,
      setIsShow,
      setIsLogin,
      handleLogin,
      setPassword,
    },
  } = useAuth()


  return (
    <div className="h-screen w-screen flex bg-[#DEDEDE] p-4 justify-center items-center">
      <LoginForm
        email={email}
        isShow={isShow}
        errors={errors}
        password={password}
        changeForm={setIsLogin}

        setEmail={setEmail}
        setIsShow={setIsShow}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </div>
  )
}

export default OnBoarding