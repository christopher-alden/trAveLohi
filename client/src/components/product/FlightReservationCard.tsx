import Container from "@comp/container/Container"
import Dialog from "@comp/container/Dialog"
import Button from "@comp/form/Button"
import FormlessDropdown from "@comp/form/FormlessDropdown"
import Label from "@comp/form/Label"
import { AddOnBaggage, FlightDetail, FlightReservation, SeatClass } from "@myTypes/flight.types"
import styles from '@styles/global.module.scss'
import { useState } from "react"
import { formatDateAndTime } from "src/services/tolong"
import FlightSeat from "./FlightSeat"
import { useReservation } from "src/context/reservationContext"

type FlightReservationCardProps = {
    reservation: FlightReservation
    flightDetail : FlightDetail
}

const FlightReservationCard = ({reservation, flightDetail}: FlightReservationCardProps) =>{
    const [openSeat, setOpenSeat] = useState<boolean>(false);
    const [chosenSeatClass, setChosenSeatClass] = useState(Object.values(SeatClass)[0]); 
    const {updateSeatInReservation} = useReservation()

    const changeSeatClass = (seatClass:SeatClass) =>{
        setChosenSeatClass(seatClass)
        updateSeatInReservation(reservation.traveler, undefined)
    }
    const dob = new Date(reservation.traveler.dateOfBirth);
    return(
        <>
            <Container width="100%" height="375px" className={`bg-white `} direction="row" gap={styles.g4}>
                <Container width="20%" className="no-padding" direction="column" gap={styles.g8}>
                    <Label fontSize={styles.fxl}>Traveler</Label>
                    <Container className="no-padding" width="100%" direction="column" gap={styles.g4}>
                        <Container className="no-padding" direction="column">
                            <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Registered Name</Label>
                            <Label>{reservation.traveler.firstName} {reservation.traveler.lastName}</Label>
                        </Container>
                        <Container className="no-padding" direction="column">
                            <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Passport Number</Label>
                            <Label>{reservation.traveler.passportNumber}</Label>
                        </Container>
                        <Container className="no-padding" direction="column">
                            <Label color={styles.secondaryWhite} fontSize={styles.fsm}>Date of Birth</Label>
                            <Label>{dob.toLocaleDateString()}</Label>
                        </Container>
                    </Container>
                </Container>
                <hr className="hr-y"/>
                <Container width="80%" height="100%" className="no-padding" direction="column" gap={styles.g4}>
                    {flightDetail &&
                        <Container width="100%" height="100%" className="no-padding space-between">
                            <Container width="50%" height="100%" className="no-padding" direction="column" gap={styles.g8}>
                                <Label fontSize={styles.fxl}>{flightDetail.airline?.name} [{flightDetail.airplane?.code}] - {flightDetail.airplane?.type}</Label>
                                <Container width="100%" height="100%" className="no-padding">
                                    <Container width="100%" height="100%"  className="no-padding" gap={styles.g4}>
                                        <Container height="100%" width="80px" center direction="column"  gap={styles.g2} className="no-padding space-between items-end">
                                            <Container direction="column" className="no-padding items-end">
                                                <Label color={styles.black}>{formatDateAndTime(flightDetail.flightTime?.departureTime).time}</Label>
                                                <Label fontSize={styles.fsm} color={styles.secondaryWhite}>{formatDateAndTime(flightDetail.flightTime?.departureTime).date}</Label>
                                            </Container>
                                            <Container direction="column" className="no-padding items-end">
                                                <Label color={styles.black}>{formatDateAndTime(flightDetail.flightTime?.arrivalTime).time}</Label>
                                                <Label fontSize={styles.fsm} color={styles.secondaryWhite}>{formatDateAndTime(flightDetail.flightTime?.arrivalTime).date}</Label>
                                            </Container>
                                        </Container>

                                        <Container height="100%" center direction="column" gap={styles.g2} className="no-padding space-between">
                                            <Label fontSize={styles.f3xl} color={styles.black}>{flightDetail.flightRoute?.departure.code}</Label>
                                                <hr className="flight-path"></hr>
                                            <Label fontSize={styles.f3xl} color={styles.black}>{flightDetail.flightRoute?.arrival.code}</Label>
                                        </Container>

                                        <Container height="100%" center direction="column"  gap={styles.g2} className="no-padding space-between items-start">
                                            <Container direction="column" className="no-padding">
                                                <Label color={styles.black}>{flightDetail.flightRoute?.departure.city?.name}</Label>
                                                <Label fontSize={styles.fsm} color={styles.secondaryWhite}>{flightDetail.flightRoute?.departure.name}</Label>
                                            </Container>
                                            <Container direction="column" className="no-padding">
                                                <Label color={styles.black}>{flightDetail.flightRoute?.arrival.city?.name}</Label>
                                                <Label fontSize={styles.fsm} color={styles.secondaryWhite}>{flightDetail.flightRoute?.arrival.name}</Label>
                                            </Container>
                                        </Container>
                                    </Container>
                                </Container>
                            </Container>
                            
                            <Container className="no-padding" width="30%" height="100%" direction="column" gap={styles.g8}>
                                <Label fontSize={styles.fxl}>Seat Details</Label>
                                <Container width="100%" height="100%" className="no-padding space-between"  direction="column">
                                    <Container className="no-padding" direction="column" width="100%" gap={styles.g4}>
                                        <FormlessDropdown onChange={changeSeatClass} name='class' width='100%' prompt='Class' options={Object.values(SeatClass)}></FormlessDropdown>
                                        <FormlessDropdown onChange={()=>{}} name='addOnBaggage' width='100%' prompt='Add On Baggage' options={Object.values(AddOnBaggage)}></FormlessDropdown>
                                    </Container>
                                    <Container width="100%" gap={styles.g1} direction="row" className="no-padding items-end space-between">
                                        <Container className="no-padding items-end" gap={styles.g4}>
                                            <Label fontSize={styles.fsm}>Seat</Label>
                                            <Label className="lh-3xl" fontSize={styles.f3xl}>{reservation.seat?.code}</Label>
                                        </Container>
                                        <Button onClick={()=>{setOpenSeat(!openSeat)}} className='outline-btn bg-white'>Choose Seat</Button>
                                    </Container>
                                </Container>
                            </Container>
                        </Container>
                    }
                </Container>
            </Container>
            {openSeat&&
                <Dialog open={true} title='Choose Seat' onClose={()=>{setOpenSeat(false)}}>
                    <FlightSeat reservation={reservation} flightId={flightDetail.ID} seatClass={chosenSeatClass}/>
                </Dialog>
            }
        </>
    )
}

export default FlightReservationCard