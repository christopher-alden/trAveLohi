//ASSETS
import registerBg from '@assets/register-bg.jpeg';
import fullLogo from '@assets/full-logo.png';
import arrow from '@icons/arrow-icon.png'
//STYLES
import styles from '@styles/global.module.scss';
import '@styles/generic-styles/image.styles.scss';
import '@styles/generic-styles/container.styles.scss'
import '@styles/generic-styles/form.styles.scss'
//COMP
import Container from '@comp/container/Container';
import Picture from '@comp/container/Picture';
import Label from '@comp/form/Label';
import TextField from '@comp/form/TextField';
import Button from '@comp/form/Button';
import Dropdown from '@comp/form/Dropdown';
import DatePicker from '@comp/form/DatePicker';

import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserContext } from 'src/context/userContext';
import { useContext } from 'react';

//TYPES
import { UserGender, SecurityQuestion, AttributeRules  } from '@util/user.util';
import { RegisterUserModel, UserRole } from '@myTypes/user.types';
import CheckBox from '@comp/form/CheckBox';
import { useMutation } from 'react-query';
import { ApiEndpoints } from '@util/api.utils';
import useSendEmail, { EmailSetup } from 'src/hooks/useSendEmail';

type RegisterResponse = {
    data: any,
    email: string
}

const Register = () =>{
    const { register: registerContext } = useContext(UserContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { setupEmail } = useSendEmail();
    const navigate = useNavigate();

    const { mutate: registerUser, error, isLoading } = useMutation<RegisterResponse, Error, RegisterUserModel>(registerContext, {
        onSuccess: (data) => {
            const emailArgs:EmailSetup = {
                email:data.email,
                api: ApiEndpoints.EmailSendWelcome,
                subject: "Welcome to trAveLohi"
            }
            setupEmail(emailArgs);
            navigate("/login");
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmit = async (data:any) => {
        const transformedUser: RegisterUserModel = {
        firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth,
            //TODO: inget ganti profile photo
            profilePhoto: "ok",
            securityQuestion: data.securityQuestion,
            securityQuestionAnswer: data.securityQuestionAnswer,
            //TODO: yg bener
            role: UserRole.user,
            isBanned: false,
            isNewsletter: false
        }
        registerUser(transformedUser);
    };

//TODO: validasi sama
    return(
        <Container px='0px' py='0px' width='100%' height='100vh' direction='row'>
            <div className="background-dim ">
				<Picture src={registerBg} width='100vw' height='100vh' className='background-image zoom-in-out'/>
			</div>
			<Container width={'50%'} direction='column' center={false}>
                <Container px={styles.g4} py={styles.g4}>
                    <Picture src={fullLogo} width='200px'/>
                </Container>
			</Container>

            <Container
				width={'50%'}
				height={'100%'}
				direction={'column'}
				center
				px="0px"
                py="0px"
			>
                <Container px='0px' py={styles.g4} width='80%'>
                    <Link to='/login' className='link-with-icon left'>
                        <Picture width='25px' src={arrow}/>
                        <Label fontSize={styles.fxl} color={styles.white}>Already have an account?</Label>
                    </Link>
                </Container>
                <form className='full-cflex' onSubmit={handleSubmit(onSubmit)}>
                    <Container width='80%' gap={styles.g4}  className='bg-white' direction='column'>
                            <Label fontSize={styles.f3xl}>Register</Label>
                            <Container direction='row' px="0px"  py='0px' width='100%' gap={styles.g4}>
                                <TextField name='firstName' register={register} rules={AttributeRules.firstName} error={errors.firstName} width='50%'  prompt='First Name' />
                                <TextField name='lastName' register={register} rules={AttributeRules.lastName} error={errors.lastName} width='50%' color={styles.black} prompt='Last Name' outlineColor='black' />
                            </Container>
                            <Container direction='column' px="0px" py="0px" width='100%' gap={styles.g4}>
                                <TextField name='email' register={register} rules={AttributeRules.email} width='100%' error={errors.email} color={styles.black} prompt='Email' outlineColor='black'/>
                                <TextField name='password' register={register} rules={AttributeRules.password} error={errors.password} width='100%' color={styles.black} prompt='Password' outlineColor='black'/>
                                
                                <TextField name='confirmPassword' register={register} rules={AttributeRules.password} error={errors.confirmPassword} width='100%' color={styles.black} prompt='Confirm Password' outlineColor='black'/>
                                
                                <DatePicker name='dateOfBirth' register={register} rules={AttributeRules.dob} error={errors.dateOfBirth} prompt='Date of Birth' width='100%' ></DatePicker>
                                <Dropdown  name='gender' register={register} rules={AttributeRules.gender} error={errors.gender} width='100%' prompt='Gender' options={Object.values(UserGender)}></Dropdown>
                                <Dropdown  name='securityQuestion' register={register} rules={AttributeRules.securityQuestion} error={errors.securityQuestion} width='100%' prompt='Security Question'  options={Object.values(SecurityQuestion)}></Dropdown>
                                <TextField name='securityQuestionAnswer' register={register} rules={AttributeRules.sqa} error={errors.securityQuestionAnswer} width='100%' color={styles.black} prompt='Security Question Answer' outlineColor='black'/>
                                <CheckBox>I want to recieve newsletters and updates from trAveLohi</CheckBox>
                                <Container width='100%' direction='column' px='0px' py={styles.g4} gap={styles.g4}>
                                    <Button submit={true} className='primary-btn'>Register</Button>
                                </Container>
                            </Container>
                    </Container>
                </form>
			</Container>
        </Container>
    );
}

export default Register