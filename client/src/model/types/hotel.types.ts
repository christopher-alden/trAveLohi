import {City} from './location.types';
import { UserTransaction } from './user.types';

export interface Hotel extends HotelPayload {
	ID: number;
	facilities:Facility[],
	city: City;
}

export interface HotelDetailsRoomDetails extends Hotel{
	roomDetails : RoomDetail[]
}
export type Facility = {
	id: number;
	name: string;
};

export const HotelFacilities = {
	WiFi: {id: 1, name: 'WiFi'},
	SwimmingPool: {id: 2, name: 'SwimmingPool'},
	Parking: {id: 3, name: 'Parking'},
	Restaurant: {id: 4, name: 'Restaurant'},
	Elevator: {id: 5, name: 'Elevator'},
	WheelchairAccess: {id: 6, name: 'WheelchairAccess'},
	FitnessCenter: {id: 7, name: 'FitnessCenter'},
	MeetingFacilities: {id: 8, name: 'MeetingFacilities'},
	AirportTransfer: {id: 9, name: 'AirportTransfer'},
	AC: {id: 10, name: 'AC'},
	FrontDesk: {id: 11, name: 'FrontDesk'},
};

export type HotelFacilities = {[key: string]: Facility};

export interface HotelPayload {
	name: string;
	description: string;
	rating: number;
	address: string;
	cityId: number;
	facilitiesId: number[];
	images: string[];
}

export interface RoomDetailPayload {
	hotelId: number;
    name:string
	price: number;
	images: string[];
    roomFacilities: RoomFacilities
	guest: number;
	bed: string;
	area: number;
	allocation: number;
}

export interface RoomDetail extends RoomDetailPayload{
    ID:number,
}


export interface RoomFacilities{
    isFreeWifi:boolean,
	isFreeBreakfast: boolean;
	isNonSmoking: boolean;
	isRefundable: boolean;
	isReschedule: boolean;
}

export interface HotelReservationPayload {
	hotelId:number,
	roomDetailId:number,
	checkInTime:Date,
	checkOutTime:Date
}

export interface HotelTransactionPayload{
	userId:number,
	price:number,
	transactionDate: Date,
	status:string,
	hotelTransaction:HotelReservationPayload
}

export interface HotelTransaction extends HotelTransactionPayload{
	reservationCode: string
}

export interface HotelCart{
	ID:number,
	hotelTransaction:HotelTransaction,
	roomDetail: RoomDetail
	hotel:Hotel
	userTransaction:UserTransaction
}