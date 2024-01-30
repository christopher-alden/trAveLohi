import Container from '@comp/container/Container';
import Slideshow from '@comp/product/Slideshow';
import {useContext, useEffect, useState} from 'react';
import locationInformation from 'src/data/landingSlideshow.json';
import {UserContext} from 'src/context/userContext';
import ProtectedRoute from 'src/middleware/ProtectedRoute';
import Navbar from '@comp/navigation/Navbar';


const Home = () => {



	return (
		// <ProtectedRoute>
			<div>
				{/* {user?.firstName}
				<button onClick={()=>{logout()}}> logout</button> */}

				<Navbar/>
				<Container  px='0px' py='0px' width='100vw' height='100vh'>
					<Slideshow content={locationInformation}></Slideshow>
				</Container>
			</div>
		// </ProtectedRoute>
	);
};
export default Home;
