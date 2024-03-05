import Bento from "@comp/container/Bento";
import Container from "@comp/container/Container";
import { Hotel,  RoomDetailPayload, RoomFacilities } from "@myTypes/hotel.types";
import { ApiEndpoints } from "@util/api.utils";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useInfiniteScroll from "src/hooks/useInfiniteScroll";
import useLimiter from "src/hooks/useLimiter";
import styles from '@styles/global.module.scss'
import Label from "@comp/form/Label";
import TextField from "@comp/form/TextField";
import CheckBox from "@comp/form/CheckBox";
import { useForm } from "react-hook-form";
import Button from "@comp/form/Button";
import Picture from "@comp/container/Picture";
import chevronIcon from '@icons/down-icon.png'
import useMultipleBase64 from "src/hooks/useMultipleBase46";

const InsertHotelRooms = () =>{
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const {  limit, offset, updateOffset} = useLimiter()
    const { enableFetch, setEnableFetch, scrollEndRef, isIntersecting } = useInfiniteScroll();
    const { base64List, processImagesToBase64, reset:resetBase64 } = useMultipleBase64();

    const [files, setFiles] = useState<File[]>([])
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [chosenHotel, setChosenHotel] = useState<Hotel>()
    const [roomDetails, setRoomDetails] = useState<RoomDetailPayload[]>([])
    const [roomFacilities, setRoomFacilities] = useState<RoomFacilities>({
        isFreeBreakfast: false,
        isFreeWifi: false,
        isNonSmoking:false,
        isRefundable:false,
        isReschedule:false,
    });
    console.log(roomFacilities)

    const handleHotelChange = (hotel:Hotel) =>{
        setRoomFacilities({
            isFreeBreakfast: false,
            isFreeWifi: false,
            isNonSmoking:false,
            isRefundable:false,
            isReschedule:false,
        })
        setRoomDetails([])
        setFiles([])
        resetBase64()
        setChosenHotel(hotel)
    }
    const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setRoomFacilities(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const addRoomDetail = (data: any) => {
        const newRoomDetail: RoomDetailPayload = {
            hotelId: chosenHotel ? chosenHotel.ID : 0,
            name: data.name,
            price: Number(data.price),
            images: base64List,
            roomFacilities:roomFacilities,
            guest: Number(data.guest),
            bed: data.bed,
            area: Number(data.area),
            allocation: Number(data.allocation),
        };
        setRoomDetails(prev => [...prev, newRoomDetail]);
        setRoomFacilities({
            isFreeBreakfast: false,
            isFreeWifi: false,
            isNonSmoking:false,
            isRefundable:false,
            isReschedule:false,
        })
        reset(); 
        resetBase64(); 
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
                descrdescription : entry.description,
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = e.target.files
            setFiles((prevFiles) => [...prevFiles,...files ])
        }
    };

    useEffect(() => {
        processImagesToBase64(files);
    }, [files]);


    useEffect(() => {
        if(isIntersecting && !hotelsLoading && !error){
            setEnableFetch(true)
        }

    }, [isIntersecting, hotelsLoading, hotels])

    const submitRoomDetail = async () =>{
        const response = await fetch(ApiEndpoints.HotelRoomDetailsCreate, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roomDetails),
            credentials: 'include',
        });
        const data = await response.json();
        console.log(data.message)
        if (!response.ok) throw new Error('Network response was not ok');
    }
    
    console.log(hotels)
    return(
        <Container direction="row" width="100%" height="100%"  className="no-br c-white no-padding ">
            <Bento width="50%" height="100%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary">
                    {!hotelsLoading &&
                        <>
                            {hotels.map((hotel, index)=>{
                                return(
                                    <Button key={index} onClick={()=>{handleHotelChange(hotel)}} className="bento-btn">
                                        <Label color={`${chosenHotel?.ID == hotel.ID ? styles.white :styles.secondaryWhite}`} >
                                                {hotel.ID}, {hotel.name}, {hotel.cityId}
                                        </Label>
                                        <Picture width="25px" height="25px" className="bento-icon icon-right" src={chevronIcon}/>
                                    </Button>
                                )
                            })}
                        </>
                    }
                    <div ref={scrollEndRef}></div>

                </Container>
            </Bento>
            <Container className="no-padding" width="50%" height="100%" direction="column">
                {chosenHotel &&
                    <>
                    <Bento width="100%" height="40%">
                        <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary">
                            {roomDetails.map((roomDetail, index)=>{
                                return(
                                    <Label key={index} color={styles.white}>{roomDetail.name}</Label>
                                )
                            })
                            }  
                        
                        </Container>
                    </Bento>
                    <Bento width="100%" height="60%">
                        <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary">
                        <form onSubmit={handleSubmit(addRoomDetail)} className="w-full top-bottom-form">
                            <Container width="100%" gap={styles.g4} className="no-padding" direction="column">
                                <TextField width="100%" color={styles.white} outlineColor={styles.secondaryWhite} name="name" prompt="Name" register={register} rules={{ required: "*Required" }} error={errors.name}/>
                                <TextField width="100%" color={styles.white} outlineColor={styles.secondaryWhite} name="bed" prompt="Bed Type" register={register} rules={{ required: "*Required" }} error={errors.bed} />
                                <Container width="100%" className="no-padding" gap={styles.g4}>
                                    <TextField width="50%" type="number" color={styles.white} outlineColor={styles.secondaryWhite} name="price" prompt="Price" register={register} rules={{ required: "*Required" }} error={errors.price}/>
                                    <TextField width="50%" type="number" color={styles.white} outlineColor={styles.secondaryWhite} name="guest" prompt="Guest Capacity" register={register} rules={{ required: "*Required" }} error={errors.guest}  />
                                </Container>
                                <Container width="100%" className="no-padding" gap={styles.g4}>
                                    <TextField width="50%" type="number" color={styles.white} outlineColor={styles.secondaryWhite} name="area" prompt="Room Area (sqft)" register={register} rules={{ required: "*Required" }} error={errors.area} />
                                    <TextField width="50%" type="number" color={styles.white} outlineColor={styles.secondaryWhite} name="allocation" prompt="Allocation Count" register={register} rules={{ required: "*Required" }} error={errors.allocation} />
                                </Container>
                                <Container gap={styles.g2} className="no-padding">
                                    <CheckBox onChange={handleFacilityChange} name="isFreeBreakfast" > Free Breakfast</CheckBox>
                                    <CheckBox onChange={handleFacilityChange} name="isFreeWifi" > Free Wifi</CheckBox>
                                    <CheckBox onChange={handleFacilityChange} name="isNonSmoking" >Non-Smoking</CheckBox>
                                    <CheckBox onChange={handleFacilityChange} name="isRefundable">Refundable</CheckBox>
                                    <CheckBox onChange={handleFacilityChange} name="isReschedule">Reschedule</CheckBox>
                                </Container>
                                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                            </Container>
                            <Button submit className="" >Add Room Details</Button>
                        </form>
                        
                        </Container>
                    </Bento>
                    <Bento width="100%" height=''>
                        <Button onClick={submitRoomDetail} className="sidebar-btn ">
                            <Label color={styles.white}>Continue</Label>
                        </Button>
                    </Bento>
                    </>
                }
                
            </Container>
            
        </Container>
    );
}
export default InsertHotelRooms