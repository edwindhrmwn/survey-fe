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
    <section className="flex h-screen items-center justify-center flex-col gap-8 min-w-[400px] w-[40vw] bg-white p-8">
      <span className="text-xl font-bold">Login Account</span>

      <form className="flex flex-col gap-5 w-full" autoComplete="asdasdsa" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <label>Email</label>
          <input
              onInput={(e: any) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="test@test.com"
              value={email}
              type="email"
              className="w-full p-1 border"
              required={true}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Password</label>
          <div className='flex relative items-center'>
            <input
              onInput={(e: any) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              type={isShow ? "text": "password"}
              className='w-full p-1 border'
            />
            <span className='absolute right-3 cursor-pointer' onClick={() => setIsShow(!isShow)}>
              <img src={EyeIcon} />
            </span>
            </div>
          </div>
          <input type="submit" hidden/>
      </form>

      <div className="flex justify-center p-2 rounded cursor-pointer w-full bg-blue-600 text-white hover:bg-blue-500" onClick={(e: any) => handleLogin(e)} >Submit</div>
      {!!errors.length && 
        <ul className="flex flex-col text-red-400">
          {errors.map((e: any) => <li key={e} className="flex items-center">* {e}</li>)}
        </ul>
      }
    </section>
  )
}

export default LoginForm