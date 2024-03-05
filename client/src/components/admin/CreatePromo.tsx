import Container from "@comp/container/Container"
import Button from "@comp/form/Button";
import DatePicker from "@comp/form/DatePicker";
import Label from "@comp/form/Label"
import TextField from "@comp/form/TextField";
import Promo from "@comp/product/Promo";
import styles from '@styles/global.module.scss'
import { useForm } from "react-hook-form";
import test from '@assets/mogged.jpg'
import useBase64 from "src/hooks/useBase64";
import { useEffect, useState } from "react";
import { ApiEndpoints } from "@util/api.utils";
import Bento from "@comp/container/Bento";
import { useMutation } from "react-query";


const CreatePromo = () =>{
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<Promo>({
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

    const { processImageToBase64, base64 } = useBase64();

    const promoData = watch();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setFile(selectedFile);
        } else {
            setFile(null);
        }
    };

    useEffect(() => {
        if (file) {
            processImageToBase64(file);
        }
    }, [file]);

    const onSubmit = (data: any) =>{
        createPromo(data)
        reset()
    }

    const { mutate: createPromo, error, isLoading } = useMutation(
        async (promo: Promo) => {
            if (!base64) {
                throw new Error("Base64 image is not provided.");
            }
    
            const promoForApi = {
                ...promo,
                image: base64,
                isValid: promo.isValid.toString(),
            };
            console.log(promoForApi)
    
            const res = await fetch(ApiEndpoints.PromoCreate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(promoForApi),
                credentials: 'include',
            });
    
            if (!res.ok) {
                throw new Error('Failed to create promo');
            }
    
            return res.json();
        },
        {
            onSuccess: (data) => {
                console.log("Promo created successfully:", data);
            },
            onError: (error) => {
                console.error("Error creating promo:", error);
            },
        }
    );

    return(
        <Container direction="row" width="100%" height="100%"  className="no-br c-white no-padding ">
            <Bento width="50%" height="100%">
                <Container gap={styles.g4} direction="column" px={styles.g8} py={styles.g8} width="100%" height="100%" className="bg-black-gradient br-bento outline-secondary">
                    <Label color={styles.white} fontSize={styles.f3xl}>Create Promo</Label>
                    <Container px="0px" py="0px" width="100%" height="100%" gap={styles.g16}>
                        <Container width="100%" height="100%" px="0px" py="0px" direction="column" gap={styles.g4}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form-top-bottom" >
                                <Container width="100%" px="0px" py="0px" direction="column" gap={styles.g4}>
                                    <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='code' register={register} rules={{ required: "*Required" }} error={errors.code} width='100%' prompt='Promo Code' />
                                    <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='description' register={register} rules={{ required: "*Required" }} error={errors.description} width='100%' prompt='Description' />
                                    <TextField color={styles.secondaryWhite} outlineColor={styles.secondaryBlack} name='amount' type="number" register={register} rules={{ required: "*Required" }} error={errors.amount} width='100%' prompt='Amount' />
                                    <DatePicker today color={styles.secondaryWhite} className=" bg-transparent outline-secondary calendar-light" name='fromDate' register={register} rules={{ required: "*Required" }} error={errors.fromDate} prompt='From Date' width='100%' />
                                    <DatePicker today color={styles.secondaryWhite} className="bg-transparent outline-secondary calendar-light" name='toDate' register={register} rules={{ required: "*Required" }} error={errors.toDate} prompt='To Date' width='100%' />
                                    <Container width="100%" direction="column" px='0px' py={styles.g4} gap={styles.g1}>
                                        <label className="custom-file-upload" htmlFor="file">Input Promo Image</label>
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
            <Bento width="50%" height="100%">
                <Container px={styles.g8} py={styles.g8} center width="100%" direction="column" className="bg-black-gradient outline-secondary br-bento" gap={styles.g4}>
                    <Label color={styles.white} fontSize={styles.f3xl} className="text-left">Preview</Label>
                    <Promo promo={{...promoData,image :`${base64 || test}`}} height="350px" />
                </Container>
            </Bento>
            </Container>

    )
}

export default CreatePromo