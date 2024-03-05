import Container from "@comp/container/Container"
import Button from "@comp/form/Button"
import Label from "@comp/form/Label"
import Footer from "@comp/navigation/Footer"
import Navbar from "@comp/navigation/Navbar"
import FlightReservationCard from "@comp/product/FlightReservationCard"
import { CompleteFlightTransaction, FlightDetail, FlightTransactionPayload } from "@myTypes/flight.types"
import { TransactionType, UserTransaction } from "@myTypes/user.types"
import styles from '@styles/global.module.scss'
import { ApiEndpoints } from "@util/api.utils"
import { useContext, useEffect, useState } from "react"
import {useQuery } from "react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useReservation } from "src/context/reservationContext"
import { UserContext } from "src/context/userContext"
import ProtectedRoute from "src/middleware/ProtectedRoute"
import { calculateFlightSummary, generateFlightTransaction } from "src/services/haniServices"
import { backLink } from "src/services/linksServices"
import { getFlightDetail } from "src/services/locationServices"

const FlightReservation = () =>{
    const {reservations ,finishTransaction} = useReservation()
    const [queryParameters] = useSearchParams()
    const flightId =  queryParameters.get("flightId")
    const [flightDetail, setFlightDetail] = useState<FlightDetail|null>(null)
    const [flightSummary, setFlightSummary]= useState<{totalPrice: any, pricePerClass:Record<string,{price:number,count:number}>}>()
    const {user} = useContext(UserContext)

    const navigate = useNavigate()

    useEffect(() => {
        setFlightSummary(calculateFlightSummary(reservations, flightDetail))
    }, [reservations,flightDetail])
    
    useEffect(() => {
        if(reservations.length == 0)navigate('/')
    }, [])
    

    const {error, isLoading} = useQuery(['getFlightDetail', flightId], () => getFlightDetail(flightId), {
        onSuccess: (data: any) => {
            const transformedData: FlightDetail = {
                ID: data.ID,
                flightRoute: {
                    ID: data.flightRoute.ID,
                    departure: data.flightRoute.departureAirport,
                    arrival: data.flightRoute.arrivalAirport,
                    price: data.flightRoute.price,
                    flightDuration: data.flightRoute.flightDuration
                },
                flightTime: {
                    departureTime: data.departureTime,
                    arrivalTime: data.arrivalTime
                },
                airline: data.airline,
                airplane: data.airplane,
                status: data.status,
            };
    
            setFlightDetail(transformedData);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    // const createUserTransaction = useMutation(
    //     async (userTransaction: UserTransaction) => {
    //         const res = await fetch(ApiEndpoints.UserTransactionCreate, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(userTransaction),
    //         credentials: 'include',
    //     });
    //     if (!res.ok) throw new Error('Network response was not ok');
    //     return res.json();
    // }).mutateAsync; 

    // const createTraveler = useMutation(
    //     async (traveler: Traveler) => {
    //         const response = await fetch(ApiEndpoints.TravelerCreate, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(traveler),
    //         credentials: 'include',
    //     });
    //     if (!response.ok) throw new Error('Network response was not ok');
    //     return response.json();
    // }).mutateAsync;

    // const  createFlightTransaction  = useMutation(
    //     async (flightTransaction: FlightTransaction) => {
    //         const response = await fetch(ApiEndpoints.FlightTransactionCreate, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(flightTransaction),
    //             credentials: 'include',
    //     });
    //     if (!response.ok) throw new Error('Network response was not ok');
    //     return response.json();
    // }).mutateAsync;
        

    const addToCart = async (price: number) => {
        try {
            if (!flightDetail) throw new Error("No flight");
    
            const travelers = reservations.map(rsvp => rsvp.traveler);
            const flightTransactions:FlightTransactionPayload[] = reservations.map(rsvp => {
                if (!rsvp.seat?.ID) throw new Error("Seat has not been chosen");
                return generateFlightTransaction(flightDetail, rsvp?.seat, 10);
            });
    
            const completeTransaction: CompleteFlightTransaction = {
                userId: user!.ID!,
                price: price,
                transactionDate: new Date(),
                status: TransactionType.Cart,
                travelers: travelers,
                flightTransactions: flightTransactions
            };
    
            console.log(completeTransaction)
            const response = await fetch(ApiEndpoints.FlightCompleteTransactionCreate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeTransaction),
                credentials: 'include',
            });
    
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            //TODO: nav ke 
            finishTransaction()
            // navigate()
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };
    
    

    if(isLoading)return<></>
    return(
        <ProtectedRoute>
            <Container px='0px' py='0px' direction='column' width='100%' height="fit-content" className={`bg-notthatwhite`}>
                <Navbar/>
                <Container direction="column" width="100%" height="100%" className="push-navbar min-h-full" gap={styles.g8}>
                    <Container className="no-padding" width="100%">
                        <Container className="no-padding items-end" gap={styles.g2}>
                            <Label color={styles.secondaryWhite}  fontSize={styles.fxl} className="pointer" onClick={()=>{navigate(`${backLink('flights')}`)}}>Flights</Label>
                            <Label color={styles.secondaryWhite} fontSize={styles.fxl}>/</Label>
                            <Label color={styles.secondaryWhite}  fontSize={styles.fxl}  className="pointer" onClick={()=>{navigate(`${backLink('flight-detail')}${flightId}`)}}>Flight Details</Label>
                            <Label color={styles.secondaryWhite} fontSize={styles.fxl}>/</Label>
                            <Label color={styles.black} className="lh-5xl" fontSize={styles.f5xl}> Flight Reservation</Label>
                        </Container>
                    </Container>
                    <Container direction="column" width="100%" className="no-padding" gap={styles.g8}>
                        {reservations.map((reservation, index)=>{
                            return(
                                <FlightReservationCard key={index} flightDetail={flightDetail!} reservation={reservation}></FlightReservationCard>
                            )
                        })}
                    </Container>
                    <Container width="100%" height="5vh"/>
                    <Container direction="column" width='50%' className="no-padding" gap={styles.g8}>
                            <Label className="lh-3xl " fontSize={styles.f3xl}>Summary</Label>
                            {
                                flightSummary?.pricePerClass &&
                                <Container width="100%" className="no-padding" direction="column" gap={styles.g4}>
                                    {Object.entries(flightSummary.pricePerClass).map(([seatClass, {price, count}]) => (
                                        price > 0 && ( 
                                            <Container key={seatClass} width="100%" className="space-between items-end no-padding">
                                                <Label>{seatClass} x{count}</Label>
                                                <Container direction="column" className="no-padding items-end">
                                                    <Label fontSize={styles.fsm} color={styles.secondaryWhite}>USD {price.toFixed(2)}</Label>
                                                    <Label>USD {(price*count).toFixed(2)}</Label>
                                                </Container>
                                            </Container>
                                        )
                                    ))}
                                </Container>
                            }
                            <Container width="100%" className="space-between items-end no-padding">
                                <Label>Total Price</Label>
                                <Label fontSize={styles.f3xl} >USD {flightSummary?.totalPrice.toFixed(2)}</Label>
                            </Container>
                            <Container direction="column" width="100%" className="no-padding" gap={styles.g4}>
                                <Button onClick={()=>{addToCart(flightSummary!.totalPrice)}} className="outline-btn w-full">
                                    Add To Cart
                                </Button>
                                <Button className="primary-btn w-full">
                                    Buy Now
                                </Button>
                            </Container>
                    </Container>
                </Container>
                <Container width="100%" height="10vh"/>
                <Footer/>
            </Container>
        </ProtectedRoute>
    )
}

export default FlightReservation