import { FormEventHandler } from 'react';

import EyeIcon from '../assets/eye.svg';

interface IProps {
  email: string,
  isShow: boolean,
  password: string,
  errors: string[],
  setEmail: Function,
  setIsShow: Function,
  changeForm: Function,
  setPassword: Function,
  handleLogin: FormEventHandler<HTMLFormElement>,
}

const LoginForm = (props: IProps) => {
  const {
    email,
    errors,
    isShow,
    password,
    setEmail,
    setIsShow,
    setPassword,

    handleLogin,
  } = props

  return (
    <section className="flex h-[50vh] items-center justify-center flex-col gap-5 min-w-[400px] w-[40vw] bg-white p-8">
      <span className="text-xl font-bold">MASUK</span>

      <form className="flex flex-col gap-5 w-full" autoComplete="asdasdsa" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <input
            onInput={(e: any) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="test@test.com"
            value={email}
            type="email"
            className="w-full p-3 border"
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className='flex relative items-center'>
            <input
              onInput={(e: any) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              type={isShow ? "text" : "password"}
              className='w-full p-3 border'
            />
            <span className='absolute right-3 cursor-pointer' onClick={() => setIsShow(!isShow)}>
              <img src={EyeIcon} style={{ color: '#DEDEDE' }} />
            </span>
          </div>
        </div>
        <input type="submit" hidden />
      </form>

      <div className='flex w-full justify-start text-blue-600 underline'>
        <span>Lupa kata sandi anda?</span>
      </div>

      <div className='flex w-full justify-end'>
        <div
          className="flex justify-center p-2 w-[120px] rounded cursor-pointer bg-[#D9D9D9] hover:bg-[#DEDEDE]"
          onClick={(e: any) => handleLogin(e)}
        >
          LOGIN
        </div>
      </div>
      {!!errors.length &&
        <ul className="flex flex-col text-red-400">
          {errors.map((e: any) => <li key={e} className="flex items-center">* {e}</li>)}
        </ul>
      }
    </section>
  )
}

export default LoginForm