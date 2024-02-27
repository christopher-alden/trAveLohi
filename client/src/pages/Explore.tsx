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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "react-query"
import close from '@icons/close-icon-black.png'
import { getAirport } from "src/services/locationServices"
import Footer from "@comp/navigation/Footer"
import ProtectedRoute from "src/middleware/ProtectedRoute"

const Explore = () => {
    const urlLocation = useLocation()
    const { limit, offset, updateOffset, setOffset} = useLimiter()
    const { enableFetch, setEnableFetch, scrollEndRef, isIntersecting,} = useInfiniteScroll();
    const [ resultDesc, setResultDesc] = useState<string>('')

    const [flightDetails, setFlightDetails] = useState<FlightDetail[]>([]);
    const [modeToggle, setModeToggle] = useState('flights');
    const [isHovering, setIsHovering] = useState(false); 
    const navigate = useNavigate() 

    const [queryParameters] = useSearchParams()

    const departureId = queryParameters.get("departureId") || '';
    const arrivalId = queryParameters.get("arrivalId") || '';
    const searchType = queryParameters.get("searchType");
    const searchMode = queryParameters.get("searchMode");

    const handleModeToggle = (mode:any) => { 
        setModeToggle(mode);
        setIsHovering(false);
    };

    const clearFilters = async () => {
        console.log(location)
        if(location.search != ''){
            navigate('/explore');
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
        

    return (
        <ProtectedRoute>
            <Container px='0px' py='0px' direction='column' width='100%' className="bg-notthatwhite ">
                <Navbar/>
                <Container direction="row" width="100%" height="100%" className="push-navbar no-padding min-h-full">
                    <Container direction="column" width="25%" height="100%" className="relative items-start" >
                        <Container direction="column" className="no-padding " gap={styles.g4}>
                            <Container className="no-padding items-end" width="100%">
                                <Label className="lh-5xl" fontSize={styles.f5xl}>Filters</Label>
                            </Container>
                            <Container direction="column" py="0px" px={styles.g2} gap={styles.g2}>
                                <Label fontSize={styles.fxl}>Airline</Label>
                                <Container direction="column" className="no-padding" gap={styles.g1}>
                                    <CheckBox>Some Filter</CheckBox>
                                    <CheckBox>Some Filter</CheckBox>
                                    <CheckBox>Some Filter</CheckBox>
                                </Container>
                            </Container>
                        </Container>
                    </Container>
                    <Container width="75%" height="100%" direction="column" gap={styles.g8}>
                        <Container width="100%"  className="no-padding space-between items-end ">
                            <div 
                                className=" gap-2 toggle-container items-center" 
                                onMouseEnter={() => setIsHovering(true)} 
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <Label className="lh-5xl ls-5xl"  fontSize={styles.f5xl} >Explore</Label>
                                {isHovering ? (
                                    <Container className="no-padding" gap={styles.g2}>
                                        <Label className="lh-5xl ls-5xl" onClick={() => handleModeToggle('flights')} fontSize={styles.f5xl} color={modeToggle === 'flights' ? styles.black : styles.secondaryWhite}>Flights</Label>
                                        <Label className="lh-5xl ls-5xl" onClick={() => handleModeToggle('hotels')} fontSize={styles.f5xl} color={modeToggle === 'hotels' ? styles.black : styles.secondaryWhite}>Hotels</Label>
                                    </Container>
                                ) :
                                (
                                    <Label className="lh-5xl ls-5xl"  fontSize={styles.f5xl} color={styles.black}>{`${modeToggle.charAt(0).toUpperCase() + modeToggle.slice(1)}`}</Label>
                                )}
                                    <Picture width="45px" height="45px" className="invert rotate" src={arrowIcon}></Picture>
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
                        
                        <Container width="100%" height="100%" className="no-padding " gap={styles.g8} direction="column">
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
                <Footer/>
            </Container>
        </ProtectedRoute>
    );
}

export default Explore