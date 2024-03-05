import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture"
import { Hotel } from "@myTypes/hotel.types"
import styles from "@styles/global.module.scss"
import placeholder from '@assets/mogged.jpg'
import Label from "@comp/form/Label"
import pin from '@icons/pin-icon.png'
import Button from "@comp/form/Button"
import { useNavigate } from "react-router-dom"

type HotelCardProps = {
    height?: string
    hotel: Hotel | null
    isDisplayOnly?: boolean
}

const HotelCard = ({height, hotel, isDisplayOnly}:HotelCardProps) =>{
    const navigate = useNavigate()
    const detailBuilder = (id:number) =>{
        console.log(id)
        return `/explore/hotel-details?hotelId=${encodeURIComponent(id)}`
    }
    return(
        <Container direction="row" width="100%" height="375px" className="bg-notthatwhite no-padding no-br"  gap={styles.g8}>
            {hotel &&
                <>
                    <Picture height="100%" width="50%" src={hotel.images[0] || placeholder}/>
                    <Container className="no-padding space-between" direction="column" py="0px" height="100%" width="50%" gap={styles.g4}>
                        <Container height="50%" gap={styles.g4} direction="column" className="no-padding">
                            <Label fontSize={styles.f3xl} className="lh-3xl" color={styles.black}>{hotel.name}</Label>
                            <Container height="40%" className="no-padding" gap={styles.g4} center>
                                <Container gap={styles.g2} height="100%" className="items-start no-padding" direction="column">
                                    <Label >Rating</Label>
                                    <Container className="no-padding items-end">
                                        <Label className="lh-3xl" fontSize={styles.f3xl}>4.3</Label>
                                        <Label color={styles.secondaryWhite}>/5</Label>
                                    </Container>
                                </Container>
                                <Container className="no-padding bg-secondaryWhite" height="90%" width="5px"  ></Container>
                                <Container gap={styles.g2} height="100%" className="no-padding" direction="column">
                                    <Label color={styles.black}>{hotel.city.name}, {hotel.city.country?.name}</Label>
                                    <Label className="line-clamp-2" fontSize={styles.fsm} color={styles.secondaryWhite}>{hotel.address}</Label>
                                </Container>
                            </Container>
                        </Container>

                        <Container width="100%" gap={styles.g4} className="no-padding" direction="column">
                            <Container px="0px" className="no-padding" width="80%">
                                <Label color={styles.secondaryWhite} className="line-clamp-3">{hotel.description}</Label>
                            </Container>
                            <Button onClick={()=>{navigate(detailBuilder(hotel.ID))}} className="outline-btn">Book Hotel</Button>
                        </Container>
                    </Container>
                    
                </>
            }
        </Container>
    )
}


export default HotelCard