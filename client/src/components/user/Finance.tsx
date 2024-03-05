import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import TextField from '@comp/form/TextField';
import Button from '@comp/form/Button'; // Assuming a similar pattern for Button component
import styles from '@styles/global.module.scss';
import Container from '@comp/container/Container';
import {UserCC} from '@myTypes/user.types'; // Assuming you have this type defined
import Label from '@comp/form/Label';
import {ApiEndpoints} from '@util/api.utils';
import {UserContext} from 'src/context/userContext';

// Define a new interface for the top-up form data
interface TopUpFormData {
	topUpAmount: number;
}

const Finance = () => {
	const {user} = useContext(UserContext);
	const {
		register: registerCC,
		handleSubmit: handleSubmitCC,
		formState: {errors: errorsCC},
		reset: resetCC,
	} = useForm<UserCC>();

	const {
		register: registerTopUp,
		handleSubmit: handleSubmitTopUp,
		formState: {errors: errorsTopUp},
		reset: resetTopUp,
	} = useForm<TopUpFormData>();

	const onSubmitCCDetails = async (ccData: UserCC) => {
		try {
			const response = await fetch(ApiEndpoints.UserCCUpdateOrCreate, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...ccData,
					userId: user?.ID,
				}),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			console.log('Success:', data);
			resetCC();
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const onSubmitTopUp = (topUpData: TopUpFormData) => {
		console.log('Top Up Amount:', topUpData);
		resetTopUp();
	};

	return (
		<Container
			width="100%"
			className="no-padding min-h-full"
			direction="row"
			gap={styles.g4}
		>
			<Container
				direction="column"
				className="no-padding"
				width="50%"
				gap={styles.g4}
			>
				<Label fontSize={styles.f3xl}>Update Credit Card Details</Label>
				<form
					className="w-full"
					onSubmit={handleSubmitCC(onSubmitCCDetails)}
				>
					<Container
						direction="column"
						gap={styles.g4}
						className="w-full no-padding"
						width="100%"
					>
						<TextField
							prompt="Credit Card Number"
							defaultValue={user?.userCC?.number}
							name="number"
							register={registerCC}
							rules={{required: 'Credit card number is required'}}
							error={errorsCC.number}
						/>
						<TextField
							prompt="Credit Card Type"
							defaultValue={user?.userCC?.type}
							name="type"
							register={registerCC}
							rules={{required: 'Credit card type is required'}}
							error={errorsCC.type}
						/>
						<TextField
							prompt="CVV"
							type="password"
							name="cvv"
							register={registerCC}
							rules={{required: 'CVV is required'}}
							error={errorsCC.cvv}
						/>
						<TextField
							prompt="Name on Card"
							defaultValue={user?.userCC?.name}
							name="name"
							register={registerCC}
							rules={{required: 'Name on card is required'}}
							error={errorsCC.name}
						/>
					</Container>
					<Button
						className="primary-btn"
						submit
					>
						Update CC Details
					</Button>
				</form>
			</Container>
			<Container
				direction="column"
				className="no-padding"
				gap={styles.g4}
			>
				<Label fontSize={styles.f3xl}>Top Up Wallet</Label>
				<form onSubmit={handleSubmitTopUp(onSubmitTopUp)}>
					<TextField
						prompt="Top Up Amount"
						type="number"
						name="topUpAmount"
						register={registerTopUp}
						rules={{required: 'Top up amount is required', min: {value: 1, message: 'Amount must be at least 1'}}}
						error={errorsTopUp.topUpAmount}
					/>
					<Button
						className="primary-btn"
						submit
					>
						Top Up
					</Button>
				</form>
			</Container>
		</Container>
	);
};

export default Finance;
