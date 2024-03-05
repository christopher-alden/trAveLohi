import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import Navbar from "@comp/navigation/Navbar"
import FlightDetailCard from "@comp/product/FlightDetailCard"
import { FlightDetail, FlightReservation,  } from "@myTypes/flight.types"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import { getFlightDetail, getSeatAmount,  } from "src/services/locationServices"
import styles from '@styles/global.module.scss'
import TextField from "@comp/form/TextField"
import { useForm } from "react-hook-form"
import DatePicker from "@comp/form/DatePicker"
import { AttributeRules } from "@util/user.util"
import Button from "@comp/form/Button"
import closeIcon from "@icons/close-icon-black.png"
import Picture from "@comp/container/Picture"
import { useReservation } from "src/context/reservationContext"
import { Traveler } from "@myTypes/user.types"
import { backLink } from "src/services/linksServices"
import Footer from "@comp/navigation/Footer"
import ProtectedRoute from "src/middleware/ProtectedRoute"

const FlightDetails = () => {

    const [queryParameters] = useSearchParams()
    const flightId =  queryParameters.get("flightId")
    const [flightDetail, setFlightDetail] = useState<FlightDetail|null>(null)
    const {register, handleSubmit, reset, formState: { errors } } = useForm();
    const [availableSeats, setAvailableSeats] = useState<number>(0);

    const {addReservation,removeReservation,reservations, resetSeat} = useReservation()
    const navigate = useNavigate();

    const onSubmit = (data:any) => {
        const traveler: Traveler ={
            dateOfBirth: data.dateOfBirth,
            firstName: data.firstName,
            lastName: data.lastName,
            passportNumber: data.passportNumber,
        }
        const reservation: FlightReservation = {
            traveler: traveler,
        }
        addReservation(reservation)
        reset(); 
    };

    const continueReserveSeat = () =>{
        navigate(`/explore/flight-details/flight-reservation?flightId=${flightId}`)
    }    

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


    const { error: seatError, isLoading: seatLoading } = useQuery(['getSeatAmount', flightId], () => getSeatAmount(flightId),
        {
            onSuccess: (data: any) => {
                setAvailableSeats(data.seatAmount);
            },
        }
    );

    useEffect(() => {
        resetSeat()
    }, [])
    

    if(isLoading || seatLoading)return <></>
    return(
        <ProtectedRoute>
            <Container direction='column' width='100%' className="no-padding bg-notthatwhite">
                <Navbar/>
                <Container direction="column" gap={styles.g8} width="100%" className="push-navbar min-h-full">
                    <Container direction="column" className="no-padding" width="100%"  gap={styles.g8}>
                        <Container className="no-padding items-end" gap={styles.g2}>
                            <Label color={styles.secondaryWhite}  fontSize={styles.fxl} className="pointer" onClick={()=>{navigate(`${backLink('flights')}`)}}>Flights</Label>
                            <Label color={styles.secondaryWhite} fontSize={styles.fxl}>/</Label>
                            <Label color={styles.black} className="lh-5xl" fontSize={styles.f5xl}> Flight Details</Label>
                        </Container>
                        <FlightDetailCard availableSeatCount={availableSeats} isDisplayOnly={true} flightDetail={flightDetail}/>

                    </Container>
                    <Container direction="row" className="no-padding" width="100%" gap={styles.g8}>
                        <Container width='50%'  className="bg-white" direction="column"  gap={styles.g4}>
                            <Label fontSize={styles.f3xl}>Traveler Details</Label>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Container width="100%" height="100%" className="no-padding" gap={styles.g4} direction="column">
                                    <Container width="100%" height="100%" className="no-padding" gap={styles.g4}>
                                        <TextField color={styles.black} outlineColor={styles.secondaryBlack} name='firstName' register={register} rules={{ required: "*Required" }} error={errors.firstName} width='100%' prompt='First Name' />
                                        <TextField color={styles.black} outlineColor={styles.secondaryBlack} name='lastName' register={register} rules={{ required: "*Required" }} error={errors.lastName} width='100%' prompt='Last Name' />
                                    </Container>
                                    <TextField color={styles.black} outlineColor={styles.secondaryBlack} name='passportNumber' register={register} rules={{ required: "*Required" }} error={errors.passport} width='100%' prompt='Passport Number' />
                                    <DatePicker name='dateOfBirth' register={register} rules={AttributeRules.dob} error={errors.dateOfBirth} prompt='Date of Birth' width='100%' ></DatePicker>
                                    <Container width="100%" className="no-padding" py={styles.g4} gap={styles.g4} direction="column">
                                        <Button submit className="outline-btn bg-white w-full">Add Traveler</Button>
                                        <Button victor={reservations.length == 0} onClick={()=>{continueReserveSeat()}} className="primary-btn">Continue</Button>
                                    </Container>
                                </Container>
                            </form>
                        </Container>

                        <Container direction="column" width='50%' className="bg-white" gap={styles.g4} >
                            <Label color={styles.black} fontSize={styles.f3xl}>Traveler</Label>
                            <Container  className="no-padding" direction="column" width="100%" height="100%" gap={styles.g4}>
                                {reservations.length == 0 ?
                                    <Container width="100%" center>
                                            <Label color={styles.secondaryWhite}>No travelers yet</Label>
                                    </Container>
                                :
                                    <Container direction="column" width="100%" className="no-padding" gap={styles.g4}>
                                        {reservations?.map((reservation, index) => (
                                            <Button key={index} className="spaced-btn ">
                                                <Label key={index}>{reservation.traveler.firstName} {reservation.traveler.lastName}</Label>
                                                <div onClick={()=>{removeReservation(reservation.traveler)}}>
                                                    <Picture width="25px" src={closeIcon}/>
                                                </div>
                                            </Button>
                                        ))}
                                    </Container>
                                }
                            </Container>
                        </Container>
                    </Container>
                    <Container width="100%" height="25vh"/>
                </Container>
                <Footer/>
            </Container>
        </ProtectedRoute>
    )
}

export default FlightDetails