import { RoomDetail } from "@myTypes/hotel.types";
import { ApiEndpoints } from "@util/api.utils";

export async function getRoomDetails(id: any): Promise<RoomDetail> {
    const url = `${ApiEndpoints.HotelRoomDetailsGetData}?hotelId=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch room detail');
    return await res.json();
}


export async function getRoomDetailsOne(hotelId: any, roomId:any): Promise<RoomDetail> {
    const url = `${ApiEndpoints.HotelRoomDetailsGetData}?hotelId=${encodeURIComponent(hotelId)}&roomId=${encodeURIComponent(roomId)}`;
    const res = await fetch(url);
    const data = await res.json()
    console.log(data.message)
    if (!res.ok) throw new Error('Failed to fetch room detail');
    return data
}