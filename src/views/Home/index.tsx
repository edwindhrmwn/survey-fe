import dayjs from "dayjs";
import React, { useEffect, useState } from "react"
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Table } from 'antd';
import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam'
const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
}


import useHome from "./useHome"
import RegisterForm from "../../components/RegisterForm";

const Home = () => {
  const navigateTo = useNavigate()
  const [menus, setMenus] = useState<any>([])
  const [picture, setPicture] = useState<any>(null)

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
    methods : {
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
  } = useHome()

  const webcamRef = React.useRef<any>(null)
  const capture = React.useCallback(async () => {
    const pictureSrc = webcamRef.current.getScreenshot()
    setPicture(pictureSrc)
    const file = await dataUrlToFile(pictureSrc, 'upload' + Math.random() * 1000)
    uploadAbsent(file)
  }, [webcamRef, setPicture])

  const { Header, Sider, Content } = Layout;

  const columns = [
    {
      title: 'Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Photo',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (theImageURL: string) => <img src={theImageURL} alt={theImageURL} width={200}/>,
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (time: string) => <span>{dayjs(time).format('DD/MM/YYYY HH:mm:ss')}</span>
    },
  ];

  const admin = [
    {
      key: 'absents',
      icon: <OrderedListOutlined />,
      label: 'Absents',
    },
    {
      key: 'register',
      icon: <UserOutlined />,
      label: 'Create User',
    },
  ]

  const staff = [
    {
      key: 'absent',
      icon: <UserOutlined />,
      label: 'Absent',
    },
  ]

  async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
  }

  const renderBody = (key: string) => {
    switch (key) {
      case 'absents':
        return <Table
          dataSource={absents}
          columns={columns}
        />
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
      case 'absent':
        return <div className="flex flex-col justify-center items-center gap-4">
          {!picture ? (
            <Webcam
              audio={false}
              height={400}
              ref={webcamRef}
              width={400}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          ) : (
            <img src={picture} />
          )}
          {!!picture ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                setPicture('')
              }}
              className="bg-blue-500 rounded text-white p-3"
            >
              Retake
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault()
                capture()
              }}
              className="bg-blue-500 rounded text-white p-3"
            >
              Capture
            </button>
          )}
        </div>
      default:
        return null
    }
  }

  useEffect(() => {
    if (roleUser == 'ADMIN') {
      setMenus([...admin])
      getAbsents({limit: 100})
    } else {
      setMenus([...staff])
    }
  }, [])

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className='p-4'>
        <div className="text-white font-bold text-lg mb-4">DEXA GROUP</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => {
            if (e.key == 'logout') {
              sessionStorage.clear()
              return navigateTo('/auth')
            }
            setActiveMenu(e.key)
          }}
          defaultSelectedKeys={[activeMenu]}
          items={[
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
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
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
      </Layout>
    </Layout>
  )
}

export default Home