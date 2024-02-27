import { FlightDetail } from "@myTypes/flight.types";
import { AirportDetails, City } from "@myTypes/location.types";
import { ApiEndpoints } from "@util/api.utils";
import { SeatDetail } from "@myTypes/flight.types";

export async function getCity(id:any):Promise<City> {
    const url = `${ApiEndpoints.CityGetData}?cityId=${encodeURIComponent(id)}`
    const res = await fetch(url) 
    if (!res.ok) throw new Error ('Failed to fetch search')
    return res.json()

    // const city:City = {
    //     ...data
    // }
    // return city

}

export async function getAirport(id:any):Promise<AirportDetails>{
    const url = `${ApiEndpoints.AirportGetData}?id=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error ('Failed to fetch search')
    return res.json();
};

export async function getFlightDetail(id: any): Promise<FlightDetail> {
    const url = `${ApiEndpoints.FlightGetDetails}?flightId=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch flight detail');
    return await res.json();
}

export async function getSeatDetail(id:any): Promise<SeatDetail> {
    const url = `${ApiEndpoints.SeatGetDetail}?flightId=${encodeURIComponent(id)}`
    const res  = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch seat detail')
    return res.json()
}

export async function getSeatAmount(id:any): Promise<SeatDetail> {
    const url = `${ApiEndpoints.SeatGetAmount}?flightId=${encodeURIComponent(id)}`
    const res  = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch seat amount')
    
    return res.json()
}