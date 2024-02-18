import React from 'react';

const Login = React.lazy(() => import('@pages/Login'));
const Register = React.lazy(() => import('@pages/Register'));
const Home = React.lazy(() => import('@pages/Home'));
const ForgotPassword = React.lazy(() => import('@pages/ForgotPassword'));
const OTP = React.lazy(() => import('@pages/OTP'));
const GeoGuesser = React.lazy(() => import('@pages/GeoGuesser'));
const Admin = React.lazy(() => import('@pages/Admin'));
const Explore = React.lazy(() => import('@pages/Explore'));

export const MappedRoutes = [
    {
        element: <Login/>,
        path:'/login',
    },
    {
        element: <Register/>,
        path:'/register',
    },
    {
        element: <Home/>,
        path:'/',
    },
    {
        element: <ForgotPassword/>,
        path:'/forgot-password',
    },
    {
        element: <OTP/>,
        path:'/OTP',
    },
    {
        element: <GeoGuesser/>,
        path:'/geoguesser',
    },
    {
        element: <Admin/>,
        path:'/admin',
    },
    {
        element: <Explore/>,
        path:'/explore',
    },
]