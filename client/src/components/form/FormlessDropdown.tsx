import styles from '@styles/global.module.scss';
import Label from '@comp/form/Label';
import '@styles/generic-styles/form.styles.scss';
import Container from '@comp/container/Container';

type FormlessDropdownProps = {
	prompt?: string;
	options: Array<string>,
	className?: string;
	width?: string;
	height?: string;
	color?: string;
	name: string;
};

const FormlessDropdown = ({
	prompt,
	options,
	className,
	width = 'fit-content',
	height = 'fit-content',
	color = styles.black,
	name
}: FormlessDropdownProps) => {
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
				</Container>
			)}
			<div
				className="select-wrapper "
				style={{
					width: '100%',
					height: '100%',
					color: color,
				}}
			>
				<select
                    name={name}
                    id={name}
					className={`basic-dropdown ${className || ''}`}
					style={{
						width: '100%',
						height: '100%',
						color: color,
					}}
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

export default FormlessDropdown;
