import Bento from "@comp/container/Bento"
import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture"
import Button from "@comp/form/Button"
import CheckBox from "@comp/form/CheckBox"
import CustomTextArea from "@comp/form/CustomTextArea"
import Label from "@comp/form/Label"
import TextField from "@comp/form/TextField"
import FloatingSearch from "@comp/navigation/FloatingSearch"
import { HotelFacilities, HotelPayload } from "@myTypes/hotel.types"
import { Airport, AirportDetails, City } from "@myTypes/location.types"
import styles from "@styles/global.module.scss"
import { ApiEndpoints } from "@util/api.utils"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSearch } from "src/context/searchContext"
import useMultipleBase64 from "src/hooks/useMultipleBase46"

const InsertHotel = () =>{
    const { handleSearch, searchResults } = useSearch();

    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
    const [location, setLocation] = useState<City>();
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    const { base64List, processImagesToBase64, errors: base64Errors, reset:resetBase64 } = useMultipleBase64();
    const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<HotelPayload>({
        defaultValues: {
            name:'',
            images: undefined,
            description: '',
            rating: 0,
            address:'',
            cityId: 0,
            facilitiesId: undefined,
        }
    });


    const handleFacilityChange = (facilityId: number, isChecked: boolean) => {
        setSelectedFacilities(prev =>
            isChecked
                ? [...prev, facilityId]
                : prev.filter(id => id !== facilityId)
        );
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files;
        if (newFiles) {
            const fileList = Array.from(newFiles);
            setFiles((prevFiles)=>[...prevFiles, ...fileList]);
        }
    };
    

    const handleLocationSelect = (location: AirportDetails) => {
        setLocation(location.city)
        setIsSearchVisible(false); 
    };


    useEffect(() => {
        processImagesToBase64(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setUploadedPhotos(previews);

        return () => previews.forEach(preview => URL.revokeObjectURL(preview));
    }, [files]);
    
    
    const onSubmit = async (data: HotelPayload) => {

        const payload = {
            ...data,
            cityId: location?.ID || 0,
            facilitiesId: selectedFacilities,
            images: base64List,
        };
    
        try {
            const response = await fetch(`${ApiEndpoints.HotelCreate}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json()
            console.log(data.message)
            if (!response.ok) throw new Error('Failed to insert hotel');
        } catch (error) {
            console.error('Error inserting hotel:', error);
        }

        reset()
        setSelectedFacilities([])
        setFiles([])
        setUploadedPhotos([])
        resetBase64()
        setLocation(undefined)
    };


    return(
        <>
        <Container direction='row' width="75vw" height="100%"  className="no-br c-white no-padding">
            <Bento width="50%" height="100%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y">
                    <Label color={styles.white} fontSize={styles.f3xl}>Hotel</Label>
                    <Container px="0px" py="0px" width="100%" height="100%" gap={styles.g16}>
                        <Container width="100%" height="100%" px="0px" py="0px" direction="column" gap={styles.g4}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form-top-bottom" >
                                <Container width="100%" px="0px" py="0px" direction="column" gap={styles.g4}>
                                    <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='name' register={register} rules={{ required: "*Required" }} error={errors.name} width='100%' prompt='Hotel Name' />
                                    <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='address' register={register} rules={{ required: "*Required" }} error={errors.description} width='100%' prompt='Address' />
                                    <CustomTextArea prompt="Description" color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} width="100%"  height="300px" className="fuckyou outline" name="description" register={register} rules={{ required: "*Required" }} error={errors.description}></CustomTextArea>
                                    <Container onClick={()=>{setIsSearchVisible(!isSearchVisible)}} width="100%" px={styles.g4} py={styles.g2} className="outline-secondary no-br">
                                        <Label color={styles.secondaryWhite} >
                                                {location ? `${location.name}, ${location.country?.name}` : 'Choose Location'}
                                        </Label>
                                    </Container>
                                    <Container width="100%" direction="column" px='0px' py={styles.g4} gap={styles.g1}>
                                        <label className="custom-file-upload" htmlFor="file">Input Hotel Images</label>
                                        <input id="file" onChange={handleFileChange} className="input-file" type="file" accept="image/*" multiple/>
                                    </Container>                                    
                                </Container>
                                <Container width='100%' direction='column' px='0px' py={styles.g4} gap={styles.g4}>
                                    <Button submit className='sidebar-btn'>
                                        <Label color={styles.white}>Insert Hotel</Label>
                                    </Button>
                                </Container>
                            </form>
                        </Container>
                    </Container>
                </Container>
            </Bento>
            <Container direction="column" className="no-padding" height="100%" width="50%">
                <Bento width="100%" height="30%">
                    <Container width="100%" height="100%" className="no-padding fuck-grow wrap bg-black-gradient br-bento outline-secondary scroll-y" direction="column" gap={styles.g8}>
                        <Container height="100%" gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" className="">
                            <Label color={styles.white} className="lh-3xl" fontSize={styles.f3xl}>Facilities</Label>
                            <Container gap={styles.g4} className="no-padding wrap items-start" width="100%">
                                {Object.values(HotelFacilities).map((facility) => (
                                    <CheckBox
                                        key={facility.id}
                                        name={facility.name}
                                        onChange={(e) => handleFacilityChange(facility.id, e.target.checked)}
                                    >
                                        {facility.name.replace(/([A-Z])/g, ' $1').trim()}
                                    </CheckBox>
                                ))}
                            </Container>
                        </Container>
                    </Container>
                </Bento>
                <Bento width="100%" height="70%" className="no-padding">
                    <Container gap={styles.g4} direction="row" px={styles.g8} py={styles.g8} width="100%" height="100%" className="fuck-grow wrap bg-black-gradient br-bento outline-secondary scroll-y no-padding">
                        <Container height="100%" gap={styles.g4} direction="column"  width="100%" className="no-padding">
                            <Label color={styles.white} fontSize={styles.f3xl}>Uploaded Pictures</Label>
                            <Container className="no-padding wrap" width="100%">
                                {uploadedPhotos.map((photo, index) => (
                                    <Picture key={index} width='100px' height="100px" src={photo}></Picture>
                                    ))}
                            </Container>
                        </Container>
                    </Container>
                </Bento>
            </Container>
        </Container>
            {isSearchVisible && (
                <FloatingSearch handleClose={() => setIsSearchVisible(false)} onSearchChange={handleSearch}>
                    {searchResults.map((result, index) => (
                        <Label
                            className="search-results pointer" 
                            key={index}
                            onClick={() => handleLocationSelect(result)}
                            color={styles.white}
                        >
                            {`${result.city?.name}, ${result.country}`}
                        </Label>
                    ))}
                </FloatingSearch>
            )}

        </>
    )
}

export default InsertHotel