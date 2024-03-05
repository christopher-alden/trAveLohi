import Bento from "@comp/container/Bento"
import Container from "@comp/container/Container"
import Button from "@comp/form/Button"
import Label from "@comp/form/Label"
import { FlightDetail } from "@myTypes/flight.types"
import styles from '@styles/global.module.scss'
import { ApiEndpoints } from "@util/api.utils"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import useInfiniteScroll from "src/hooks/useInfiniteScroll"
import useLimiter from "src/hooks/useLimiter"


const ViewFlights = () =>{

    const {  limit, offset, updateOffset} = useLimiter()
    const { enableFetch, setEnableFetch, scrollEndRef, isIntersecting } = useInfiniteScroll();

    const [flightDetails, setFlightDetails] = useState<FlightDetail[]>([]);

    const infiniteFetchPendingFlights = async () => {
        const url = `${ApiEndpoints.FlightsPendingGetAllData}?limit=${limit}&offset=${offset}`;

        const res = await fetch(url,{
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });
        if(!res.ok) throw new Error('Failed to fetch promo')
        return res.json()
    };

    const {error, isLoading:flightsLoading} = useQuery(['infiniteFetchPendingFlights'], infiniteFetchPendingFlights,{
        retry: false,
        enabled: enableFetch,
        cacheTime: 10 * 60 * 1000, 
        onSuccess: (data) =>{
            const transformedData:FlightDetail[] = data.map((entry:any) => ({
                ID:entry.ID,
                flightRoute:{
                    ID:entry.flightRoute.ID,
                    departure: entry.flightRoute.departureAirport,
                    arrival: entry.flightRoute.arrivalAirport,
                    price: entry.flightRoute.price,
                    flightDuration: entry.flightRoute.flightDuration
                },
                flightTime:{
                    departureTime: entry.departureTime,
                    arrivalTime: entry.arrivalTime
                },
                airline:entry.airline,
                airplane: entry.airplane,
                status: entry.status,

                
            }));
            setFlightDetails(prevFlightDetails => [...prevFlightDetails, ...transformedData]);
            setEnableFetch(false);
            updateOffset();

        },
        onError: (error) => {
            console.error(error);
            setEnableFetch(false); 
        }

    })
    
    useEffect(() => {
        if (isIntersecting && !flightsLoading && !error) {
            console.log("Intersection observed, enabling fetch.");
            setEnableFetch(true);
        }
    }, [isIntersecting, offset, flightsLoading]);;

    // if (flightsLoading) retur/n <></>;
    return(
        <Container direction="row" width="100%" height="100%"  className="no-br c-white no-padding ">
            <Bento width="50%" height="100%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary">
                    <Label color={styles.white} fontSize={styles.f3xl}>Flights</Label>
                    {
                        flightDetails.length==0 ?
                        (
                            <Container width="100%" height="100%" center>
                                <Label color={styles.secondaryWhite}>No Data</Label>
                            </Container>
                        ):
                        (
                            <>
                            {flightDetails.map((flightDetail)=>{
                                return(
                                    <Button onClick={()=>{}} key={flightDetail.ID} className="bento-btn">
                                        <Label color={`${flightDetail.ID == flightDetail.ID ? styles.white :styles.secondaryWhite}`} >
                                            [{flightDetail.airline?.name}] {flightDetail.flightRoute?.departure.code} - {flightDetail.flightRoute?.arrival.code} , {flightDetail.airplane?.code}
                                        </Label>
                                        {/* <Picture  width="25px" height="25px" className="bento-icon icon-right" src={chevronIcon}/> */}
                                    </Button>
                                )
                            })}

                            </>
                        )
                    }
                    <div ref={scrollEndRef}></div>
                </Container>
            </Bento>
        </Container>
    )

}

export default ViewFlights