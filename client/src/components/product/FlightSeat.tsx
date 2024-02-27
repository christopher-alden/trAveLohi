import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getSeatDetail } from "src/services/locationServices";
import { useReservation } from "src/context/reservationContext";
import { FlightReservation, SeatDetail, SeatClass } from "@myTypes/flight.types";
import styles from '@styles/global.module.scss'
import fs from '@styles/variables/flightseat.module.scss'
import Container from "@comp/container/Container";
import Label from "@comp/form/Label";
import Button from "@comp/form/Button";

type FlightSeatProps = {
    flightId: number,
    reservation: FlightReservation,
    seatClass: SeatClass
};

const FlightSeat = ({ flightId, reservation, seatClass }: FlightSeatProps) => {
    const [seats, setSeats] = useState<SeatDetail[]>([]);
    const { reservations, updateSeatInReservation } = useReservation();

    const { isLoading: seatLoading } = useQuery(['getSeatDetail', flightId], () => getSeatDetail(flightId), {
        onSuccess: (data: any) => {
            console.log(data)
            setSeats(data.map((entry: any) => ({
                ID: entry.ID,
                airplaneId: entry.airplaneId,
                class: entry.class,
                code: entry.code,
                isAvailable: entry.isAvailable,
            })));
        },
    });

    const isSeatReserved = (seatId: number) => {
        return reservations.some(rsvp => rsvp.seat?.ID === seatId);
    };

    const groupedSeats = useMemo(() => {
        return seats.reduce((acc: Record<string, SeatDetail[]>, seat: SeatDetail) => {
            (acc[seat.class] = acc[seat.class] || []).push(seat);
            return acc;
        }, {});
    }, [seats]);


    if (seatLoading) return <></>;
    return (
        <Container width="100%" height="100%" gap={styles.g4} direction="column" className={`no-padding no-br `}>
            {Object.entries(groupedSeats).map(([className, ss]) => (
                <Container width="100%" className={`no-padding`}  direction="column" gap={styles.g4} key={className} >
                    <Label fontSize={styles.fxl}>{className}</Label>
                    <Container width="100%" className={`no-padding no-br ${fs.seatGrid}`} >
                        {ss.map((seat: SeatDetail) => {
                            const chosen = isSeatReserved(seat.ID);
                            return (
                                <Button
                                    key={seat.ID}
                                    onClick={() => { if(seat.class === seatClass && seat.isAvailable && !chosen) updateSeatInReservation(reservation.traveler, seat); }}
                                    victor={seat.class !== seatClass || !seat.isAvailable || chosen}
                                    className={`primary-btn ${fs.seatButton} ${reservation.seat?.ID === seat.ID ? fs.currentPicked : chosen ? fs.picked : ''} ${seat.isAvailable ? fs.available : fs.unavailable}`}
                                >
                                    {seat.code}
                                </Button>
                            );
                        })}
                    </Container>
                </Container>
            ))}
        </Container>
    );
};

export default FlightSeat;
