import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture"
import Button from "@comp/form/Button"
import Label from "@comp/form/Label"
import { RoomDetail } from "@myTypes/hotel.types"
import styles from '@styles/global.module.scss'
import { useNavigate, useSearchParams } from "react-router-dom"


type RoomDetailCardProps = {
    roomDetail: RoomDetail
    isDisplayOnly? :boolean
}

const RoomDetailCard = ({roomDetail, isDisplayOnly}:RoomDetailCardProps) =>{

    const [queryParameters] = useSearchParams()
    const flightId =  queryParameters.get("hotelId")
    const navigate = useNavigate()

    const continueReserveRoom = () =>{
        navigate(`/explore/hotel-details/hotel-reservation?hotelId=${flightId}&roomId=${roomDetail.ID}`)
    }   

    return(
        <Container direction="row" width="100%" height="450px" className="no-padding no-br" gap={styles.g16}>
            <Container className="no-padding" width="50%" height="100%" gap={styles.g4}>
                <Container className="no-padding" width="75%" height="100%">
                    <Picture className="newdim-soft" width='100%' height="100%" src={roomDetail.images[0]}/>
                </Container>
                <Container width="25%" height="100%" className="no-padding" direction="column" gap={styles.g4}>
                    {roomDetail.images.slice(1,4).map((image,index)=>{
                        return(
                            <Picture key={index} className="newdim-soft" width="100%" src={image}></Picture>
                        )
                    })}
                </Container>
            </Container>
            <Container height="100%" width="40%" direction="column" className="no-padding space-between" gap={styles.g8}>
                <Container className="no-padding" width="100%" height="70%" direction="column" gap={styles.g4}>
                    <Container className="no-padding" direction="column">
                        <Label className="lh-3xl" color={styles.black} fontSize={styles.f3xl}>{roomDetail.name}</Label>
                        <Label className="lh-3xl" color={styles.black} fontSize={styles.fxl}>{roomDetail.bed}</Label>
                    </Container>

                    

                    <Container className="no-padding space-between" py={styles.g4} width="100%" >
                        <Container className="no-padding" direction="column">
                            <Label>Capacity</Label>
                            <Label className="lh-3xl" fontSize={styles.f3xl}>{roomDetail.guest}</Label>
                        </Container>
                        <Container className="no-padding" direction="column">
                            <Label>Area</Label>
                            <Container className="no-padding items-end" >
                                <Label className="lh-3xl" fontSize={styles.f3xl}>{roomDetail.area}</Label>
                                <Label>m2</Label>
                            </Container>
                        </Container>
                        <Container className="no-padding" direction="column">
                            <Label>Available Rooms</Label>
                            <Label className="lh-3xl" fontSize={styles.f3xl}>{roomDetail.allocation}</Label>
                        </Container>
                    </Container>
                    <Container width="100%"  className="no-padding space-between">
                        <Label color={roomDetail.roomFacilities.isFreeBreakfast ? styles.black : styles.secondaryWhite}>Free Breakfast</Label>
                        <Label color={roomDetail.roomFacilities.isFreeWifi ? styles.black : styles.secondaryWhite}>Free Wifi</Label>
                        <Label color={roomDetail.roomFacilities.isNonSmoking ? styles.black : styles.secondaryWhite}>Non Smoking</Label>
                        <Label color={roomDetail.roomFacilities.isRefundable ? styles.black : styles.secondaryWhite}>Refundable</Label>
                        <Label color={roomDetail.roomFacilities.isReschedule ? styles.black : styles.secondaryWhite}>Reschedule</Label>
                    </Container>
                </Container>

                

                <Container width="100%"  className="no-padding items-end space-between">
                    <Container className="no-padding items-end">
                        <Label className="lh-3xl" fontSize={styles.f3xl}>{roomDetail.price}</Label>
                        <Label>/night</Label>
                    </Container>
                    {!isDisplayOnly &&
                        <Button onClick={continueReserveRoom} className="outline-btn">Book now</Button>
                    }
                </Container>
            </Container>
        </Container>
    )

}

export default RoomDetailCard