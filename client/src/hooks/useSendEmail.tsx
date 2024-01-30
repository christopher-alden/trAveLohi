import {useRef, useState} from 'react';

const useSendEmail = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const userEmailRef = useRef<string | undefined>();
	const apiRef = useRef<string | undefined>();

	const sendEmail = async (subject:string) => {
		if (!apiRef.current || !userEmailRef.current ) {
			return;
		}

		try {
			
			setLoading(true)
			const res = await fetch(apiRef.current, {
            method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					subject: subject,
					to: userEmailRef.current,
				}),
			});

			const data = await res.json();

			setLoading(false);
			if (res.ok) {
				console.log("bus")
			} else {
				console.error('Failed to send email');
			}

			return data.message

		} catch (error) {
			console.error('Error sending email:', error);
		}
		setLoading(false);
	};

	const setEmailAndApi = (userEmail: string, api: string, subject:string) => {
		userEmailRef.current = userEmail;
		apiRef.current = api;
		return sendEmail(subject);
	};

	return {setEmailAndApi, loading};
};

export default useSendEmail;
