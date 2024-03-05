import Container from '@comp/container/Container';
import Slideshow from '@comp/product/Slideshow';
import locationInformation from 'src/data/landingSlideshow.json';
import Navbar from '@comp/navigation/Navbar';
import styles from '@styles/global.module.scss'
import '@styles/generic-styles/container.styles.scss'
import UserPromoWidget from '@comp/product/UserPromoWidget';
import FlightSearchWidget from '@comp/product/FlightSearchWidget';
import FormlessDropdown from '@comp/form/FormlessDropdown';
import { useState } from 'react';
import { Flight, TripRouteList, SeatClass } from '@myTypes/flight.types';
import Footer from '@comp/navigation/Footer';
import leftArrow from '@icons/arrow-icon.png'
import Picture from '@comp/container/Picture';
import Button from '@comp/form/Button';
import { useSearch } from 'src/context/searchContext';




const Home = () => {
	const {execSearch} = useSearch()
	const [chosenFlight, setChosenFlight] = useState<Flight>({arrival:null, departure:null, flightTime:null})


	const searchBuilder = () =>{
		
		let searchQuery = `/explore/flights/?searchMode=${encodeURIComponent('flights')}`

		//TODO: ini case kalo flight doang
		if(chosenFlight){
			if(chosenFlight.departure){
				searchQuery = searchQuery + `&departureId=${encodeURIComponent(chosenFlight.departure.ID)}`
			}
			if(chosenFlight.arrival){
				searchQuery = searchQuery + `&arrivalId=${encodeURIComponent(chosenFlight.arrival.ID)}`
			}
		}

		execSearch(searchQuery)
	}


	console.log('run')
	return (
		// <ProtectedRoute>
			<Container px='0px' py='0px' direction='column' width='100vw'>
				<Navbar/>
				<Container  px='0px' py='0px' width='100vw' height='80vh'>
					<Slideshow content={locationInformation}/>
				</Container>
				<Container direction='column' px='0px' py='0px' width='100vw' height='fit-content' className='bg-notthatwhite z-1000 no-br'>
					<Container  width='100vw' height='325px' className='floating-island-ctr no-br' >
						<Container px={styles.g16} py={styles.g10} direction='column' width='100%' height='100%' className='bg-notthatwhite no-br shadow floating-island relative ' gap={styles.g4}>
							<Container
								direction="row"
								px="0px"
								py="0px"
								gap={styles.g8}
								className='z2'
							>
								<FormlessDropdown
									onChange={()=>{}}
									name="trip"
									className="no-outline no-padding-l bg-notthatwhite"
									options={TripRouteList}
								/>
								<FormlessDropdown
									onChange={()=>{}}

									name="class"
									className="no-outline no-padding-l bg-notthatwhite"
									options={Object.values(SeatClass)}
								/>
							</Container>
							<FlightSearchWidget flight={chosenFlight} setFlight={setChosenFlight} />
							<Button onClick={()=>{searchBuilder()}} victor={chosenFlight.departure==null && chosenFlight.arrival==null} className='primary-btn  floating-btn flex-align space-between'>
								Search
								<Picture width='25px' height='25px' className='rotate' src={leftArrow}/>
							</Button>
						</Container>
						
					
					</Container>
					{/* PEMBAGI AJA */}
					<Container height='20vh' width='100vw' className='bg-notthatwhite'></Container>
					<Container className='bg-notthatwhite' direction='column' width='100vw' height='100vh' gap={styles.g4}>
						<UserPromoWidget/>
					</Container>
				</Container>

				<Footer/>
					
			</Container>
		// </ProtectedRoute>
	);
};
export default Home;
