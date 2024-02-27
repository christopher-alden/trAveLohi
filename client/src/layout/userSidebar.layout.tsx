import React from 'react';

const UserProfile = React.lazy(() => import('@comp/user/UserProfile'));



export const UserSidebarLayout = {
    CreatePromo:{
        name: "My Account",
        element:<UserProfile/>,
    },
    UpdatePromo:{
        name: "My Cart",
        element:<UserProfile/>,
    },
    ManageUser:{
        name: "My Booking",
        element:<UserProfile/>,
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