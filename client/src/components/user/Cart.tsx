import Container from "@comp/container/Container"
import Dialog from "@comp/container/Dialog";
import Button from "@comp/form/Button";
import CustomDatePicker from "@comp/form/CustomDatePicker";
import Label from "@comp/form/Label"
import FlightReservationCard from "@comp/product/FlightReservationCard";
import { FlightDetail, FlightReservation } from "@myTypes/flight.types";
import { HotelCart } from "@myTypes/hotel.types";
import styles from '@styles/global.module.scss'
import { ApiEndpoints } from "@util/api.utils";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { UserContext } from "src/context/userContext";

const Cart = () =>{
    const {user, loading:userLoading} =useContext(UserContext)
    const [modeToggle, setModeToggle] = useState('flights');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const[ selectedReservationCode, setSelectedReservationCode] = useState<string>('')


    const [hotelCarts, setHotelCarts] = useState<any>([])
    const [flightCarts, setFlightCarts] = useState<any>([])
    const getHotelCart = async (limit = 10, offset = 0) => {
        const response = await fetch(`${ApiEndpoints.GetCart}?mode=${modeToggle}&limit=${limit}&offset=${offset}&userID=${user?.ID}`);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const { data, error, isLoading } = useQuery(['hotelCart',modeToggle], () => getHotelCart(),{
        retry: false,
        onSuccess: (data)=>{
            if(modeToggle =='hotels'){
                setHotelCarts(data)
            }
            if(modeToggle =='flights'){
                setFlightCarts(data)
            }
        }
    });
    
    
    const handleModeToggle = (mode:any) => { 
        if (mode === 'hotels'){
            // navigate('/explore/hotels')
        }
        setModeToggle(mode);
    };

    const isExpired = (checkDate:any) => {
        const today = new Date();
        const wtf = new Date(checkDate);
        return wtf < today;
    };
    

    const totalPrice = () =>{
        let final=0
        if(modeToggle == 'hotels'){
            for(const cart of hotelCarts){
                final += cart.userTransaction.price
            }
        }
        else if(modeToggle == 'flights'){
            for(const cart of flightCarts){
                final += cart.userTransaction.price
            }
        }
        return final
    }

    const handlePayment = async (paymentMode:string) => {
        setIsDialogOpen(false);
        // Assuming you have the paidAmount somewhere in your component's state or props
        const paidAmount = 100; // Example amount
        try {
            const response = await fetch(ApiEndpoints.HotelPay, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reservationCode: selectedReservationCode,
                    paidAmount,
                    mode: paymentMode,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to change hotel transaction status");
            }
            const data = await response.json();
            console.log("Transaction status updated successfully:", data);
            // Additional success handling...
        } catch (error) {
            console.error("Error changing hotel transaction status:", error);
            // Error handling...
        }
    };
    const handleBookNow = (reservationCode:string) => {
        setSelectedReservationCode(reservationCode);
        setIsDialogOpen(true);
    };

    console.log(flightCarts)
    if (isLoading || userLoading) return <div>Loading...</div>;
    return(
        <>
        <Container gap={styles.g8} direction="column" className="no-padding" height="100%" width="100%">
            <div  className=" gap-2 toggle-container items-center" >
                <Container className="no-padding" gap={styles.g2}>
                    <Label className="lh-5xl ls-5xl" onClick={() => handleModeToggle('flights')} fontSize={styles.f5xl} color={modeToggle === 'flights' ? styles.black : styles.secondaryWhite}>Flights</Label>
                    <Label className="lh-5xl ls-5xl" fontSize={styles.f5xl} color={styles.secondaryWhite}>|</Label>
                    <Label className="lh-5xl ls-5xl" onClick={() => handleModeToggle('hotels')} fontSize={styles.f5xl} color={modeToggle === 'hotels' ? styles.black : styles.secondaryWhite}>Hotels</Label>
                </Container>
            </div>
            <Container width="100%" direction="column" className="no-padding" gap={styles.g4}>
                {modeToggle == 'hotels' &&
                    <>
                        {hotelCarts.map((hotelCart:any, index:number)=>{
                            const expired = isExpired(hotelCart.checkinTime)
                            return(
                                <React.Fragment key={index}>
                                    <Container height="250px" width="100%" className="space-between">
                                        <Container height="100%" width="60%" className="no-padding">
                                            <Container direction="column" height="100%" width="50%"  className="no-padding space-between" gap={styles.g2}>
                                                <Container direction="column" className="no-padding">
                                                    <Label fontSize={styles.f3xl} color={styles.black}>{hotelCart.hotel.name}</Label>
                                                </Container>
                                                <Label fontSize={styles.f3xl} color={styles.black}>USD {hotelCart.userTransaction.price}</Label>
                                            </Container>
                                            <hr className="hr-y"/>
                                            <Container direction="column" px={styles.g4} className="no-padding" width="50%">
                                                <Label color={styles.black}>Check In: {new Date(hotelCart.checkInTime).toISOString().split('T')[0]}</Label>
                                                <Label color={styles.black}>Check Out: {new Date(hotelCart.checkOutTime).toISOString().split('T')[0]}</Label>
                                                <Label color={styles.black}>{hotelCart.roomDetail.name}</Label>
                                                <Label color={styles.black}>{hotelCart.roomDetail.guest} Guest</Label>
                                                <Label color={styles.black}>{hotelCart.roomDetail.area} m2</Label>
                                            </Container>
                                        </Container>
                                        <Container height="100%" direction="column" className="no-padding space-between items-end ">
                                            <Container className="no-padding justify-end items-end" direction="column">
                                                <Label color={styles.black}>{hotelCart.reservationCode}</Label>
                                                <Label color={styles.black}>{new Date(hotelCart.userTransaction.transactionDate).toISOString().split('T')[0]}</Label>
                                                <Label color={ expired ? styles.error : styles.black}>{expired ? 'Expired' : 'Active'}</Label>
                                            </Container>
                                            <Container className="no-padding" gap={styles.g4}>
                                                <Button className="outline-btn">
                                                    Update Details
                                                </Button>
                                                <Button onClick={() => handleBookNow(hotelCart.reservationCode)} className="primary-btn">
                                                    Book Now
                                                </Button>
                                            </Container>
                                        </Container>
                                    </Container>
                                    <hr/>
                                </React.Fragment>
                            )
                        })}
                    </>
                }
                {!isLoading && modeToggle == 'flights' &&
                    <>
                        {flightCarts.map((flightCart:any, index:number)=>{
                            
                            const reservation:FlightReservation= {
                                traveler:flightCart.traveler,
                                seat: flightCart.seatDetail
                            }
                            const flightDetail:FlightDetail ={
                                ID: flightCart.ID,
                                flightRoute: {
                                    ...flightCart.flight.flightRoute,
                                    arrival:{
                                        ...flightCart.flight.flightRoute.arrivalAirport
                                    },
                                    departure:{
                                        ...flightCart.flight.flightRoute.departureAirport
                                    },
                                },
                                flightTime:{
                                    departureTime:new Date(flightCart.flight.departureTime),
                                    arrivalTime:new Date(flightCart.flight.arrivalTime)
                                },
                                airline:{
                                    ...flightCart.flight.airline
                                },
                                airplane:{
                                    ...flightCart.flight.airplane
                                },
                                status:flightCart.flight.status
                            }
                            return(
                                <React.Fragment key={index}>
                                    <FlightReservationCard price={flightCart.userTransaction.price} baggage={flightCart.baggage} displayOnly  flightDetail={flightDetail} reservation={reservation}></FlightReservationCard>
                                </React.Fragment>
                            )
                        })}
                    </>
                }
            </Container>
            <Label fontSize={styles.f3xl}>Total Price: {totalPrice()}</Label>
            
        </Container>
        {isDialogOpen && (
                <Dialog
                    open={isDialogOpen}
                    title="Choose Payment Method"
                    onClose={() => setIsDialogOpen(false)}
                >
                    <Container direction="column" gap="10px">
                        <Button onClick={() => handlePayment("credit")}>Pay with Credit Card</Button>
                        <Button onClick={() => handlePayment("wallet")}>Pay with Wallet</Button>
                    </Container>
                </Dialog>
            )}
        </>
    )

}

export default Cart