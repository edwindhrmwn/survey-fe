import { FormEventHandler } from 'react';

import EyeIcon from '../assets/eye.svg';

interface IProps {
  role: string,
  email: string,
  isShow: boolean,
  password: string,
  errors: string[],
  setRole: Function,
  setEmail: Function,
  setIsShow: Function,
  setPassword: Function,
  handleRegister: FormEventHandler<HTMLFormElement>,
}

const RegisterForm = (props: IProps) => {
  const {
      role,
      email,
      errors,
      isShow,
      setRole,
      password,
      setEmail,
      setIsShow,
      setPassword,
      handleRegister,
  } = props

  return (
    <section className="flex flex-col gap-8 min-w-[400px]">
      <span className="text-xl font-bold">Create Account</span>

      <form className="flex flex-col gap-5 w-full" autoComplete="asdasdsa" onSubmit={handleRegister}>
        <div className="flex flex-col gap-2">
          <label className="">Email</label>
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
          <label className="">Password</label>
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
          <div className="flex flex-col gap-2">
            <label className="">Role</label>
            <div className='flex'>
              <select className="w-full p-1 border" onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <input type="submit" hidden/>
      </form>

      <div className="flex justify-center p-2 rounded cursor-pointer w-full bg-blue-600 text-white hover:bg-blue-500" onClick={(e: any) => handleRegister(e)} >Create</div>
      {!!errors && !!errors.length && 
        <ul className="flex flex-col text-red-400">
          {errors.map((e: any) => <li key={e} className="flex items-center">* {e}</li>)}
        </ul>
      }
    </section>
  )
}

export default RegisterForm