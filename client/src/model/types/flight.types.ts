import {Airport, AirportDetails} from './location.types';
import { Traveler } from './user.types';

export type Airline = {
	ID: number;
	name: string;
};

export type Airplane = {
	ID: number;
	code: string;
	airlineID: number;
	type: string;
	isAvailable: boolean;
};

export type FlightRoute = {
	ID: number;
	departure: AirportDetails;
	arrival: AirportDetails;
	price: number;
	flightDuration: number;
};

export type FlightTime = {
    departureTime?: Date
    arrivalTime?: Date
}


// admin stuff lah
export interface Flight{
	departure: AirportDetails | null;
	arrival: AirportDetails | null;
    flightTime: FlightTime | null
};


// ni buat apa ya?
export type FlightResponse = {
	airplaneId: number;
	flight: Flight
	status: 'pending' | 'cancelled' | 'on-going';
	airlineId: number;
};


// ni buat nerima flight detail 
export interface FlightDetail{
	ID:number
    flightRoute: FlightRoute | null
    flightTime: FlightTime | null
    airline: Airline | null
    airplane: Airplane | null
    status: string | null
}
export const TripRouteList = ['Single Trip', 'Round Trip'];
export const AddOnBaggage = [0, 10,20,30,40]

export enum SeatClass {
	Economy = "Economy",
	Business = "Business Class",
	First = "First Class",
	AL = "23-2"
}


export type SeatDetail = {
	ID:number,
	airplaneId:number,
	code: string,
	class: string,
	isAvailable: boolean,
}


export type FlightReservation = {
	traveler: Traveler,
	seat?: SeatDetail
}


export interface FlightTransactionPayload{
	flightId:number,
	seatId:number,
	isRoundTrip:boolean,
	baggage:number
}

export interface FlightTransaction extends FlightTransactionPayload{
	ticketCode: string,
	ID?:number,
	travelerId:number,
	userTransactionId:number,
	seatId:number,
}


export type CompleteFlightTransaction = {
	userId:number,
	price: number,
	transactionDate: Date,
	status:string,
	travelers:Traveler[],
	flightTransactions: FlightTransactionPayload[]
}