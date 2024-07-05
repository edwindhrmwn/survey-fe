import axios from 'axios'
import { theme } from 'antd';
import { useSelector } from 'react-redux';
import { useState, FormEvent } from 'react'

interface IParams {
  limit?: string | number;
  offset?: string | number;
  sortName?: string
}

const useHome = () => {
  const [role, setRole] = useState(sessionStorage.getItem('role') || 'STAFF')
  const [absents, setAbsents] = useState([])
  const [categoryCriteria, setCategoryCriteria] = useState([])
  const [instrument, setInstrument] = useState([])
  const [category, setCategory] = useState([])
  const [emailRegis, setEmail] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashbord')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [instrumentQuestion, setInstrumentQuestion] = useState([])

  const [questions, setQuestion] = useState([])

  const user = useSelector((state: any) => state.user);

  const { email, access_token, role: roleUser } = user

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getUsers = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(import.meta.env.VITE_BE_BASE_URL + '/user', {})

      setAbsents(data.data)
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

  const handleCreateAccount = async (username: string, email: string, password: string) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_BE_BASE_URL + '/user/register', { username, email, password })
      // setAbsents(data.data)
      await getUsers()
      setIsLoading(false)

      return { status: true, data: data.data }
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleDeleteAccount = async (id: number) => {
    try {
      const { data } = await axios.delete(import.meta.env.VITE_BE_BASE_URL + '/user/' + id)

      await getUsers()
      setIsLoading(false)

      return { status: true, data: data.data }
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleGetCategoryCriteria = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(import.meta.env.VITE_BE_BASE_URL + '/category-instrument-by-user/' + sessionStorage.getItem('userId'), {})

      setCategoryCriteria(data.data)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleGetCategoryCriteriaAdmin = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(import.meta.env.VITE_BE_BASE_URL + '/category-instrument', {})

      setCategoryCriteria(data.data)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleGetInstrument = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(import.meta.env.VITE_BE_BASE_URL + '/instrument', {})

      setInstrument(data.data)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleGetCategories = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(import.meta.env.VITE_BE_BASE_URL + '/categories', {})

      setCategory(data.data)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleCreateInstrument = async (instrumentName: string, instrumentCategoryId: any, instrumentCategoryName: string) => {
    try {
      setIsLoading(true)
      await axios.post(import.meta.env.VITE_BE_BASE_URL + '/instrument', {
        instrumentName, instrumentCategoryId, instrumentCategoryName
      })

      handleGetInstrument()
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleUpdateInstrument = async (id: any, instrumentName: string, instrumentCategoryId: any, instrumentCategoryName: string) => {
    try {
      setIsLoading(true)
      await axios.put(import.meta.env.VITE_BE_BASE_URL + '/instrument/' + id, {
        instrumentName, instrumentCategoryId, instrumentCategoryName
      })

      handleGetInstrument()
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleDeleteInstrument = async (id: number) => {
    try {
      setIsLoading(true)
      await axios.delete(import.meta.env.VITE_BE_BASE_URL + '/instrument/' + id, {})

      handleGetInstrument()
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      setIsLoading(true)
      await axios.delete(import.meta.env.VITE_BE_BASE_URL + '/category/' + id, {})

      handleGetCategories()
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleUpdateCategory = async (id: any, categoryName: string, categoryCode: any) => {
    try {
      setIsLoading(true)
      await axios.put(import.meta.env.VITE_BE_BASE_URL + '/category/' + id, { categoryName, categoryCode })

      handleGetCategories()
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleGetQuestionByInstrument = async (id: number) => {
    try {
      setIsLoading(true)
      setQuestion([])

      const { data } = await axios.get(import.meta.env.VITE_BE_BASE_URL + '/question/' + id + '?userId=' + sessionStorage.getItem('userId'), {})

      setQuestion(data.data)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleSubmitAnswer = async (dataParam: any) => {
    try {
      setIsLoading(true)
      // setQuestion([])

      await axios.post(import.meta.env.VITE_BE_BASE_URL + '/answer', { data: dataParam })

      // setQuestion(data.data)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
    }
  }

  const handleGetInstrumentQuestion = async () => {
    try {
      setIsLoading(true)
      // setQuestion([])

      const { data } = await axios.get(import.meta.env.VITE_BE_BASE_URL + '/instrument-question/' + sessionStorage.getItem('userId'), {})

      setInstrumentQuestion(data.data)
      setIsLoading(false)
    } catch (error: any) {
      setErrors(error.response.data.message)
      setIsLoading(false)

      return { status: false, message: error.response.data.message }
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
      categoryCriteria,
      instrument,
      category,
      questions,
      instrumentQuestion,
    },
    methods: {
      setRole,
      setEmail,
      setIsShow,
      getUsers,
      setPassword,
      setCollapsed,
      setQuestion,
      uploadAbsent,
      setActiveMenu,
      handleRegister,
      handleCreateAccount,
      handleDeleteAccount,
      handleGetInstrument,
      handleGetCategoryCriteria,
      handleGetCategories,
      handleCreateInstrument,
      handleUpdateInstrument,
      handleDeleteInstrument,
      handleUpdateCategory,
      handleDeleteCategory,
      handleSubmitAnswer,
      handleGetQuestionByInstrument,
      handleGetInstrumentQuestion,
      handleGetCategoryCriteriaAdmin,
    }
  }
}

export default useHome