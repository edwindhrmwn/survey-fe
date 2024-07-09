import { FormEventHandler, useEffect } from 'react';

import EyeIcon from '../assets/eye.svg';
import Unj from '../assets/Logo UNJ.png'

interface IProps {
  email: string,
  isShow: boolean,
  password: string,
  error: string,
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
    error,
    isShow,
    password,
    setEmail,
    setIsShow,
    setPassword,

    handleLogin,
  } = props

  return (
    <section className="flex items-center justify-center flex-col gap-3 min-w-[400px] w-[40vw] bg-[white] p-8 rounded" style={{ minHeight: '50vh' }}>
      <img src={Unj} style={{ width: 60 }} />
      <span className="text-xl font-bold">REPOSITORI AKREDITASI PRODI</span>
      <span className="text-xl font-bold">MASUK</span>

      <form className="flex flex-col gap-3 w-full" autoComplete="asdasdsa" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <input
            onInput={(e: any) => setEmail(e.target.value)}
            placeholder="User Name"
            // autoComplete="test@test.com"
            value={email}
            // type="email"
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
        {!!error &&
          <div className='w-full flex flex-col text-red-400'>
            <span>* {error}</span>
            {/* <ul className="flex flex-col text-red-400">
            <li className="flex items-center">* {error}</li>
          </ul> */}
          </div>
        }
      </form>

      {/* <div className='flex w-full justify-start text-blue-600 underline'>
        <span>Lupa kata sandi anda?</span>
      </div> */}

      <div className='flex w-full justify-end'>
        <div
          className="flex justify-center p-2 w-[120px] rounded text-white cursor-pointer bg-[#1677FF] hover:bg-[#4793ff]"
          onClick={(e: any) => handleLogin(e)}
        >
          LOGIN
        </div>
      </div>
    </section >
  )
}

export default LoginForm