import Container from "@comp/container/Container"
import Navbar from "@comp/navigation/Navbar"
import { useEffect, useState } from "react"

import {useParams} from "react-router-dom"

import Footer from "@comp/navigation/Footer"
import ProtectedRoute from "src/middleware/ProtectedRoute"
import ExploreFlights from "./ExploreFlights"
import ExploreHotels from "./ExploreHotels"

const Explore = () => {
    

    const { type } = useParams(); // Access the 'type' parameter
    const [contentType, setContentType] = useState('flights'); // Default state

    useEffect(() => {
        if (type === 'flights' || type === 'hotels') {
            setContentType(type);
        }
    }, [type]);


    return (
        <ProtectedRoute>
            <Container px='0px' py='0px' direction='column' width='100%' className="bg-notthatwhite ">
                <Navbar/>
                {contentType === 'flights' && <ExploreFlights/>}
                {contentType === 'hotels' && <ExploreHotels/>}
                <Container width="100%" height="25vh"/>
                <Footer/>
            </Container>
        </ProtectedRoute>
    );
}

export default Explore