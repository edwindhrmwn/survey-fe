import axios from 'axios'
import { theme } from 'antd';
import { useSelector } from 'react-redux';
import { useState, FormEvent } from 'react'

interface IParams {
  limit?: string | number;
  offset?: string | number;
}

const useHome = () => {
  const [role, setRole] = useState('STAFF')
  const [absents, setAbsents] = useState([])
  const [emailRegis, setEmail] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('absents')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const user = useSelector((state: any) => state.user);

  const { email, access_token, role : roleUser } = user

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getAbsents = async ({limit, offset}: IParams) => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_BE_BASE_URL}/absents`,
        params: {
          limit: limit || 5,
          offset: offset || 0,
        },
        headers: {
          access_token: access_token || sessionStorage.getItem('access_token')
        },
      })
      setAbsents(data.data.absents)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.messages)
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BE_BASE_URL}/register`,
        headers: {
          access_token: access_token || sessionStorage.getItem('access_token')
        },
        data: {
          email: emailRegis,
          password,
          role,
        }
      })
      setSuccessMessage('User created!')

      setTimeout(() => {
        setSuccessMessage('')
      }, 2000);
    } catch (error: any) {
      setErrors(error.response.data.messages)
      setTimeout(() => {
        setErrors([])
      }, 2000);
      console.log(error.response.data.messages)
    }
  }

  const uploadAbsent = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BE_BASE_URL}/absent`,
        headers: {
          access_token: access_token || sessionStorage.getItem('access_token'),
          "Content-Type": "multipart/form-data"
        },
        data: formData
      })
      setSuccessMessage('Your absent is submited, thank you!')

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000);
    } catch (error: any) {
      setErrors(error.response.data.messages)
      setTimeout(() => {
        setErrors([])
      }, 5000);
      console.log(error.response.data.messages)
    }
  }

  return {
    state: {
      role,
      email: email || sessionStorage.getItem('email'),
      isShow,
      errors,
      absents,
      roleUser,
      password,
      collapsed,
      isLoading,
      emailRegis,
      activeMenu,
      successMessage,
      colorBgContainer,
    },
    methods: {
      setRole,
      setEmail,
      setIsShow,
      getAbsents,
      setPassword,
      setCollapsed,
      uploadAbsent,
      setActiveMenu,
      handleRegister,
    }
  }
}

export default useHome