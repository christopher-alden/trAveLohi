import Bento from "@comp/container/Bento"
import Container from "@comp/container/Container"
import Button from "@comp/form/Button"
import CustomTextArea from "@comp/form/CustomTextArea"
import Label from "@comp/form/Label"
import TextField from "@comp/form/TextField"
import styles from "@styles/global.module.scss"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useBase64 from "src/hooks/useBase64"

const InsertHotel = () =>{

    const [files, setFiles] = useState<File[]>([]);
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    // const {processImageToBase64,base64} = useBase64();

    const { register, handleSubmit, watch, formState: { errors } } = useForm<Promo>({
        defaultValues: {
            image: undefined,
            amount: 0,
            description: '',
            fromDate: new Date(),
            toDate: new Date(),
            code: '',
            isValid: true,
        }
    });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setFiles((prevUploadedPhotos) => [...prevUploadedPhotos, selectedFile]);
        }
    }

    useEffect(() => {
        
    }, [files])
    
    return(
        <Container direction='column' width="100%" height="100%"  className="no-br c-white no-padding">
            <Bento width="50%" height="100%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary scroll-y">
                    <Label color={styles.white} fontSize={styles.f3xl}>Hotel</Label>
                    <Container px="0px" py="0px" width="100%" height="100%" gap={styles.g16}>
                        <Container width="100%" height="100%" px="0px" py="0px" direction="column" gap={styles.g4}>
                            <form onSubmit={()=>{}} className="form-top-bottom" >
                                <Container width="100%" px="0px" py="0px" direction="column" gap={styles.g4}>
                                    <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='name' register={register} rules={{ required: "*Required" }} error={errors.code} width='100%' prompt='Hotel Name' />
                                    <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='address' register={register} rules={{ required: "*Required" }} error={errors.description} width='100%' prompt='Address' />
                                    <CustomTextArea prompt="Description" color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} width="100%"  height="300px" className="fuckyou outline" name="description" register={register} rules={{ required: "*Required" }} error={errors.code}></CustomTextArea>
                                    <Container width="100%" direction="column" px='0px' py={styles.g4} gap={styles.g1}>
                                        <label className="custom-file-upload" htmlFor="file">Input Hotel Images</label>
                                        <input id="file" onChange={handleFileChange} className="input-file" type="file" accept="image/*" />
                                    </Container>                                    
                                </Container>
                                <Container width='100%' direction='column' px='0px' py={styles.g4} gap={styles.g4}>
                                    <Button submit className='sidebar-btn'>
                                        <Label color={styles.white}>Create Promo</Label>
                                    </Button>
                                </Container>
                            </form>
                        </Container>
                    </Container>
                </Container>
            </Bento>
        </Container>
    )
}

export default InsertHotel