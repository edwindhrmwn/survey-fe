import React, { useEffect, useState } from "react"
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DeleteOutlined,
  HomeOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Table } from 'antd';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


import useHome from "./useHome"
import RegisterForm from "../../components/RegisterForm";
import UserDashboard from "./user.dashboard"
import AdminDashboard from "./admin.dashboard"
import Instrument from "./admin.instrument";
import Category from "./admin.category"
import UserHistory from "./survey.history"
import Unj from "../../assets/Logo UNJ.png"

const Home = () => {
  const navigateTo = useNavigate()
  const [menus, setMenus] = useState<any>([])
  // const [picture, setPicture] = useState<any>(null)

  const {
    state: {
      role,
      isShow,
      errors,
      absents,
      roleUser,
      password,
      collapsed,
      activeMenu,
      emailRegis,
      successMessage,
      colorBgContainer,
    },
    methods: {
      setRole,
      setEmail,
      setIsShow,
      getUsers,
      setPassword,
      setCollapsed,
      uploadAbsent,
      setActiveMenu,
      handleRegister,
      handleCreateAccount,
      handleDeleteAccount,
    }
  } = useHome()
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [errorRegisMessage, setErrorRegis] = useState('')

  const [userDelete, setUserDelete] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = async () => {
    setErrorRegis('')
    const data = await handleCreateAccount(username, userEmail, userPassword)

    if (!data.status) return setErrorRegis(data.message)

    setShow(false)
    setUsername('')
    setUserEmail('')
    setUserPassword('')
  };

  const handleCloseDeleteConfirm = () => setShowDeleteConfirm(false)
  const handleDelete = async () => {
    await handleDeleteAccount(userDelete)
    handleCloseDeleteConfirm()
  }

  const { Header, Sider, Content } = Layout;

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Aksi',
      dataIndex: '',
      key: '',
      render: (data: any) => {
        if (data.email == sessionStorage.getItem('email')) {
          return <DeleteOutlined />
        }
        return <span
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => {
            setUserDelete(data.id)
            setShowDeleteConfirm(true)
          }}
        >
          <DeleteOutlined />
        </span>
      }
    },
  ];

  const admin = [
    {
      key: 'Dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'Kelola Kriteria',
      icon: <CheckSquareOutlined />,
      label: 'Kelola Kriteria',
    },
    {
      key: 'Kelola Instrument',
      icon: <CheckSquareOutlined />,
      label: 'Kelola Instrument',
    },
    {
      key: 'Kelola Akun',
      icon: <UserOutlined />,
      label: 'Kelola Akun',
    }
  ]

  const staff = [
    {
      key: 'Dashboard User',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'Riwayat Survey',
      icon: <CheckSquareOutlined />,
      label: 'Riwayat Survey',
    },
  ]

  const renderBody = (key: string) => {
    switch (key) {
      case 'Dashboard':
        return <AdminDashboard />

      case 'Kelola Akun':
        return <>
          <div className="w-full flex justify-between mb-2">
            <div className="text-xl mb-2"><b>Kelola Akun</b></div>
            <Button variant="primary" onClick={handleShow}>
              Tambah Akun
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Tambah Akun</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      autoFocus
                      onChange={(e: any) => setUserEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      placeholder="User Name"
                      onChange={(e: any) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    onChange={(e: any) => setUserPassword(e.target.value)}
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control as="input" />
                  </Form.Group>
                </Form>
                {errorRegisMessage ?
                  <span className="text-red-600 text-sm">{errorRegisMessage}</span> :
                  null
                }
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Tutup
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                  Simpan
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <Table
            dataSource={absents}
            columns={columns}
          />
        </>

      case 'register':
        return <RegisterForm
          role={role}
          isShow={isShow}
          errors={errors}
          email={emailRegis}
          password={password}

          setRole={setRole}
          setEmail={setEmail}
          setIsShow={setIsShow}
          setPassword={setPassword}
          handleRegister={handleRegister}
        />

      case 'Dashboard User':
        return <UserDashboard />

      case 'Riwayat Survey':
        return <UserHistory />

      case 'Kelola Kriteria':
        return <Category />

      case 'Kelola Instrument':
        return <Instrument />

      default:
        if (sessionStorage.getItem('role')?.toLocaleLowerCase() != 'admin') return <UserDashboard />
        return <AdminDashboard />
    }
  }

  useEffect(() => {
    setRole(sessionStorage.getItem('role') || '')

    if (sessionStorage.getItem('role') === 'ADMIN') {
      setMenus([...admin])
      getUsers()
    } else {
      setActiveMenu('absent')
      setMenus([...staff])
    }
  }, [])

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className='p-4'>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => {
            if (e.key == 'logout') {
              sessionStorage.clear()
              return navigateTo('/login')
            }
            setActiveMenu(e.key)
          }}
          defaultSelectedKeys={[activeMenu]}
          items={[
            {
              key: '',
              icon: <UserOutlined />,
              label: sessionStorage.getItem('username'),
            },
            ...menus,
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Log Out',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer, height: 80 }}>
          <div className="flex gap-3 items-center h-[80px]">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}

            <img src={Unj} alt="Unj Logo" style={{ width: 40 }} />
            <span className="ml-5 text-2xl font-bold">
              Repository Akreditasi Prodi
            </span>
          </div>
        </Header>
        <Content
          style={{
            overflow: 'auto',
            margin: '24px 16px',
            width: '100%',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {renderBody(activeMenu)}
          {!!successMessage && <span className="text-green-500 mt-3">{successMessage}</span>}
        </Content>

        <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi</Modal.Title>
          </Modal.Header>
          <Modal.Body>Apakah yakin ingin menghapus tersebut?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
              Tutup
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Lanjutkan
            </Button>
          </Modal.Footer>
        </Modal>
      </Layout>
    </Layout>
  )
}

export default Home