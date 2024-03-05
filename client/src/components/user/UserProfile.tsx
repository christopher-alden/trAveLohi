import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "src/context/userContext"
import styles from '@styles/global.module.scss'
import TextField from "@comp/form/TextField"
import { AttributeRules, SecurityQuestion, UserGender } from "@util/user.util"
import { useForm } from "react-hook-form"
import DatePicker from "@comp/form/DatePicker"
import Dropdown from "@comp/form/Dropdown"
import CheckBox from "@comp/form/CheckBox"
import Button from "@comp/form/Button"
import useBase64 from "src/hooks/useBase64"
import { useMutation } from "react-query"
import { ApiEndpoints } from "@util/api.utils"
import { UserUpdatePayload } from "@myTypes/user.types"
import { create } from "lodash"

const UserProfile = () =>{
    const {user, loading} = useContext(UserContext)
    const { processImageToBase64, base64 } = useBase64();
    const { register, handleSubmit, formState: { errors } } = useForm<UserUpdatePayload>();
    const [file, setFile] = useState<File | null>(null);
    const [isNewsletter, setisNewsletter] = useState<boolean>(user!.isNewsletter);

    console.log(isNewsletter)


    const onSubmit = (data:any)=>{
        createPromo(data)
    }
    const { mutate: createPromo, error, isLoading } = useMutation(
        async (data: any) => {
            const userProfile:UserUpdatePayload = {
                isNewsletter: isNewsletter,
                userId: user?.ID!,
                profilePhoto:base64 || '',
                ...data

            };
            console.log(userProfile)
    
            const res = await fetch(ApiEndpoints.UserUpdateProfile, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userProfile),
                credentials: 'include',
            });
    
            if (!res.ok) {
                throw new Error('Failed to update user');
            }
    
            return res.json();
        },
        {
            onSuccess: () => {
                console.log("Update success");
            },
            onError: () => {
                console.error("pntk");
            },
        }
    );

    
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
    if(loading) return<></>

    return(
        <Container className="no-padding" direction="column" width="50%" height="100%" gap={styles.g4}>
            <form onSubmit={handleSubmit(onSubmit)} className="form-top-bottom" >
            <Container direction='row' px="0px"  py='0px' width='100%' gap={styles.g4}>
                <TextField defaultValue={user?.firstName} name='firstName' register={register} rules={AttributeRules.firstName} error={errors.firstName} width='50%'  prompt='First Name' />
                <TextField defaultValue={user?.lastName} name='lastName' register={register} rules={AttributeRules.lastName} error={errors.lastName} width='50%' color={styles.black} prompt='Last Name' outlineColor='black' />
            </Container>
            <Container direction='column' px="0px" py="0px" width='100%' gap={styles.g4}>
                <Dropdown defaultValue={user?.gender} name='gender' register={register} rules={AttributeRules.gender} error={errors.gender} width='100%' prompt='Gender' options={Object.values(UserGender)}></Dropdown>
                <DatePicker defaultValue={user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : undefined} restrictDate name='dateOfBirth' register={register} rules={AttributeRules.dob} error={errors.dateOfBirth} prompt='Date of Birth' width='100%' ></DatePicker>
                <TextField defaultValue={user?.address} name='address' register={register} rules={''} width='100%' error={errors.address} color={styles.black} prompt='Address' outlineColor='black'/>
                <TextField defaultValue={user?.phoneNumber} type="number" name="phoneNumber" register={register} rules={''} width='100%' error={errors.phoneNumber} color={styles.black} prompt='Phone Number' outlineColor='black'/>
                <Container width="100%" direction="column" px='0px' py={styles.g4} gap={styles.g1}>
                    <label className="custom-file-upload" htmlFor="file">Profile Picture</label>
                    <input id="file" onChange={handleFileChange} className="input-file" type="file" accept="image/*" />
                </Container> 
                <CheckBox defaultValue={user?.isNewsletter} onChange={(e)=>{setisNewsletter(e.target.checked)}}>I want to recieve newsletters and updates from trAveLohi</CheckBox>
                <Container width='100%' direction='column' px='0px' py={styles.g4} gap={styles.g4}>
                    <Button submit={true} className='primary-btn'>Update</Button>
                </Container>
            </Container>
            </form>
        </Container>
    )

}

export default UserProfile