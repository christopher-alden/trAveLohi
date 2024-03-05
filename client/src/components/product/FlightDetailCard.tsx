import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture"
import Label from "@comp/form/Label"
import { FlightDetail } from "@myTypes/flight.types"
import styles from '@styles/global.module.scss'
import placeholder from '@assets/logo.png'
import Button from "@comp/form/Button"
import { useNavigate } from "react-router-dom"
import { formatDateAndTime } from "src/services/tolong"

type FlightDetailProps = {
    height?: string
    flightDetail: FlightDetail | null
    isDisplayOnly?: boolean
    availableSeatCount? : number
}

const FlightDetailCard = ({height, flightDetail, isDisplayOnly=false, availableSeatCount}: FlightDetailProps) =>{
    const navigate = useNavigate();
    const detailBuilder = (id:number) =>{
        console.log(id)
        return `/explore/flight-details?flightId=${encodeURIComponent(id)}`
    }

    return(
        <Container direction="column" width="100%" height="375px" className="bg-white no-br" gap={styles.g4}>
            {flightDetail &&
                <>
                    <Container width="100%" height="60px"  className="no-padding items-center" gap={styles.g4}>
                    <Container className="no-padding" width="50%" height="100%" gap={styles.g4}>
                        <Container width="60px" height="100%" center className="no-padding circle bg-notthatwhite">
                            <Picture width="30px" height="25px" src={placeholder} className="invert-soft"/>
                        </Container>
                        <Container  height="100%" direction="column" className="no-padding">
                            <Label className="lh">
                                {flightDetail.airline?.name}
                            </Label>
                            <Label color={styles.secondaryWhite}>
                                {flightDetail.airplane?.code} - {flightDetail.airplane?.type} | {flightDetail.flightRoute?.flightDuration} minutes
                            </Label>
                        </Container>
                    </Container>
                    <Container width="50%" className="no-padding items-end justify-end" gap={styles.g16}>
                            {availableSeatCount && 
                                <Container gap={styles.g1} direction="row" className="no-padding items-end">
                                    <Label className="lh-3xl" fontSize={styles.f3xl}>{availableSeatCount}</Label>
                                    <Label color={styles.secondaryWhite}>seats available</Label>
                                </Container>
                            }
                            <Container gap={styles.g1} className="no-padding items-end  justify-end">
                                <Label  color={styles.secondaryWhite} >USD</Label>
                                <Label className="lh-3xl" fontSize={styles.f3xl}>{flightDetail.flightRoute?.price}</Label>
                                <Label className="no-wrap" color={styles.secondaryWhite} >/person</Label>
                            </Container>
                    </Container>
                </Container>
                <Container width="100%" height='80%' py={styles.g4} className="no-padding">
                    <Container width="50%" height="100%" className="no-padding" gap={styles.g4}>
                        <Container height="100%" width="80px" center direction="column"  gap={styles.g2} className="no-padding space-between items-end">
                            <Container direction="column" className="no-padding items-end">
                                <Label color={styles.black}>{formatDateAndTime(flightDetail.flightTime?.departureTime).time}</Label>
                                <Label color={styles.secondaryWhite}>{formatDateAndTime(flightDetail.flightTime?.departureTime).date}</Label>
                            </Container>
                            <Container direction="column" className="no-padding items-end">
                                <Label color={styles.black}>{formatDateAndTime(flightDetail.flightTime?.arrivalTime).time}</Label>
                                <Label color={styles.secondaryWhite}>{formatDateAndTime(flightDetail.flightTime?.arrivalTime).date}</Label>
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
                                <Label color={styles.secondaryWhite}>{flightDetail.flightRoute?.departure.name}</Label>
                            </Container>
                            <Container direction="column" className="no-padding">
                                <Label color={styles.black}>{flightDetail.flightRoute?.arrival.city?.name}</Label>
                                <Label color={styles.secondaryWhite}>{flightDetail.flightRoute?.arrival.name}</Label>
                            </Container>
                        </Container>
                    </Container>
                    <Container direction="row" width="50%" height="100%" className="no-padding items-end justify-end " gap={styles.g4}>
                        {!isDisplayOnly && 
                            <Button onClick={()=>{navigate(detailBuilder(flightDetail.ID))}} className="outline-btn bg-white">
                                Book Flight
                            </Button>
                        }
                    </Container>
                </Container>
            </>
            }
        </Container>
    )
}

export default FlightDetailCard 