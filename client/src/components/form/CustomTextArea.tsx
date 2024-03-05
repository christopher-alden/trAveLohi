import React from 'react';
import styles from '@styles/global.module.scss';
import Label from '@comp/form/Label';
import Container from '@comp/container/Container';

type TextAreaProps = {
	prompt?: string;
	placeholder?: string;
	className?: string;
	width?: string;
	height?: string;
	outlineColor?: string;
	color?: string;
	register: any;
	rules: any;
	name?: string;
	error: any;
	defaultValue?: any;
};

const CustomTextArea = ({
	width = 'fit-content',
	height = 'fit-content',
	outlineColor = styles.black,
	color = styles.black,
	prompt,
	placeholder,
	className,
	register,
	name,
	rules,
	error,
	defaultValue,
}: TextAreaProps) => {
	const divStyle: React.CSSProperties = {
		width: width,
		height: height,
		maxWidth: width,
		maxHeight: height,
		display: 'flex',
		flexDirection: 'column',
		gap: styles.g1,
	};

	return (
		<div
			className={'label-form'}
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
			<textarea
			rows="10" cols="45"
                id={name}
                name={name}
                style={{
                    resize: 'none', // Keep this to prevent resizing
                    boxSizing: 'border-box',
                    paddingInline: `${styles.g4}`,
                    paddingBlock: `${styles.g2}`,
                    width: '100%', // Ensures it fills the div
                    height: '100%', // Ensures it fills the div, adjust if necessary
                    maxWidth: '100%', // Prevents it from exceeding the div
                    maxHeight: '100%', // Adjusts height within the div
                    color: color,
                    outlineColor: `${outlineColor || ''}`,
                    overflowX: 'hidden', // Enables vertical scrolling
					wordWrap:'break-word'
                }}
                {...register(name, rules)}
                placeholder={placeholder}
                className={`basic-text-area ${className || ''}`}
                defaultValue={defaultValue}
            />
		</div>
	);
};

export default CustomTextArea;
