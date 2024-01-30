import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import Oops from '@pages/Oops';

import {UserContext} from 'src/context/userContext';
// import {CircularProgress, Snackbar, Alert} from '@mui/material';

type protectedRouteProps = {
	children: React.ReactNode;
};

const ProtectedRoute = ({children}: protectedRouteProps) => {
	const duration = 3000;
	const {user, loading} = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading) {
			if (!user) {
				const timer = setTimeout(() => {
					navigate('/login');
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

	return <>{children}</>;
};

export default ProtectedRoute;
