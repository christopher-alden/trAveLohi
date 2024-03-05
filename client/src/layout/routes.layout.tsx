import React from 'react';

const Login = React.lazy(() => import('@pages/Login'));
const Register = React.lazy(() => import('@pages/Register'));
const Home = React.lazy(() => import('@pages/Home'));
const ForgotPassword = React.lazy(() => import('@pages/ForgotPassword'));
const OTP = React.lazy(() => import('@pages/OTP'));
const GeoGuesser = React.lazy(() => import('@pages/GeoGuesser'));
const Admin = React.lazy(() => import('@pages/Admin'));
const Explore = React.lazy(() => import('@pages/Explore'));
const Profile = React.lazy(() => import('@pages/Profile'));
const FlightDetails = React.lazy(() => import('@pages/FlightDetails'));
const FlightReservation = React.lazy(() => import('@pages/FlightReservation'));
// const MyReservations = React.lazy(() => import('@pages/MyReservations'));
const HotelDetails = React.lazy(() => import('@pages/HotelDetails'));
const HotelReservation = React.lazy(() => import('@pages/HotelReservation'));
const GamePage = React.lazy(() => import('@pages/GamePage'));


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
        path:'/explore/:type',
    },
    {
        element: <Profile/>,
        path:'/profile',
    },
    {
        element: <FlightDetails/>,
        path:'/explore/flight-details',
    },
    {
        element: <FlightReservation/>,
        path:'/explore/flight-details/flight-reservation',
    },
    {
        element: <HotelDetails/>,
        path:'/explore/hotel-details',
    },
    {
        element: <HotelReservation/>,
        path:'/explore/hotel-details/hotel-reservation',
    },
    {
        element: <GamePage/>,
        path:'/game',
    },
]