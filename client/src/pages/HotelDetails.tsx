import { useSearchParams } from "react-router-dom"
import styles from '@styles/global.module.scss'
import ProtectedRoute from "src/middleware/ProtectedRoute"
import Navbar from "@comp/navigation/Navbar"
import Container from "@comp/container/Container"
import Footer from "@comp/navigation/Footer"
import { useQuery } from "react-query"
import { getRoomDetails } from "src/services/hotelServices"
import { Facility, Hotel, HotelDetailsRoomDetails, RoomDetail } from "@myTypes/hotel.types"
import Picture from "@comp/container/Picture"
import { useState } from "react"
import Label from "@comp/form/Label"
import ss from '@styles/variables/slideshow.module.scss';
import Slider from "@comp/product/Slider"
import RoomDetailCard from "@comp/product/RoomDetailCard"

const HotelDetails = () =>{
    const [queryParameters] = useSearchParams()
    const hotelId =  queryParameters.get("hotelId")
    const [hotel, setHotel] = useState<HotelDetailsRoomDetails>()

    const {error, isLoading} = useQuery(['getRoomDetails', hotelId], () => getRoomDetails(hotelId), {
        onSuccess: (data) => {
            console.log(data)
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
            console.log(transformedData);
            setHotel(transformedData);
        },
        onError: (error) => {
            console.error(error);
        },
    });
    

    // console.log(hotel)
    if (isLoading)return <></>
    return(
        <ProtectedRoute>
            <Container direction='column' width='100vw' height="100%" className="no-padding bg-notthatwhite">
                <Navbar/>
                {hotel &&
                    <Container className={`no-padding  ${ss.slideshowInfoContainer} `}width="100%" height='80vh' >
                        <Container className="no-padding abs top-bottom-gradient z1" width="100%" height="100%"></Container>
                        <Picture className="newdim abs " width="100%" src={hotel.images[0]}/>
                        <Container width='100%' height='fit-content' direction='column' gap={styles.g2}  className={`z1 ${ss.slideshowInfoHeader} `}>
                            <Container direction='column' px='0px' py='0px' >
                                <Label  color={styles.white} fontSize={styles.f3xl}>{hotel.city.name}, {hotel.city.country?.name}</Label>
                                <Label className='lh-8xl ls-8xl'  color={styles.white} fontSize={styles.f8xl}>{hotel.name}</Label>
                            </Container>
                            <Label color={styles.white} fontSize={styles.fxl}>{hotel.address}</Label>
                        </Container>

                    </Container>
                }
                <Container direction="column" gap={styles.g64} width="100%" height="100%" className="push-navbar min-h-full">
                    {hotel &&
                        <>
                            <Container className="no-padding" width="100%"  gap={styles.g24}>
                                <Container className="no-padding" width="30%">
                                    <Label fontSize={styles.f3xl}>About {hotel.name}</Label>
                                </Container>
                                <Container className="no-padding" width="70%">
                                    <Label color={styles.secondaryWhite} fontSize={styles.fxl}>{hotel.description}</Label>
                                </Container>
                            </Container>
                            <Container className="no-padding" width="100%"  direction="column" gap={styles.g4}>
                                <Slider gap={styles.g8} label="Place">
                                    {hotel.images?.map((image, index)=>{
                                        return(
                                            <Picture key={index} className="newdim-soft" width="600px" height="400px" src={image}></Picture>
                                        )
                                    })}
                                </Slider>
                            </Container>
                            <Container className="no-padding" width="100%" height="40vh" direction="row" gap={styles.g24}>
                                <Container className="no-padding" width="30%">
                                    <Label className="lh-5xl" fontSize={styles.f5xl}>Facilities</Label>
                                </Container>
                                <Container height="80%" width="70%" className="no-padding wrap" direction="column" gap={styles.g24}>
                                    {hotel.facilities?.map((facility, index)=>{
                                        return(
                                            <Container  key={index} className="no-padding">
                                                <Label  fontSize={styles.fxl}>{facility.name}</Label>
                                            </Container>
                                        )
                                    })}
                                </Container>
                            </Container>
                            <Container className="no-padding" width="100%" direction="column" gap={styles.g16}>
                                <Container className="no-padding" width="30%">
                                    <Label className="lh-5xl" fontSize={styles.f5xl}>Suites</Label>
                                </Container>
                                <Container  width="100%" className="no-padding wrap" direction="column" gap={styles.g16}>
                                    {hotel.roomDetails?.map((room, index)=>{
                                        return(
                                            <>
                                            <RoomDetailCard key={index} roomDetail={room}/>
                                            <hr/>
                                            </>
                                        )
                                    })}
                                </Container>
                            </Container>
                        </>
                    }
                </Container>
                <Container width="100%" height="25vh"/>
                <Footer/>
            </Container>
        </ProtectedRoute>
    )
}

export default HotelDetails