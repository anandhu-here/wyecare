import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';

import DashboardApp from './pages/DashboardApp';
import DashboardHome from './pages/DashboardHome';
import DashboardAdmin from './pages/DashboardAdmin';
import Profile from './pages/Profile';
import DashboardHomes from './pages/DashboardHomes';
import DashboardCarer from './pages/DashBoardCarer';

// ----------------------------------------------------------------------

export default function Router({path, auth}) {
  console.log(path, auth, "+++++++++++++")
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout path={path}/>,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'home', element: <DashboardHome /> },
        { path:"carer", element: <DashboardCarer /> },
        { path: 'homes', element: <DashboardHomes />},
        { path: 'agent', element: <DashboardAdmin /> },
        { path: 'user', element: <User /> },
        { path:"profile", element:<Profile /> },
        
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element:auth?(<Navigate to={`/dashboard/${path}`} /> ):(<Navigate to={`login`} /> )},
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
      ],
    },
  ]);
}
