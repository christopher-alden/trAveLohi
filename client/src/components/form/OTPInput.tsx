import React, {useState, useRef} from 'react';

type otpInputProps = {
	onOtpEntered: (otp: string) => void;
};

const OTPInput = ({onOtpEntered}: otpInputProps) => {
	const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
	const otpRefs: React.RefObject<HTMLInputElement>[] = Array.from({length: 6}, () => useRef<HTMLInputElement>(null));

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const {value} = e.target;

		if (/^\d*$/.test(value)) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);

			if (value === '' && index > 0) {
				otpRefs[index - 1].current?.focus();
			} else if (index < otpRefs.length - 1 && value !== '' && otp[index - 1] !== '') {
				otpRefs[index + 1].current?.focus();
			}

			if (newOtp.every((digit) => digit !== '')) {
				const enteredOTP = newOtp.join('');
				onOtpEntered(enteredOTP);
			}
		}
	};

	return (
		<div className="otp-container">
			{otp.map((digit, index) => (
				<input
					key={index}
					ref={otpRefs[index]}
					type="text"
					value={digit}
					onChange={(e) => handleInputChange(e, index)}
					maxLength={1}
				/>
			))}
		</div>
	);
};

export default OTPInput;
