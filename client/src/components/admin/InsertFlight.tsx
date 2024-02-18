import {useEffect, useState} from 'react';
import styles from '@styles/global.module.scss';
import Label from '@comp/form/Label';
import Container from '@comp/container/Container';
import Bento from '@comp/container/Bento';
import Button from '@comp/form/Button';
import Picture from '@comp/container/Picture';
import FlightSearchWidget from '@comp/product/FlightSearchWidget';
import { Airline, Airplane, Flight, FlightResponse } from '@myTypes/flight.types';
import { ApiEndpoints } from '@util/api.utils';
import { useQuery } from 'react-query';
import chevronIcon from "@icons/down-icon.png"




const InsertFlight = () => {
    const [chosenFlight, setChosenFlight] = useState<Flight>({arrival:null, departure:null, flightTime:null})
    // TODO: JADI FLIGHT AJA?
    const [chosenAirline, setChosenAirline] = useState<Airline | null>(null);
    const [chosenAirplane, setChosenAirplane] =  useState<Airplane | null>(null);
    const [availableAirlines, setAvailableAirlines] = useState<Airline[]>([])
    const [availableAirplanes, setAvailableAirplanes] = useState<Airplane[]>([])
    

    const fetchAirlineFromRoutes = async () =>{
        const departureId = chosenFlight.departure?.ID || ''
        const arrivalId = chosenFlight.arrival?.ID || ''
        const url = `${ApiEndpoints.AirlineFromRoutes}?departureId=${encodeURIComponent(departureId.toString())}&arrivalId=${encodeURIComponent(arrivalId.toString())}`
        const res = await fetch(url)
        if(!res.ok) throw new Error('Failed to fetch airline')
        return res.json()
    }

    const createFlight = async (flight: FlightResponse) =>{
        const res = await fetch(ApiEndpoints.CreateFlight,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(flight),
        })
        if(!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        return data
    }

    const onSubmit = async ()  =>{
        console.log("jalan")
        console.log(chosenFlight)
        if(chosenFlight.arrival && chosenFlight.departure && chosenFlight.flightTime && chosenAirline && chosenAirplane){
            if(chosenFlight.flightTime.arrivalTime && chosenFlight.flightTime.departureTime){
                console.log("masuk")
                const flight: FlightResponse = {
                    airplaneId:chosenAirplane.ID,
                    airlineId: chosenAirline.ID,
                    status:'pending',
                    flight: chosenFlight
                }
                const data = await createFlight(flight)
                console.log(data)
            }
            
        }
        
    }

    const fetchAvailableAirplanes = async () =>{
        if(!chosenAirline) return;
        const url = `${ApiEndpoints.AvailableAirplanesFromAirline}?airlineId=${encodeURIComponent(chosenAirline.ID.toString())}`
        const res = await fetch(url)
        if(!res.ok) throw new Error('Failed to fetch airplane')
        return res.json()
    }

    useEffect(() => {
        onFlightChange()
    }, [chosenFlight])

    useEffect(() => {
        onAirlineChange()
    }, [chosenAirline])
    
    const onFlightChange = () =>{
        setAvailableAirplanes([])
        setChosenAirline(null)
        setChosenAirplane(null)
    }
    const onAirlineChange = () =>{
        setChosenAirplane(null)
    }
    const {error:airlineError, isLoading:arilineIsLoading} = useQuery([`fetchAirlineFromRoutes`,chosenFlight], fetchAirlineFromRoutes,{
        retry:false,
        onSuccess: (data)=>{
            if(!data){
                setAvailableAirlines([])
                throw new Error('No data') 
            }
            const airlines: Airline[] = data.map((item:any)=>({
                ...item,
                ID:item.id
            }))
            setAvailableAirlines(airlines)
            
        },
        onError: (error)=>{
            console.log(error)
        }
    })

    const{error:airplaneError, isLoading:airplaneIsLoading} = useQuery([`fetchAvailableAirplanes`, chosenFlight, chosenAirline],fetchAvailableAirplanes,{
        retry:false,
        onSuccess: (data)=>{
            if(!data){
                setAvailableAirplanes([])
                throw new Error('No Data')
            }
            const airplanes: Airplane[] = data.map((item:any)=>({
                ID:item.ID,
                code:item.code,
                airlineID:item.airline.ID,
                type:item.type,
                isAvailable: item.isAvailable
            }))
            setAvailableAirplanes(airplanes)
        }
    })
    
	return (
        <Container direction='column' width="100%" height="100%"  className="no-br c-white no-padding ">
            <Bento width="100%" height="30%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y">
                    <Container width='100%' className='no-padding space-between' gap={styles.g4}>
                        <Label  color={styles.white} fontSize={styles.f3xl}>Flight Route</Label>
                        <Label  color={styles.white} fontSize={styles.f3xl}>{`${chosenFlight.departure?.code || ''} - ${chosenFlight.arrival?.code || ''} : ${chosenAirplane?.code || ''}`}</Label>
                    </Container>
                    <Container center width='100%' height='100%' className='no-padding'>
                        <FlightSearchWidget mainTheme={false} flight={chosenFlight} setFlight={setChosenFlight}/>
                    </Container>
                </Container>
            </Bento>
            <Container width='100%' height='70%' className='no-padding'>
                <Bento width="50%" height="100%">
                    <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y">
                        <Label  color={styles.white} fontSize={styles.f3xl} className='sticky'>Airline</Label>
                        <Container width='100%' height='100%' className='no-padding' direction='column'>
                            {!arilineIsLoading &&
                            <>
                                {availableAirlines.length == 0 ?
                                    <Container width='100%' height='100%' center>
                                        <Label color={styles.secondaryWhite}>
                                            No airline currenty support {chosenFlight.departure?.code} - {chosenFlight.arrival?.code}
                                            </Label>
                                    </Container>
                                :
                                <Container width='100%' height='100%' gap={styles.g4} className='no-padding' direction='column'>
                                    {availableAirlines.map((airline)=>{
                                        return(
                                            <Button onClick={()=>{setChosenAirline(airline)}} key={airline.ID} className="bento-btn">
                                                <Label color={`${chosenAirline?.ID == airline.ID ? styles.white :styles.secondaryWhite}`} >
                                                {airline.name}
                                                </Label>
                                                <Picture width="25px" height="25px" className="bento-icon icon-right" src={chevronIcon}/>
                                            </Button>
                                        )
                                    })}
                                </Container>
                                }
                            </>
                            }
                        </Container>
                    </Container>
                </Bento>
                <Container direction='column' className='no-padding' width='50%' height='100%'>
                    <Bento width="100%" height="100%">
                        <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y">
                            <Label  color={styles.white} fontSize={styles.f3xl}>Plane </Label>
                            <Container width='100%' height='100%' gap={styles.g4} className='no-padding' direction='column'>
                                    {!airplaneIsLoading &&
                                        <>
                                        {availableAirplanes.map((airplane)=>{
                                            return(
                                                <Button onClick={()=>{setChosenAirplane(airplane)}} key={airplane.ID} className="bento-btn">
                                                    <Label color={`${chosenAirplane?.ID == airplane.ID ? styles.white :styles.secondaryWhite}`} >
                                                        {airplane.code} - {airplane.type}
                                                    </Label>
                                                    <Picture width="25px" height="25px" className="bento-icon icon-right" src={chevronIcon}/>
                                                </Button>
                                            )
                                        })}
                                        </>
                                    
                                    }
                                </Container>
                        </Container>
                    </Bento>
                    <Bento width="100%" height=''>
                        <Button onClick={()=>{onSubmit()}} className="sidebar-btn ">
                            <Label color={styles.white}>Continue</Label>
                        </Button>
                    </Bento>
                </Container>
            </Container>
        </Container>
    )
};

export default InsertFlight;
