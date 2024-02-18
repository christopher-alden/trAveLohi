import {useMutation} from 'react-query';

type SendEmailArgs = {
	email: string;
	api: string;
	subject: string;
};

export type EmailSetup = {
	email: string,
	api: string,
	subject: string,
	onSuccess?: () => void,
	onError?: (error: any) => void
};

// To use should call setupEmail which encapsulates sendEmail function. 
// set the Email, APi, and Subject.
// If needed to use onSuccess or onError to do further actions, please define in the EmailSetup props

const useSendEmail = () => {
	const {
		mutate: sendEmail,
		isLoading,
		error,
	} = useMutation(async ({email, api, subject}: SendEmailArgs) => {
		if (!api || !email) throw new Error('API endpoint or email is missing');

		const response = await fetch(api, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				subject,
				to: email,
			}),
		});

		if (!response.ok) throw new Error('Failed to send email');
		return await response.json();
	});

	const setupEmail = ({email, api, subject, onSuccess, onError}:EmailSetup) => {
		sendEmail({ email, api, subject }, {
			onSuccess: () => {
				if (onSuccess) onSuccess();
			},
			onError: (error) => {
				if (onError) onError(error);
			},
		});
	};

	return {setupEmail, isLoading, error};
};

export default useSendEmail;
