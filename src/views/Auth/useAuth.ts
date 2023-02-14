import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom"

import { login } from "../../store/user";
import { useDispatch } from 'react-redux';

const useOnboard = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState([])
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
      const { data } = await axios.post(import.meta.env.VITE_BE_BASE_URL + '/login', {
        email, password
      })

      dispatch(login({id: data.data.id, email, access_token: data.data.access_token}))
      sessionStorage.setItem('access_token', data.data.access_token)
      sessionStorage.setItem('email', email)
      
      resetValue()
      navigateTo('/')
    } catch (error: any) {
      setErrors(error.response.data.messages)
      console.log(error)
    }
  }

  return {
    state: {
      role,
      email,
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