//ASSETS
import blueBg from '@assets/blue-bg.jpg'
import fullLogo from '@assets/full-logo.png'
import arrow from '@icons/arrow-icon.png'
//COMP
import Picture from "@comp/container/Picture";
import Container from "@comp/container/Container";
import { Link } from 'react-router-dom';
import Label from '@comp/form/Label';
import Button from '@comp/form/Button';
import TextField from '@comp/form/TextField';
//STYLES
import styles from '@styles/global.module.scss'
//TYPES
import { AttributeRules } from '@util/user.util';

import { useForm } from 'react-hook-form';
import Dialog from '@comp/container/Dialog';
import { ApiEndpoints } from '@util/api.utils';
import { useReducer, useState } from 'react';

const OPEN_SUCCESS_DIALOG = 'OPEN_SUCCESS_DIALOG';
const OPEN_FAILURE_DIALOG = 'OPEN_FAILURE_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const dialogReducer = (state:any, action:any) => {
    switch (action.type) {
        case OPEN_SUCCESS_DIALOG:
            return { ...state, successDialogOpen: true, failureDialogOpen: false };
        case OPEN_FAILURE_DIALOG:
            return { ...state, successDialogOpen: false, failureDialogOpen: true };
        case CLOSE_DIALOG:
            return { ...state, successDialogOpen: false, failureDialogOpen: false };
        default:
            return state;
    }
};

const ForgotPassword = () => {
    const {register:emailRegister, handleSubmit:emailHandleSubmit, formState: { errors:emailErrors }, reset:emailReset } = useForm();
	const [emailValidated, setEmailValidated] = useState(false);
	const [securityQuestion, setSecurityQuestion] = useState();
	const [state, dispatch] = useReducer(dialogReducer, {
        successDialogOpen: false,
        failureDialogOpen: false,
    });
    const onValidateEmail = async (email:any) =>{
		console.log(email)
        try {
			const url = `${ApiEndpoints.UserValidateEmail}?email=${encodeURIComponent(email.email)}`;
			const res = await fetch(url, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include'
			});

			const data = await res.json();
			if (res.ok && data.message == 'Success') {
                setEmailValidated(true)
				setSecurityQuestion(data.securityQuestion)
			}
			else{
				setEmailValidated(false);
				dispatch({ type: OPEN_FAILURE_DIALOG });
			}
			console.log(data)
		} catch (error) {
			
		}
		emailReset()
		
    }

	const closeDialog = () => {
        dispatch({ type: CLOSE_DIALOG });
    };
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
			>
                <Picture src={fullLogo} width='200px'/>
			</Container>
            <Container
				width={'100%'}
				height={'55vh'}
				direction={'column'}
				center={true}
				px="0px"
                py="0px"
			>
                <Container px='0px' py='0px' width='30%'>
                    <Link to='/login' className='link-with-icon'>
                        <Picture width='25px' src={arrow}/>
                        <Label fontSize={styles.fxl} color={styles.white}>Back to Login</Label>
                    </Link>
                </Container>
				{!emailValidated ?
				<form className='full-cflex' onSubmit={emailHandleSubmit(onValidateEmail)}>
					<Container gap={styles.g4} width='30%' className='bg-white' direction='column'>
						<Label fontSize={styles.f3xl}>Forgot Password</Label>
						<Label fontSize={styles.fsm}>Enter the email address associated with your account and we'll try to help you out!</Label>
						<Container direction='column' px="0px" py={styles.g4}  width='100%' gap={styles.g4}>
							<TextField name='email' register={emailRegister} rules={AttributeRules.email} error={emailErrors.email} width='100%' color={styles.black} prompt='Email' outlineColor='black'/>
						</Container>
                            <Button submit={true} className='primary-btn'>Continue</Button>
					</Container>
				</form>
				:
                <form className='full-cflex' onSubmit={emailHandleSubmit(()=>{})}>
					<Container gap={styles.g4} width='30%' className='bg-white' direction='column'>
						<Label fontSize={styles.f3xl}>Forgot Password</Label>
						<Label fontSize={styles.fsm}>Please answer your security question to confirm if its really you</Label>
						
						<Container direction='column' px="0px" py={styles.g4}  width='100%' gap={styles.g4}>
							<TextField name='email' register={emailRegister} rules={AttributeRules.sqa} error={emailErrors.email} width='100%' color={styles.black} prompt={securityQuestion} outlineColor='black'/>
							<TextField name='email' register={emailRegister} rules={AttributeRules.password} error={emailErrors.email} width='100%' color={styles.black} prompt='New password' outlineColor='black'/>
							<TextField name='email' register={emailRegister} rules={AttributeRules.password} error={emailErrors.email} width='100%' color={styles.black} prompt='Confirm new password' outlineColor='black'/>
						</Container>
                            <Button submit={true} className='primary-btn'>Continue</Button>
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
                    Failed to verify to your email, please check again and retry :/
                </Dialog>
            )}
		</>
	);
};

export default ForgotPassword;
