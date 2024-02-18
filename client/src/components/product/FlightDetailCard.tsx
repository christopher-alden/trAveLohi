import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture"
import Label from "@comp/form/Label"
import { FlightDetail } from "@myTypes/flight.types"
import styles from '@styles/global.module.scss'
import placeholder from '@assets/logo.png'
import Button from "@comp/form/Button"

type FlightDetailProps = {
    height?: string
    flightDetail: FlightDetail
}

function formatDateAndTime(dateInput: Date | undefined): { date: string; time: string } {
    if (!dateInput) {
    return { date: "Unknown date", time: "Unknown time" };
    }

    const date = new Date(dateInput);
    
    const dateString = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });

    const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
    });

    return { date: dateString, time: timeString };
}

const FlightDetailCard = ({height, flightDetail}: FlightDetailProps) =>{
    return(
        <Container direction="column" width="100%" height="350px" className="bg-white" gap={styles.g8}>
            <Container width="100%" height="60px" className="no-padding items-center" gap={styles.g4}>
                <Container className="no-padding" width="50%" height="100%" gap={styles.g4}>
                    <Container width="60px" height="100%" center className="no-padding circle bg-notthatwhite">
                        <Picture width="30px" height="25px" src={placeholder} className="invert-soft"/>
                    </Container>
                    <Container py={styles.g2} height="100%" direction="column" className="no-padding space-between">
                        <Label>
                            {flightDetail.airline?.name}
                        </Label>
                        <Label color={styles.secondaryWhite} fontSize={styles.fsm}>
                            {flightDetail.airplane?.code} - {flightDetail.airplane?.type} | {flightDetail.flightRoute?.flightDuration} minutes
                        </Label>
                    </Container>
                </Container>
                <Container width="50%" className="no-padding items-end justify-end" gap={styles.g2}>
                        <Label color={styles.secondaryWhite}>USD</Label>
                        <Label className="lh-3xl" fontSize={styles.f3xl}>{flightDetail.flightRoute?.price}</Label>
                        <Label className="no-wrap" color={styles.secondaryWhite}>/ person</Label>
                </Container>
            </Container>
            <Container width="100%" height='100%' className="no-padding">
                <Container width="50%" height="100%" className="no-padding" gap={styles.g4}>
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
                <Container direction="column" width="50%" height="100%" className="no-padding items-end justify-end ">
                    
                    <Button className="outline-btn">
                        Book Flight
                    </Button>
                </Container>
            </Container>
            
        </Container>
    )
}

export default FlightDetailCard 