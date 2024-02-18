import Container from "@comp/container/Container"
import CheckBox from "@comp/form/CheckBox"
import Label from "@comp/form/Label"
import Navbar from "@comp/navigation/Navbar"
import styles from '@styles/global.module.scss'
import { useEffect, useState } from "react"
import arrowIcon from '@icons/arrow-icon.png'
import Picture from "@comp/container/Picture"
import FlightDetailCard from "@comp/product/FlightDetailCard"
import useLimiter from "src/hooks/useLimiter"
import useInfiniteScroll from "src/hooks/useInfiniteScroll"
import { ApiEndpoints } from "@util/api.utils"
import { FlightDetail } from "@myTypes/flight.types"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "react-query"
import close from '@icons/close-icon-black.png'

const Explore = () => {
    const { limit, offset, updateOffset} = useLimiter()
    const { enableFetch, setEnableFetch, scrollEndRef, isIntersecting} = useInfiniteScroll();

    const [flightDetails, setFlightDetails] = useState<FlightDetail[]>([]);
    const [modeToggle, setModeToggle] = useState('flights');
    const [isHovering, setIsHovering] = useState(false); 
    const navigate = useNavigate() 

    const [queryParameters] = useSearchParams()

    const handleModeToggle = (mode:any) => { 
        setModeToggle(mode);
        setIsHovering(false);
    };

    const clearFilters = () => {
        setEnableFetch(true); 
        navigate('/explore');
        
    };

    const showResult = (flightDetail:FlightDetail) =>{
        if(!flightDetail)return 'No Results Found'
        let res = null
        let departure = null, arrival = null

        if(modeToggle == 'flights'){
            if(queryParameters.get("departureId")!=null){
                departure = flightDetail.flightRoute?.departure.code
            }
            if(queryParameters.get("arrivalId")!=null){
                arrival = flightDetail.flightRoute?.arrival.code
            }
            res = `Showing ${departure || 'Any'} - ${arrival || 'Any'}`
        }

        return !departure && !arrival ? 'Showing All Results' : res
    }


    console.log(limit, offset)
    

    const infiniteFetchPendingFlightsExplore = async () => {
        const departureId = queryParameters.get("departureId") || ""
        const arrivalId = queryParameters.get("arrivalId") || ""
        console.log("departure:", departureId, "arrival:", arrivalId)
        const url = `${ApiEndpoints.FlightsPendingSearchFromLocation}?departureId=${departureId}&arrivalId=${arrivalId}&limit=${limit}&offset=${offset}`;

        const res = await fetch(url,{
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });

        if(!res.ok) throw new Error('Failed to fetch')
        return res.json()
    };
    

    const {error, isLoading:flightsLoading} = useQuery(['infiniteFetchPendingFlightsExplore', queryParameters], infiniteFetchPendingFlightsExplore,{
        retry:false,
        enabled: enableFetch,
        cacheTime: 10 * 60 * 1000, 
        onSuccess: (data) =>{

            const transformedData:FlightDetail[] = data.map((entry:any) => ({
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
            updateOffset()
            setEnableFetch(false); 
        },
        onError: (error) => {
            console.error(error);
            setEnableFetch(false); 
        },

    })

    useEffect(() => {
        if (isIntersecting && !flightsLoading && !error) {
            setEnableFetch(true);
        }
    }, [flightDetails, offset, flightsLoading]);

    if(flightsLoading)return<></>
    return (
        <Container px='0px' py='0px' direction='column' width='100%' className="bg-notthatwhite min-h-full">
            <Navbar/>
            <Container direction="row" width="100%" height="100%" className="push-navbar no-padding">
                <Container direction="column" width="25%" height="80%" className="absolute items-start" gap={styles.g8}>
                    <Container className="no-padding items-end" width="100%" height="60px">
                        <Label className="lh-3xl" fontSize={styles.f3xl}>Filters</Label>
                    </Container>
                    <Container direction="column" py="0px" px={styles.g2} gap={styles.g4}>
                        <Label fontSize={styles.fxl}>Airline</Label>
                        <Container direction="column" className="no-padding" gap={styles.g2}>
                            <CheckBox>Some Filter</CheckBox>
                            <CheckBox>Some Filter</CheckBox>
                            <CheckBox>Some Filter</CheckBox>
                        </Container>
                    </Container>
                </Container>
                <Container width="75%" height="100%" direction="column" gap={styles.g8}>
                    <Container width="100%" height="60px" className="no-padding space-between items-end">
                        <div 
                            className="no-padding gap-2 toggle-container items-center" 
                            onMouseEnter={() => setIsHovering(true)} 
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <Label className="lh-3xl"  fontSize={styles.f3xl} >Explore</Label>
                            {isHovering ? (
                                <Container className="no-padding" gap={styles.g2}>
                                    <Label className="lh-3xl" onClick={() => handleModeToggle('flights')} fontSize={styles.f3xl} color={modeToggle === 'flights' ? styles.black : styles.secondaryWhite}>Flights</Label>
                                    <Label className="lh-3xl" onClick={() => handleModeToggle('hotels')} fontSize={styles.f3xl} color={modeToggle === 'hotels' ? styles.black : styles.secondaryWhite}>Hotels</Label>
                                </Container>
                            ) :
                            (
                                <Label className="lh-3xl"  fontSize={styles.f3xl} color={styles.black}>{`${modeToggle.charAt(0).toUpperCase() + modeToggle.slice(1)}`}</Label>
                            )}
                                <Picture width="30px" height="30px" className="invert rotate" src={arrowIcon}></Picture>
                        </div>
                        <Container center className="no-padding" gap={styles.g4}>
                            <Label fontSize={styles.fxl}>{showResult(flightDetails[0])}</Label>
                            <div onClick={clearFilters}>
                                <Picture width="25px" height="25px" src={close}></Picture>
                            </div>
                        </Container>
                    </Container>
                    
                    <Container width="100%" height="100%" className="no-padding " gap={styles.g8} direction="column">
                        <>
                            {flightDetails.map((flightDetail, index)=>{
                                return(
                                    <FlightDetailCard key={index} flightDetail={flightDetail}></FlightDetailCard>
                                )
                            })}
                        </>
                        <div ref={scrollEndRef}>{flightsLoading && <>loading</>}</div>
                    </Container>
                </Container>
            </Container>
        </Container>
    );
}

export default Explore