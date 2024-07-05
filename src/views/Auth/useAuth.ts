import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom"

import { login } from "../../store/user";
import { useDispatch } from 'react-redux';

const useOnboard = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState([])
  const [error, setError] = useState('')
  const [role, setRole] = useState('STAFF')
  const [isShow, setIsShow] = useState(false)
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(false)

  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const resetValue = () => {
    setRole('')
    setEmail('')
    setErrors([])
    setPassword('')
    setIsShow(false)
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(import.meta.env.VITE_BE_BASE_URL + '/user/login', {
        username: email, password
      })

      dispatch(login({ id: data.data.userLogin.id, email, access_token: data.data.token, role: data.data.role }))

      sessionStorage.setItem('access_token', data.data.token)
      sessionStorage.setItem('email', email)
      sessionStorage.setItem('role', data.data.role)
      sessionStorage.setItem('username', data.data.userLogin.username)
      sessionStorage.setItem('userId', data.data.userLogin.id)

      resetValue()
      navigateTo('/')
    } catch (error: any) {
      setError(error.response.data.message)
      console.log(error.response.data.message)
      return false
      // setErrors(error.response.data.message)
    }
  }

  return {
    state: {
      role,
      email,
      error,
      errors,
      isShow,
      isLogin,
      password,
    },
    methods: {
      setRole,
      setEmail,
      setIsShow,
      setIsLogin,
      handleLogin,
      setPassword,
    }
  }
}


export default useOnboard