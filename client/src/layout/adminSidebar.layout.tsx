import React from 'react';

const CreatePromo = React.lazy(() => import('@comp/admin/CreatePromo'));
const UpdatePromo = React.lazy(() => import('@comp/admin/UpdatePromo'));
const ManageUser = React.lazy(() => import('@comp/admin/ManageUser'));
const InsertFlight = React.lazy(() => import('@comp/admin/InsertFlight'));
const ViewFlights = React.lazy(() => import('@comp/admin/ViewFlights'));
const InsertHotel = React.lazy(() => import('@comp/admin/InsertHotel'));


export const AdminSidebarRoutes = {
    CreatePromo:{
        name: "Create Promo",
        element:<CreatePromo/>,
    },
    UpdatePromo:{
        name: "Update Promo",
        element:<UpdatePromo/>,
    },
    ManageUser:{
        name: "Manage User",
        element:<ManageUser/>,
    },
    InsertFlight:{
        name: "Insert Flight",
        element:<InsertFlight/>,
    },
    ViewFlights:{
        name: "View Flights",
        element:<ViewFlights/>,
    },
    InsertHotel:{
        name: "Insert Hotel",
        element:<InsertHotel/>,
    },
}