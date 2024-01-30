import styles from '@styles/global.module.scss';
import Label from '@comp/form/Label';
import '@styles/generic-styles/form.styles.scss';
import Container from '@comp/container/Container';

type DateInputProps = {
	prompt?: string;
	className?: string;
	width?: string;
	height?: string;
	color?: string;
	register: any;
	rules: any;
	error: any;
	name: string;
};

const DatePicker = ({
	prompt,
	register,
	rules,
	error,
	className,
	name,
	width = 'fit-content',
	height = 'fit-content',
	color = styles.black,
}: DateInputProps) => {
	const  divStyle:React.CSSProperties = {
		width: width,
		height: height,
		display:'flex',
		flexDirection:'column',
		gap: styles.g1,
	};
	return (
		<div
			className="label-form"
			style={divStyle}
		>
			{prompt && (
				<Container
					gap={styles.g2}
					px="0"
					py="0"
					direction="row"
					center={true}
				>
					<Label
						color={color}
						fontSize={styles.fsm}
					>
						{prompt}
					</Label>
					{error && (
						<Label
							color={styles.error}
							fontSize={styles.fxs}
						>
							{error.message}
						</Label>
					)}
				</Container>
			)}
			<input
				name={name}
				id={name}
				type="date"
				className={`basic-date-input ${className || ''}`}
				{...register(name, rules)}
				style={{
					width: '100%',
					height: '100%',
					color: color,
				}}
			/>
		</div>
	);
};

export default DatePicker;