//ASSETS
import loginBg from '@assets/login-bg.jpg';
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

import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { UserContext } from 'src/context/userContext';

//TYPES
import { UserCredentials } from '@myTypes/user.types';
import { AttributeRules } from '@util/user.util';

const Login = () => {
	const { register, handleSubmit, formState: { errors } } = useForm();
	const { login } = useContext(UserContext);
	const navigate = useNavigate()

	const onSubmit = async (data:any)=>{
		const credentialsUser : UserCredentials = {
			email:data.email,
			password: data.password
		}
		const res = await login(credentialsUser)
		console.log(res)
		if(res === 'Success'){
			navigate('/')
		}
	}

	const onOTP = () =>{
		navigate("/OTP")
	}

	return (
		<>
			<div className="background-dim">
				<Picture src={loginBg} width='100vw' height='100vh' className='background-image zoom-in-out'/>
			</div>
			<Container
				width={'100%'}
				height={'20vh'}
				direction={'column'}
				center
				px="0"
			>
                <Picture src={fullLogo} width='200px'/>
			</Container>

            
            <Container
				width={'100%'}
				height={'55vh'}
				direction={'column'}
				center
				px="0px"
                py="0px"
			>
                <Container px='0px' py='0px' width='30%'>
                    <Link to='/register' className='link-with-icon'>
                        <Picture width='25px' src={arrow}/>
                        <Label fontSize={styles.fxl} color={styles.white}>Don't have an account?</Label>
                    </Link>
                </Container>
				<form className='full-cflex' onSubmit={handleSubmit(onSubmit)}>
					<Container gap={styles.g4} width='30%' className='bg-white' direction='column'>
						<Label fontSize={styles.f3xl}>Log In</Label>
						<Container direction='column' px="0px" py="0px" width='100%' gap={styles.g4}>
							<TextField name='email' register={register} rules={AttributeRules.email} error={errors.email} width='100%' color={styles.black} prompt='Email' outlineColor='black'/>
							<TextField name='password' register={register} rules={AttributeRules.password} error={errors.password} width='100%' color={styles.black} prompt='Password' outlineColor='black'/>
							<Link className='link' to={'/forgot-password'}><Label fontSize={styles.fsm} color={styles.blue}>Forgot Password?</Label></Link>
							<Container width='100%' direction='column' px='0px' py={styles.g4} gap={styles.g4}>
								<Button submit={true} className='primary-btn'>Login</Button>
								<hr></hr>
								<Button onClick={()=>{onOTP()}} className='outline-btn'>Login with OTP</Button>
							</Container>
						</Container>
					</Container>
				</form>
			</Container>
		</>
	);
};
export default Login;
