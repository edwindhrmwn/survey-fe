import dayjs from "dayjs";
import React, { useEffect } from "react"
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Table } from 'antd';
import { useNavigate } from "react-router-dom";

import useHome from "./useHome"
import RegisterForm from "../../components/RegisterForm";

const Home = () => {
  const navigateTo = useNavigate()
  const { 
    state: {
      role,
      isShow,
      errors,
      absents,
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
      setActiveMenu,
      handleRegister,
    }
  } = useHome()
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

  useEffect(() => {
    getAbsents({limit: 100})
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
          {
            activeMenu == 'absents'
            ? <Table
                dataSource={absents}
                columns={columns}
              />
            : <RegisterForm
                role={role}
                email={emailRegis}
                isShow={isShow}
                errors={errors}
                password={password}
      
                setRole={setRole}
                setEmail={setEmail}
                setIsShow={setIsShow}
                setPassword={setPassword}
                handleRegister={handleRegister}
              />
          }
          {!!successMessage && <span className="text-green-500">{successMessage}</span>}
        </Content>
      </Layout>
    </Layout>
  )
}

export default Home