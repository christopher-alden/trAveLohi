import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import SelectSearch from "@comp/form/SelectSearch";
import { Flight } from "@myTypes/flight.types";
import { AirportDetails } from "@myTypes/location.types";
import styles from '@styles/global.module.scss';
import { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import CustomDatePicker from "@comp/form/CustomDatePicker";


type FlightSearchWidgetProps = {
    flight: Flight,
    setFlight: Dispatch<SetStateAction<Flight>>
	mainTheme? : boolean
}
const FlightSearchWidget = ({flight = {departure: null, arrival: null, flightTime: null}, setFlight, mainTheme = true}:FlightSearchWidgetProps) =>{

	const updateArrival = useCallback((newArrival: AirportDetails) => {
		setFlight((currentFlight) => ({
			...currentFlight,
			arrival: newArrival,
		}));
	}, [setFlight])
    
	const updateDeparture =useCallback((newDeparture: AirportDetails) => {
		setFlight((currentFlight) => ({
			...currentFlight,
			departure: newDeparture,
		}));
	}, [setFlight])

	const updateDepartureTime = useCallback((newDepartureTime:Date)=>{
		setFlight((currentFlight)=>({
			...currentFlight,
			flightTime: {
				...currentFlight.flightTime,
				departureTime: newDepartureTime
			}
		}))
	}, [setFlight])

	const updateArrivalTime = useCallback((newArrivalTime:Date)=>{
		setFlight((currentFlight)=>({
			...currentFlight,
			flightTime: {
				...currentFlight.flightTime,
				arrivalTime: newArrivalTime
			}
		}))
	}, [setFlight])

    return (
        <Container width="100%" height="100%"  className="no-padding z2" center={true}>
            <Container   direction='row' width='100%' height="100%" px='0px' py='0px'>
				<Container
					px="0px"
					py="0px"
					height="100%"
					width="50%"
					gap={styles.g8}
					
				>
					<Container
						px="0px"
						py={styles.g4}
						direction="column"
						gap={styles.g2}
						width="50%"
						height="100%"
					>
						<Label
                            color={mainTheme ? styles.black: styles.secondaryWhite}
						>
							From
						</Label>
						<Container
							width="100%"
							direction="column"
							px="0px"
							py="0px"
							className='pointer'
						>
                            <SelectSearch mainTheme={mainTheme} getSelected={updateDeparture} selectedLocation={flight.departure}></SelectSearch>
							{flight.departure && (
								<Label className="no-wrap" color={mainTheme ? styles.secondaryWhite: styles.white}>
									{flight.departure.code}, {flight.departure.city?.name}, {flight.departure.country}
								</Label>
							)}
						</Container>
					</Container>
					<Container
						px="0px"
						py={styles.g4}
						direction="column"
						gap={styles.g2}
						width="50%"
						height="100%"
					>
						<Label
                            color={mainTheme ? styles.black: styles.secondaryWhite}
						>
							To
						</Label>
						<Container
							width="100%"
							direction="column"
							px="0px"
							py="0px"
							className='pointer'
						>
                            <SelectSearch mainTheme={mainTheme}  getSelected={updateArrival} selectedLocation={flight.arrival}></SelectSearch>
							{flight.arrival && (
								<Label className="no-wrap" color={mainTheme ? styles.secondaryWhite: styles.white}>
									{flight.arrival.code}, {flight.arrival.city?.name}, {flight.arrival.country}
								</Label>
							)}
						</Container>
					</Container>
				</Container>
				<Container
					px="0px"
					py="0px"
					height="100%"
					width="50%"
					gap={styles.g8}

				>
					<Container
						px="0px"
						py={styles.g4}
						direction="column"
						gap={styles.g2}
						width="50%"
						height="100%"
					>
						<Label
                            color={mainTheme ? styles.black: styles.secondaryWhite}
						>
							Departure Date
						</Label>
						<Container className="no-padding" gap={styles.g4}>
							<CustomDatePicker mainTheme={mainTheme}  setTime={updateDepartureTime}/>
						</Container>
					</Container>
					<Container
						px="0px"
						py={styles.g4}
						direction="column"
						gap={styles.g2}
						width="50%"
					>
						<Label
                            color={mainTheme ? styles.black: styles.secondaryWhite}
						>
							Return Date
						</Label>
						<CustomDatePicker mainTheme={mainTheme}   setTime={updateArrivalTime}/>
					</Container>
				</Container>
            </Container>
        </Container>
    )
}

export default FlightSearchWidget