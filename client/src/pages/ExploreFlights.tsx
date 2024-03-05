import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import styles from '@styles/global.module.scss'
import { useEffect, useState } from "react"
import arrowIcon from '@icons/arrow-icon.png'
import Picture from "@comp/container/Picture"
import FlightDetailCard from "@comp/product/FlightDetailCard"
import useLimiter from "src/hooks/useLimiter"
import useInfiniteScroll from "src/hooks/useInfiniteScroll"
import { ApiEndpoints } from "@util/api.utils"
import { FlightDetail } from "@myTypes/flight.types"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "react-query"
import close from '@icons/close-icon-black.png'
import { getAirport } from "src/services/locationServices"

import Button from "@comp/form/Button"


const ExploreFlights = () =>{
    const urlLocation = useLocation()
    const { limit, offset, updateOffset, setOffset} = useLimiter()
    const { enableFetch, setEnableFetch, scrollEndRef, isIntersecting,} = useInfiniteScroll();
    const [ resultDesc, setResultDesc] = useState<string>('')

    const [flightDetails, setFlightDetails] = useState<FlightDetail[]>([]);
    const [modeToggle, setModeToggle] = useState('flights');
    const navigate = useNavigate() 

    const [queryParameters] = useSearchParams()

    const departureId = queryParameters.get("departureId") || '';
    const arrivalId = queryParameters.get("arrivalId") || '';
    const searchType = queryParameters.get("searchType");
    const searchMode = queryParameters.get("searchMode");

    const sortFlightsByPrice = () => {
        if(flightDetails){
            const sortedFlights = [...flightDetails].sort((a, b) => {
                return a.flightRoute?.price! - b.flightRoute?.price!;
            });
            setFlightDetails(sortedFlights);
        }
    };
    const sortFlightsByDuration = () => {
        if(flightDetails){
            const sortedFlights = [...flightDetails].sort((a, b) => {
                return a.flightRoute?.flightDuration! - b.flightRoute?.flightDuration!;
            });
            setFlightDetails(sortedFlights);
        }
    };
    

    const handleModeToggle = (mode:any) => { 
        if (mode === 'hotels'){
            navigate('/explore/hotels')
        }
        setModeToggle(mode);
    };

    const clearFilters = async () => {
        console.log(location)
        if(location.search != ''){
            navigate('/explore/flights');
        }
    };

    const infiniteFetchPendingFlightsExplore = async () => {
        let url = ''
        if(searchType == null) {
            url = `${ApiEndpoints.FlightsPendingSearchFromLocation}?departureId=${encodeURIComponent(departureId)}&arrivalId=${encodeURIComponent(arrivalId)}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`;
        }
        else if(searchType == 'location') {
            url = `${ApiEndpoints.FlightsPendingSearchFromLocation}?searchType=${encodeURIComponent(searchType)}&departureId=${encodeURIComponent(departureId)}&arrivalId=${encodeURIComponent(arrivalId)}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`;
        }
        const res = await fetch(url);

        if(!res.ok) throw new Error('Failed to fetch')
        return res.json()
    };

    const {data: departureCity,isLoading: isLoadingDepartureCity,error: departureCityError,} = useQuery(['getAirport', departureId], 
        () => getAirport(departureId), 
        {
            enabled: !!departureId,
        }
    );

    const {data: arrivalCity,isLoading: isLoadingArrivalCity,error: arrivalCityError,} = useQuery(['getAirport', arrivalId], 
        () => getAirport(arrivalId), 
        {
            enabled: !!arrivalId,
        }
    );

    useEffect(() => {
        if (!isLoadingDepartureCity && !isLoadingArrivalCity) {
            if(searchMode == 'flights'){
                console.log(searchType)
                if(searchType == 'location'){
                    setResultDesc(`Showing ${departureCity?.city?.name || "Any"}`);
                }
                else{
                    setResultDesc(`Showing ${departureCity?.city?.name || "Any"} - ${arrivalCity?.city?.name || "Any"}`);
                }
            }
            else{
                setResultDesc('Showing All Results')
            }
        } else if (departureCityError || arrivalCityError) {
            setResultDesc('Failed to fetch city information');
        }
    }, [urlLocation ,isLoadingDepartureCity, isLoadingArrivalCity, departureCityError, arrivalCityError]);
        

    const {error, isLoading:flightsLoading} = useQuery(['infiniteFetchPendingFlightsExplore', offset], infiniteFetchPendingFlightsExplore,{
        retry:false,
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
            setFlightDetails((prevFlightDetails) => [...prevFlightDetails, ...transformedData]);
            setEnableFetch(false); 
            updateOffset()
        },
        onError: (error) => {
            console.error(error);
            setEnableFetch(false); 
        },

    })

    useEffect(() => {
        setFlightDetails([]);
        setOffset(0); 
        setEnableFetch(true); 
    }, [urlLocation.search]); 

    useEffect(() => {
        if (isIntersecting && !flightsLoading && !error) {
            setEnableFetch(true);
        }
    }, [isIntersecting, flightDetails]);
        
    return(
        <Container direction="row" width="100%" height="100%" className="push-navbar no-padding min-h-full">
            <Container direction="column" width="25%" height="100%" className="relative items-start" >
                <Container direction="column" className="no-padding " gap={styles.g4}>
                    <Container className="no-padding items-end" width="100%">
                        <Label className="lh-5xl" fontSize={styles.f5xl}>Filters</Label>
                    </Container>
                    <Container direction="column" py="0px" px={styles.g2} gap={styles.g2}>
                        <Label fontSize={styles.fxl}>Airline</Label>
                        <Container direction="column" className="no-padding" gap={styles.g1}>
                            <Button onClick={sortFlightsByPrice}>Sort by price</Button>
                            <Button onClick={sortFlightsByDuration}>Sort by duration</Button>
                            {/* <CheckBox>Some Filter</CheckBox>
                            <CheckBox>Some Filter</CheckBox>
                            <CheckBox>Some Filter</CheckBox> */}
                        </Container>
                    </Container>
                </Container>
            </Container>
            <Container width="75%" height="100%" direction="column" gap={styles.g8}>
                <Container width="100%"  className="no-padding space-between items-end ">
                    <div 
                        className=" gap-2 toggle-container items-center" 
                    >
                        <Container className="no-padding" gap={styles.g2}>
                            <Label className="lh-5xl ls-5xl" onClick={() => handleModeToggle('flights')} fontSize={styles.f5xl} color={modeToggle === 'flights' ? styles.black : styles.secondaryWhite}>Flights</Label>
                            <Label className="lh-5xl ls-5xl" fontSize={styles.f5xl} color={styles.secondaryWhite}>|</Label>
                            <Label className="lh-5xl ls-5xl" onClick={() => handleModeToggle('hotels')} fontSize={styles.f5xl} color={modeToggle === 'hotels' ? styles.black : styles.secondaryWhite}>Hotels</Label>
                        </Container>
                    </div>
                    <Container center className="no-padding clip" gap={styles.g1}>
                        <Label>{resultDesc}</Label>
                        {location.search != '' &&
                            <div onClick={clearFilters}>
                                <Picture width="20px" height="20px" src={close}></Picture>
                            </div>
                        }
                    </Container>
                </Container>
                
                <Container width="100%" height="100%" className="no-padding " gap={styles.g16} direction="column">
                    <>
                        {flightDetails.map((flightDetail, index)=>{
                            return(
                                <FlightDetailCard key={index} flightDetail={flightDetail}></FlightDetailCard>
                            )
                        })}
                    </>
                    <div ref={scrollEndRef}></div>
                </Container>
            </Container>
        </Container>
    )
}

export default ExploreFlights