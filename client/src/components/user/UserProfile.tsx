import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import { useContext } from "react"
import { UserContext } from "src/context/userContext"
import styles from '@styles/global.module.scss'
import TextField from "@comp/form/TextField"
import { AttributeRules, SecurityQuestion, UserGender } from "@util/user.util"
import { useForm } from "react-hook-form"
import DatePicker from "@comp/form/DatePicker"
import Dropdown from "@comp/form/Dropdown"
import CheckBox from "@comp/form/CheckBox"
import Button from "@comp/form/Button"

const UserProfile = () =>{
    const {user} = useContext(UserContext)
    const { register, handleSubmit, formState: { errors } } = useForm();

    return(
        <Container direction="column" width="50%" height="100%" gap={styles.g4}>
            <Container direction='row' px="0px"  py='0px' width='100%' gap={styles.g4}>
                <TextField defaultValue={user?.firstName} name='firstName' register={register} rules={AttributeRules.firstName} error={errors.firstName} width='50%'  prompt='First Name' />
                <TextField defaultValue={user?.lastName} name='lastName' register={register} rules={AttributeRules.lastName} error={errors.lastName} width='50%' color={styles.black} prompt='Last Name' outlineColor='black' />
            </Container>
            <Container direction='column' px="0px" py="0px" width='100%' gap={styles.g4}>
                <TextField defaultValue={user?.email} name='email' register={register} rules={AttributeRules.email} width='100%' error={errors.email} color={styles.black} prompt='Email' outlineColor='black'/>
                <TextField defaultValue={user?.email} name='phoneNumber' register={register} rules={AttributeRules.email} width='100%' error={errors.email} color={styles.black} prompt='Phone Number' outlineColor='black'/>
                <TextField defaultValue={user?.email} name='address' register={register} rules={AttributeRules.email} width='100%' error={errors.email} color={styles.black} prompt='Adrress' outlineColor='black'/>
                
                <CheckBox>I want to recieve newsletters and updates from trAveLohi</CheckBox>
                <Container width='100%' direction='column' px='0px' py={styles.g4} gap={styles.g4}>
                    <Button submit={true} className='primary-btn'>Register</Button>
                </Container>
            </Container>
        </Container>
    )

}

export default UserProfile