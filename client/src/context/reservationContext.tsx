import React, { createContext, useContext, useEffect, useState } from "react";
import { FlightReservation, SeatDetail } from "@myTypes/flight.types";
import { Traveler } from "@myTypes/user.types";

interface ReservationContextType {
    reservations: FlightReservation[];
    addReservation: (reservation: FlightReservation) => void;
    removeReservation: (traveler: Traveler) => void;
    updateTravelerInReservation: (traveler: Traveler, updatedTraveler: Traveler) => void;
    updateSeatInReservation: (traveler: Traveler, updatedSeat: SeatDetail | undefined) => void;
    resetSeat: ()=>void
    finishTransaction: ()=>void
}

const ReservationContextDefaultValues: ReservationContextType = {
    reservations: [],
    addReservation: () => {},
    removeReservation: () => {},
    updateTravelerInReservation: () => {},
    updateSeatInReservation: () => {},
    resetSeat: () => {},
    finishTransaction: ()=>{}
};

const ReservationContext = createContext<ReservationContextType>(ReservationContextDefaultValues);

export const useReservation = () => useContext(ReservationContext);

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reservations, setReservations] = useState<FlightReservation[]>([]);

    const addReservation = (reservation: FlightReservation) => {
        setReservations(prev => [...prev, reservation]);
    };

    const removeReservation = (traveler: Traveler) => {
        setReservations(prev => prev.filter(reservation => reservation.traveler !== traveler));
    };

    const updateTravelerInReservation = (traveler: Traveler, updatedTraveler: Traveler) => {
        setReservations(prev =>
            prev.map(reservation =>
                reservation.traveler === traveler ? { ...reservation, traveler: updatedTraveler } : reservation
            )
        );
    };

    const updateSeatInReservation = (traveler: Traveler, updatedSeat: SeatDetail | undefined) => {
        setReservations(prev =>
            prev.map(reservation =>
                reservation.traveler === traveler ? { ...reservation, seat: updatedSeat } : reservation
            )
        );
    };

    const resetSeat = () =>{
        setReservations(prev =>
            prev.map(
                reservation => (
                    reservation = {...reservation , seat: undefined}
                )
            )
        )
    }

    const finishTransaction = () =>{
        setReservations([])
    }


    return (
        <ReservationContext.Provider value={{
            reservations,
            addReservation,
            removeReservation,
            updateTravelerInReservation,
            updateSeatInReservation,
            resetSeat,
            finishTransaction
        }}>
            {children}
        </ReservationContext.Provider>
    );
};
