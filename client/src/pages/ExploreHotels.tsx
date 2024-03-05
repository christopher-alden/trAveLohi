import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import styles from '@styles/global.module.scss'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowIcon from '@icons/arrow-icon.png'
import Picture from "@comp/container/Picture";
import { ApiEndpoints } from "@util/api.utils";
import useLimiter from "src/hooks/useLimiter";
import useInfiniteScroll from "src/hooks/useInfiniteScroll";
import { useQuery } from "react-query";
import { Hotel } from "@myTypes/hotel.types";
import HotelCard from "@comp/product/HotelCard";


const ExploreHotels = () =>{
    const [modeToggle, setModeToggle] = useState('hotels');
    const {  limit, offset, updateOffset} = useLimiter()
    const { enableFetch, setEnableFetch, scrollEndRef, isIntersecting } = useInfiniteScroll();

    const [hotels, setHotels] = useState<Hotel[]>([]);


    const navigate = useNavigate()

    const handleModeToggle = (mode:any) => { 
        if (mode === 'flights'){
            navigate('/explore/flights')
        }
        setModeToggle(mode);
    };

    const infiniteFetchHotels= async () => {
        const url = `${ApiEndpoints.HotelGetAllData}?limit=${limit}&offset=${offset}`;

        const res = await fetch(url,{
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });
        const data = await res.json()
        if(!res.ok) throw new Error('Failed to fetch')
        return data
    };

    const {error, isLoading:hotelsLoading} = useQuery(['infiniteFetchHotels'], infiniteFetchHotels,{
        retry: false,
        enabled: enableFetch,
        cacheTime: 10 * 60 * 1000, 
        onSuccess: (data) =>{
            const transformedData:Hotel[] = data.map((entry:any) => ({
                ID: entry.ID,
                name: entry.name,
                description : entry.description,
                rating: entry.rating,
                address: entry.address,
                images: entry.images,
                cityId: entry.cityId,
                city: {
                    ...entry.city
                }

            }));
            setHotels(prevHotels => [...prevHotels, ...transformedData]);
            setEnableFetch(false);
            updateOffset();
        },
        onError: (error) => {
            console.error(error);
            setEnableFetch(false); 
        }

    })

    useEffect(() => {
        if(isIntersecting && !hotelsLoading && !error){
            setEnableFetch(true)
        }

    }, [isIntersecting, hotelsLoading, hotels])

    console.log(hotels)

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
                        {/* <Label>{resultDesc}</Label>
                        {location.search != '' &&
                            <div onClick={clearFilters}>
                                <Picture width="20px" height="20px" src={close}></Picture>
                            </div>
                        } */}
                    </Container>
                </Container>
                
                <Container width="100%" height="100%" className="no-padding " gap={styles.g16} direction="column">
                    <>
                        {hotels.map((hotel, index)=>{
                            return(
                                <HotelCard key={index} hotel={hotel}></HotelCard>
                            )
                        })}
                    </>
                    <div ref={scrollEndRef}></div>
                </Container>
            </Container>
        </Container>
    )
}

export default ExploreHotels