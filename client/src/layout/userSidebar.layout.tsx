import React from 'react';

const UserProfile = React.lazy(() => import('@comp/user/UserProfile'));
const Cart = React.lazy(() => import('@comp/user/Cart'));
const Finance = React.lazy(() => import('@comp/user/Finance'));



export const UserSidebarLayout = {
    MyAccount:{
        name: "My Account",
        element:<UserProfile/>,
    },
    Finance:{
        name: "Finance",
        element:<Finance/>,
    },
    MyCart:{
        name: "My Cart",
        element:<Cart/>,
    },
    InsertFlight:{
        name: "Flight List",
        element:<UserProfile/>,
    },
    ViewFlights:{
        name: "Booked Hotel",
        element:<UserProfile/>,
    },
}