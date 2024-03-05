import Container from "@comp/container/Container";
import Navbar from "@comp/navigation/Navbar";
import RoomDetailCard from "@comp/product/RoomDetailCard";
import { HotelDetailsRoomDetails, HotelReservationPayload, HotelTransactionPayload } from "@myTypes/hotel.types";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getRoomDetails, getRoomDetailsOne } from "src/services/hotelServices";
import styles from '@styles/global.module.scss'
import ProtectedRoute from "src/middleware/ProtectedRoute";
import Label from "@comp/form/Label";
import CustomDatePicker from "@comp/form/CustomDatePicker";
import Button from "@comp/form/Button";
import Footer from "@comp/navigation/Footer";
import { UserContext } from "src/context/userContext";
import { ApiEndpoints } from "@util/api.utils";
import { TransactionType } from "@myTypes/user.types";

const HotelReservation = () =>{

    const {user} = useContext(UserContext)
    const [queryParameters] = useSearchParams()
    const hotelId =  queryParameters.get("hotelId")
    const roomId =  queryParameters.get("roomId")
    const [hotel, setHotel] = useState<HotelDetailsRoomDetails>()
    const [hotelReservation, setHotelReservation] = useState<HotelReservationPayload>({
        checkInTime: new Date(),
        checkOutTime: new Date(),
        hotelId: 0,
        roomDetailId: 0
    })

    const [calculatedPrice, setCalculatePrice] = useState<number>(0);

    const addToCart = async () => {
        console.log("run")
        try {
            const completeTransaction: HotelTransactionPayload = {
                userId: user!.ID!, 
                price: calculatedPrice, 
                transactionDate: new Date(), 
                status: TransactionType.Cart, 
                hotelTransaction: {
                    checkInTime: hotelReservation.checkInTime,
                    checkOutTime: hotelReservation.checkOutTime,
                    hotelId: hotelReservation.hotelId,
                    roomDetailId: hotelReservation.roomDetailId,
                }
            }
            const response = await fetch(ApiEndpoints.HotelCompleteTransactionCreate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeTransaction),
                credentials: 'include',
            });

            const data = await response.json()
            console.log(data.message)


        } catch (error) {
            console.error('Failed to create hotel transaction:', error);
            alert('Failed to create your reservation. Please try again.');
        }
    };

    const {error, isLoading} = useQuery(['getRoomDetails', hotelId], () => getRoomDetailsOne(hotelId, roomId), {
        onSuccess: (data) => {
            // @ts-ignore
            const transformedData:HotelDetailsRoomDetails = {
                ...data, 
                // 🙏🏻tolong udh mepet salah type
                // @ts-ignore
                roomDetails: data.roomDetails?.map((room) => ({
                    ...room, 
                    roomFacilities: { 
                        isFreeWifi: room.isFreeWifi,
                        isFreeBreakfast: room.isFreeBreakfast,
                        isNonSmoking: room.isNonSmoking,
                        isRefundable: room.isRefundable,
                        isReschedule: room.isReschedule,
                    }
                }))
            };
            setHotel(transformedData);
            setHotelReservation({
                ...hotelReservation,
                hotelId:data.ID,
                //@ts-ignore
                roomDetailId:data.roomDetails[0].ID,
            })
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const updateCheckInTime = useCallback((newCheckInTime: Date) => {
        if (newCheckInTime < new Date()) {
            alert("Check-in date must be in the future.");
            return;
        }
        else if (hotelReservation.checkOutTime && newCheckInTime >= hotelReservation.checkOutTime) {
            alert("Check-in date must be before check-out date.");
            return;
        }
        else{
            setHotelReservation((currentReservation) => ({
                ...currentReservation,
                checkInTime: newCheckInTime,
            }));
        }
        
    }, [hotelReservation.checkOutTime]);
    
    const updateCheckOutTime = useCallback((newCheckOutTime: Date) => {
        if (newCheckOutTime <= hotelReservation.checkInTime) {
            alert("Check-out date must be after check-in date.");
            return;
        }
        else{
            setHotelReservation((currentReservation) => ({
                ...currentReservation,
                checkOutTime: newCheckOutTime,
            }));
        }
        
    }, [hotelReservation.checkInTime]);
    
    

    useEffect(() => {
        if (hotelReservation.checkInTime && hotelReservation.checkOutTime && hotel?.roomDetails[0]) {
            const nights = (hotelReservation.checkOutTime.getDay() - hotelReservation.checkInTime.getDay())
            console.log(nights)
            setCalculatePrice(nights * hotel.roomDetails[0].price);
        }
    }, [hotelReservation.checkInTime, hotelReservation.checkOutTime]);
    

    if(isLoading)return <></>
    return(
        <ProtectedRoute>
            <Container px='0px' py='0px' direction='column' width='100%' height="fit-content" className={`bg-notthatwhite`}>
                <Navbar/>
                <Container direction="column" width="100%" height="100%" className="push-navbar min-h-full" gap={styles.g8}>
                    <Container className="no-padding items-end" gap={styles.g2}>
                        <Label color={styles.secondaryWhite} className="lh" fontSize={styles.fxl}>Hotels</Label>
                        <Label color={styles.secondaryWhite} className="lh" fontSize={styles.fxl}>/</Label>
                        <Label color={styles.secondaryWhite} className="lh" fontSize={styles.fxl}>{hotel?.name}</Label>
                        <Label color={styles.secondaryWhite} className="lh" fontSize={styles.fxl}>/</Label>
                        <Label className="lh-5xl" fontSize={styles.f5xl}>Hotel Reservation</Label>
                    </Container>
                    {hotel &&
                        <>
                        <RoomDetailCard isDisplayOnly roomDetail={hotel.roomDetails[0]}/>
                        <hr/>
                        </>
                    }
                    <Container width="35%" className="no-padding space-between" direction="row">
                        <Container className="no-padding" direction="column">
                            <Label>Check-In</Label>
                            <CustomDatePicker restrictDate mainTheme  setTime={updateCheckInTime}/>
                        </Container>
                        <Container className="no-padding" direction="column">
                            <Label>Check-Out</Label>
                            <CustomDatePicker restrictDate mainTheme  setTime={updateCheckOutTime}/>
                        </Container>
                    </Container>
                    <Container width="100%" height="5vh"/>
                    <Container direction="column" width='50%' className="no-padding" gap={styles.g8}>
                                <Label className="lh-3xl " fontSize={styles.f3xl}>Summary</Label>
                                <Container width="100%" className="space-between items-end no-padding">
                                    <Label>Total Price</Label>
                                    <Label fontSize={styles.f3xl}>USD {calculatedPrice}</Label>

                                </Container>
                                <Container direction="column" width="100%" className="no-padding" gap={styles.g4}>
                                    <Button onClick={addToCart} className="outline-btn w-full">
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

export default HotelReservation