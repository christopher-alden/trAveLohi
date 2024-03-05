// Import necessary assets and components
import React, { useState, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Picture from "@comp/container/Picture";
import Container from "@comp/container/Container";
import Label from '@comp/form/Label';
import Button from '@comp/form/Button';
import TextField from '@comp/form/TextField';
import Dialog from '@comp/container/Dialog';
import styles from '@styles/global.module.scss';
import { ApiEndpoints } from '@util/api.utils';
import blueBg from '@assets/blue-bg.jpg';
import fullLogo from '@assets/full-logo.png';
import arrow from '@icons/arrow-icon.png';
import { AttributeRules } from '@util/user.util';

// Dialog action types
const OPEN_SUCCESS_DIALOG = 'OPEN_SUCCESS_DIALOG';
const OPEN_FAILURE_DIALOG = 'OPEN_FAILURE_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

// Dialog reducer for managing dialog states
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

// ForgotPassword component
const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
	const [validated, setValidated] = useState<boolean>(false)
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [state, dispatch] = useReducer(dialogReducer, { successDialogOpen: false, failureDialogOpen: false });
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const newPassword = watch("newPassword");

    // Function to handle the submission of the email for validation
    const onValidateEmail = async (entry:any) =>{
		console.log(email)
        try {
			const url = `${ApiEndpoints.UserValidateEmail}?email=${encodeURIComponent(entry.email)}`;
			const res = await fetch(url, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include'
			});

			const data = await res.json();
			if (res.ok && data.message == 'Success') {
				setSecurityQuestion(data.securityQuestion)
				setEmail(entry.email);
				setValidated(true)

			}
			else{
				dispatch({ type: OPEN_FAILURE_DIALOG });
			}
			console.log(data)
		} catch (error) {
			
		}
		reset()
		
    }

    // Function to handle the submission of the new password
    const onSubmitPasswordUpdate = async (data:any) => {
		console.log(email)
        const payload = {
            userEmail: email,
            securityQuestionAnswer: data.securityQuestionAnswer,
            newPassword: data.newPassword,
        };

		console.log(payload)
        try {
            const response = await fetch(ApiEndpoints.UpdatePassword, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

			const data =  await response.json()
			console.log(data.message)
            if (response.ok) {
                dispatch({ type: OPEN_SUCCESS_DIALOG });
                reset();
            } else {
                dispatch({ type: OPEN_FAILURE_DIALOG });
            }
        } catch (error) {
            console.error('Failed to update password:', error);
            dispatch({ type: OPEN_FAILURE_DIALOG });
        }
    };

    const closeDialog = () => {
        dispatch({ type: CLOSE_DIALOG });
    };

	console.log(validated)
	//@ts-ignore
    return (
        <>
            <div className="background-dim">
                <Picture src={blueBg} width="100vw" height="100vh" className="background-image zoom-in-out" />
            </div>
            <Container width={'100%'} height={'20vh'} direction={'column'} center={true} px="0" className='optical-center-logo'>
                <Picture src={fullLogo} width='200px'/>
            </Container>
            <Container width={'100%'} height={'55vh'} direction={'column'} center={true} px="0px" py="0px">
                <Container px='0px' py={styles.g4} width='30%'>
                    <Link to='/login' className='link-with-icon'>
                        <Picture width='25px' src={arrow}/>
                        <Label fontSize={styles.fxl} color={styles.white}>Back to Login</Label>
                    </Link>
                </Container>
                {!validated ?
                    <form className='full-cflex' onSubmit={handleSubmit(onValidateEmail)}>
                        <Container gap={styles.g4} width='30%' className='bg-white' direction='column'>
                            <Label fontSize={styles.f3xl}>Forgot Password</Label>
                            <Label>Enter the email address associated with your account, and we'll send you a link to reset your password.</Label>
                            <Container direction='column' px="0px" py={styles.g4} width='100%' gap={styles.g4}>
                                <TextField name='email' register={register} rules={{ required: "Email is required" }} error={errors.email} width='100%' color={styles.black} prompt='Email' outlineColor='black'/>
                            </Container>
                            <Button submit={true} className='primary-btn'>Continue</Button>
                        </Container>
                    </form>
                :
                    <form className='full-cflex' onSubmit={handleSubmit(onSubmitPasswordUpdate)}>
                        <Container gap={styles.g4} width='30%' className='bg-white' direction='column'>
                            <Label fontSize={styles.f3xl}>Reset Password</Label>
                            <Label>Please answer your security question to confirm it's really you.</Label>
                            <Container direction='column' px="0px" py={styles.g4} width='100%' gap={styles.g4}>
                                <TextField name='securityQuestionAnswer' register={register} rules={AttributeRules.sqa} error={errors.securityQuestionAnswer} width='100%' color={styles.black} prompt={securityQuestion} outlineColor='black'/>
                                <TextField name='newPassword' register={register} rules={AttributeRules.password} error={errors.newPassword} width='100%' color={styles.black} prompt='New password' outlineColor='black'/>
                                
								<TextField name='newPasswordConfirm' register={register} rules={{ validate: value => value === newPassword || "Passwords do not match" }} error={errors.newPasswordConfirm} width='100%' color={styles.black} prompt='Confirm new password' outlineColor='black'/>
                            </Container>
                            <Button submit={true} className='primary-btn'>Reset Password</Button>
                        </Container>
                    </form>
                }
            </Container>
            {state.successDialogOpen && (
                <Dialog open={true} title='Success' onClose={closeDialog}>
                    Your password has been reset successfully.
                </Dialog>
            )}
            {state.failureDialogOpen && (
                <Dialog open={true} title='Error' onClose={closeDialog}>
                    There was an issue resetting your password. Please try again.
                </Dialog>
            )}
        </>
    );
};

export default ForgotPassword;
