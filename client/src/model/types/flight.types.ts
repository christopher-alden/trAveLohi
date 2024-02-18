import {Airport, AirportDetails} from './location.types';

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

export interface Flight{
	departure: Airport | null;
	arrival: Airport | null;
    flightTime: FlightTime | null
};


export type FlightResponse = {
	airplaneId: number;
	flight: Flight
	status: 'pending' | 'cancelled' | 'on-going';
	airlineId: number;
};

export interface FlightDetail{
    flightRoute: FlightRoute | null
    flightTime: FlightTime | null
    airline: Airline | null
    airplane: Airplane | null
    status: string | null
}
export const tripRouteList = ['Single Trip', 'Round Trip'];
export const classList = ['Economy', 'Business Class', 'First Class'];


