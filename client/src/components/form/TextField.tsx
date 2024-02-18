import styles from '@styles/global.module.scss';
import Label from '@comp/form/Label';
import '@styles/generic-styles/form.styles.scss';

import Container from '@comp/container/Container';

type TextFieldProps = {
	prompt?: string;
	placeholder?: string;
	type?: string;
	className?: string;
	width?: string;
	height?: string;
	outlineColor?: string;
	color?: string;
	register: any;
	rules: any;
	name: string;
	error: any;
	defaultValue?: any;
};

const TextField = ({
	width = 'fit-content',
	height = 'fit-content',
	outlineColor = styles.black,
	color = styles.black,
	prompt,
	placeholder,
	type = 'text',
	className,
	register,
	name,
	rules,
	error,
	defaultValue
}: TextFieldProps) => {
	const divStyle:React.CSSProperties = {
		width: width,
		height: height,
		maxWidth: width,
		maxHeight: height,
		display:'flex',
		flexDirection:'column',
		gap: styles.g1,
	};
	return (
		<div
			className={'label-form'}
			style={divStyle}
		>
			{prompt && (
				<Container gap={styles.g2} px='0' py='0' direction='row' center={true}>
					<Label
						color={color}
						fontSize={styles.fsm}
					>
						{prompt}
					</Label>
					{error && <Label color={styles.error} fontSize={styles.fxs}>{error.message}</Label>}
				</Container>
			)}
			<input
				id={name}
				name={name}
				style={{
					width: '100%',
					height: '100%',
					color: color,
					outlineColor: `${outlineColor || ''}`,
				}}
				{...register(name, rules)}
				type={type}
				placeholder={placeholder}
				className={`basic-tf ${className || ''}`}
				defaultValue={defaultValue}
			/>
		</div>
	);
};

export default TextField;
