import AdminRoute from 'src/middleware/AdminRoute';
import Sidebar from '@comp/navigation/Sidebar';
import React, {useContext} from 'react';
import {UserContext} from 'src/context/userContext';
import useContent from 'src/hooks/useContent';
import Label from '@comp/form/Label';
import styles from '@styles/global.module.scss';
import Container from '@comp/container/Container';
import Button from '@comp/form/Button';
import Bento from '@comp/container/Bento';

const Admin = () => {
	const {user} = useContext(UserContext);
	const {contents, content, switchContent} = useContent(user?.role);


	return (
		<AdminRoute>
				<Container className='no-padding bg-black-black no-br' width='100vw' height='100vh'>
				<Bento width='100%' height='100%'>
					{/* <Picture  width='' className='frieren' src={frieren}></Picture> */}
					<Container
						width="100%"
						height="100%"
						px="0px"
						py="0px"
					>
						<Sidebar label="Admin">
							{contents.map(({key, name}) => (
								<Button key={key} onClick={() => switchContent(key)} className={`sidebar-btn bg-black-secondary`}>
									<Label
										className={`pointer `}
										fontSize={styles.fbase}
										color={`${content?.key === key ? styles.white : styles.secondaryWhite}`}
									>
										{name}
									</Label>
								</Button>
							))}
						</Sidebar>
						<React.Suspense fallback={<div>Loading...</div>}>
							<div className="flex-grow ">
								{content?.element}
							</div>
						</React.Suspense>
					</Container>
				</Bento>
				</Container>
		</AdminRoute>
	);
};

export default Admin;
