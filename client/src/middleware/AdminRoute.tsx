import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '@styles/global.module.scss'
import Label from '@comp/form/Label';
import { UserRole } from '@myTypes/user.types';

import Oops from '@pages/Oops';

import {UserContext} from 'src/context/userContext';
// import {CircularProgress, Snackbar, Alert} from '@mui/material';

type protectedRouteProps = {
	children: React.ReactNode;
};

const AdminRoute = ({children}: protectedRouteProps) => {
	const duration = 3000;
	const {user, loading} = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading) {
			if (!user || user.role !== UserRole.admin) {
				const timer = setTimeout(() => {
					navigate('/');
				}, duration);

				return () => clearTimeout(timer);
			}
		}
	}, [user, loading]);

	if (loading) {
		return (
			<div
				style={{
					width: '100vw',
					height: '100vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>

				LOADING INI SIA BOY
				//TODO: bikin loader INI LOADING
			</div>
		);
	}
	if (!loading && !user) {
		return <Oops></Oops>;
	}
    if(user?.role !== 'admin'){
        return <Label fontSize={styles.f8xl}>YANG BENER AJA, RUGI DONG</Label>
    }

	return <>{children}</>;
};

export default AdminRoute;
