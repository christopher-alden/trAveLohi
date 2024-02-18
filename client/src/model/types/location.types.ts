export type Airport = {
    ID: number,
    name: string;
    code: string;
    country: string;
    city: string;
}

export type AirportDetails = {
    ID: number,
    name: string;
    code: string;
    country: string;
    city?: City;
}

export type City = {
    ID:number,
    countryId:number
    name:string
    lt:string
    country?:Country
}

export type Country = {
    ID:number,
    name:string
}