import { useState, useReducer, useContext } from 'react';
import Picture from '@comp/container/Picture';
import blueBg from '@assets/blue-bg.jpg';
import fullLogo from '@assets/full-logo.png'
import Container from '@comp/container/Container';
import { Link, useNavigate } from 'react-router-dom';
import Label from '@comp/form/Label';
import arrow from '@icons/arrow-icon.png'
import styles from '@styles/global.module.scss'
import { useForm } from 'react-hook-form';
import { AttributeRules } from '@util/user.util';
import TextField from '@comp/form/TextField';
import Button from '@comp/form/Button';
import Dialog from '@comp/container/Dialog';
import OTPInput from '@comp/form/OTPInput';
import { UserContext } from 'src/context/userContext';
import { UserOTP } from '@myTypes/user.types';
import { useMutation } from 'react-query';
import { queryClient } from 'src/App';
import  useSendEmail, { EmailSetup } from 'src/hooks/useSendEmail';
import { ApiEndpoints } from '@util/api.utils';


const OPEN_SUCCESS_DIALOG = 'OPEN_SUCCESS_DIALOG';
const OPEN_FAILURE_DIALOG = 'OPEN_FAILURE_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const dialogReducer = (state:any, action:any) => {
    switch (action.type) {
        case OPEN_SUCCESS_DIALOG:
            return {
                ...state,
                successDialogOpen: true,
                failureDialogOpen: false,
            };
        case OPEN_FAILURE_DIALOG:
            return {
                ...state,
                successDialogOpen: false,
                failureDialogOpen: true,
            };
        case CLOSE_DIALOG:
            return {
                ...state,
                successDialogOpen: false,
                failureDialogOpen: false,
            };
        default:
            return state;
    }
};

// There will be 2 states of validating the email & sending OTP
// Once email is validated then OTP is sent and user will be requested to enter the OTP

const OTP = () => {
    const { loading, loginOTP } = useContext(UserContext);
    const { register: emailRegister, formState: { errors: emailError }, handleSubmit: emailSubmit, reset: resetEmailForm } = useForm();
    const { setupEmail, isLoading:sendEmailLoading } = useSendEmail();

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [enteredOTP, setEnteredOTP] = useState<string>('');
    const navigate = useNavigate()
    const redirectDuration = 3000

    const handleOtpEntered = (otp: string) => {
        setEnteredOTP(otp);
    };

    const [state, dispatch] = useReducer(dialogReducer, {
        successDialogOpen: false,
        failureDialogOpen: false,
    });
    const closeDialog = () => {
        dispatch({ type: CLOSE_DIALOG });
    };

    const { mutate: loginOtpUser, error, isLoading } = useMutation<any, Error, UserOTP>(loginOTP, {
        onSuccess: () => {
            queryClient.invalidateQueries('userData');
            dispatch({ type: OPEN_SUCCESS_DIALOG });
            delayNavigate()
        },
        
    });

    // The async state will be managed on the useSendEmail
    const onEmailSubmit = async (data: any) => {
        const emailArgs:EmailSetup = {
            email:data.email,
            api: ApiEndpoints.EmailSendOTP,
            subject: "trAveLohi OTP Code",
            onSuccess: () => {
                console.log(data.email)
                setEmailSent(true);
                setEmail(data.email);
                resetEmailForm();
            },
            onError: (error) =>{
                console.error('Error sending email:', error);
                dispatch({ type: OPEN_FAILURE_DIALOG });
            }
        }
        setupEmail(emailArgs)
    };

    const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpUser: UserOTP = {
            email: email,
            OTP: enteredOTP,
        };
        loginOtpUser(otpUser)
    };


    // Ux shit
    const delayNavigate = () => {
        const timer = setTimeout(() => {
            navigate('/');
        }, redirectDuration);

        return () => clearTimeout(timer);
    }

    if(sendEmailLoading)return <>Email is fucking loading</>

    return (
        <>
            <div className="background-dim">
                <Picture
                    src={blueBg}
                    width="100vw"
                    height="100vh"
                    className="background-image zoom-in-out"
                />
            </div>
            <Container
                width={'100%'}
                height={'20vh'}
                direction={'column'}
                center={true}
                px="0"
                className='optical-center-logo'
            >
                <Picture src={fullLogo} width='200px' />
            </Container>
            <Container
                width={'100%'}
                height={'55vh'}
                direction={'column'}
                center={true}
                px="0px"
                py="0px"
            >
                <Container px='0px' py={styles.g4} width='30%'>
                    <Link to='/login' className='link-with-icon'>
                        <Picture width='25px' src={arrow} />
                        <Label fontSize={styles.fxl} color={styles.white}>Back to Login</Label>
                    </Link>
                </Container>
                {emailSent ?
                    <form className='full-cflex' onSubmit={onOtpSubmit}>
                        <Container center={true} gap={styles.g4} width='30%' className='bg-white' direction='column'>
                            <Label fontWeight='700' fontSize={styles.f3xl}>Verify OTP</Label>
                            <Label className='text-center' fontSize={styles.fsm}>Enter the OTP sent to {email.slice(0, 3) + "***" + email.slice(email.indexOf('@')) || ' your email'}</Label>
                            <Container center={true} direction='column' px="0px" py={styles.g8} width='100%' gap={styles.g4}>
                                <OTPInput onOtpEntered={handleOtpEntered}></OTPInput>
                            </Container>
                            <Button submit={true} className='primary-btn w-full'>Verify OTP</Button>
                        </Container>
                    </form>
                    :
                    <form className='full-cflex' onSubmit={emailSubmit(onEmailSubmit)}>
                        <Container gap={styles.g4} width='30%' className='bg-white' direction='column'>
                            <Label fontSize={styles.f3xl}>OTP</Label>
                            <Label fontSize={styles.fsm}>Enter the email address associated with your account, and we'll send an OTP code to your email</Label>
                            <Container  direction='column' px="0px" py={styles.g4} width='100%' gap={styles.g4}>
                                <TextField name='email' register={emailRegister} rules={AttributeRules.email} error={emailError.email} width='100%' color={styles.black} prompt='Email' outlineColor='black' />
                            </Container>
                            <Button submit={true} className='primary-btn' victor={loading}>
                                {loading ? "Loading" : "Continue"}
                            </Button>
                        </Container>
                    </form>
                }
            </Container>
            {state.successDialogOpen && (
                <Dialog open={true} title='Success' onClose={closeDialog}>
                    We'll redirect you in a few seconds
                </Dialog>
            )}
            {state.failureDialogOpen && (
                <Dialog open={true} title='Forgot your email?' onClose={closeDialog}>
                    Failed to send OTP to your email, please check again and retry :/
                </Dialog>
            )}
        </>
    );
};

export default OTP;
