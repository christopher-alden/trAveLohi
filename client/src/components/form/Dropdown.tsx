import styles from '@styles/global.module.scss';
import Label from '@comp/form/Label';
import '@styles/generic-styles/form.styles.scss';
import Container from '@comp/container/Container';

type DropdownProps = {
	prompt?: string;
	options: Array<any>,
	className?: string;
	width?: string;
	height?: string;
	color?: string;
	name: string;
	register: any;
	rules:any;
	error:any;
	defaultValue?:any
};

const Dropdown = ({
	prompt,
	options,
	className,
	width = 'fit-content',
	height = 'fit-content',
	color = styles.black,
	name,
	register,
	rules,
	error,
	defaultValue,
}: DropdownProps) => {
	const divStyle:React.CSSProperties = {
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
			<div
				className="select-wrapper"
				style={{
					width: '100%',
					height: '100%',
					color: color,
				}}
			>
				<select
					defaultValue={defaultValue}
					className={`basic-dropdown ${className || ''}`}
					style={{
						width: '100%',
						height: '100%',
						color: color,
					}}
					{...register(name,rules)}
				>
					{options.map((option, index) => (
						<option
							key={index}
							value={option}
						>
							{option}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default Dropdown;
