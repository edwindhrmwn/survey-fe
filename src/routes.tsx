import { Suspense } from 'react';
import {
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom"

import Home from './views/Home'
import Auth from './views/Auth'


const ProtectRoute = () => {
  const isLoggedIn = sessionStorage.getItem('access_token')
  return (
    <Suspense fallback={<span>Loading...</span>}>
      {
        !!isLoggedIn ?
          <Outlet />
        : <Navigate to={'/login'}/>
      }
    </Suspense>
  );
};


const routes = [
  {
    path: '/',
    name: 'Home',
    Element: Home
  },
  {
    path: '/login',
    name: 'Authtentication',
    Element: Auth
  },
]

const Router = () => {
  return (
    <Routes>
      <Route element={<Auth/>} path={'/login'} />
      <Route element={<ProtectRoute />}>
        {routes.map((page, idx) => {
          const Element = page.Element
          return (
            <Route
              key={idx}
              element={<Element/>}
              path={page.path}
            />
          )}
        )}
      </Route>
    </Routes>
  )
}

export default Router
