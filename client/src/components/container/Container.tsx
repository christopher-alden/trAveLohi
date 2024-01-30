import '@styles/generic-styles/container.styles.scss';

type containerProps = {
	children?: React.ReactNode;
	width?: string;
	height?: string;
	center?: boolean;
	gap?: string;
	direction?: 'row' | 'column';
    px?:string;
    py?:string;
    className?: string;
};

const Container = ({ children, width='fit-content', height='fit-content', center, gap, direction, px , py, className }: containerProps) => {

	const style = {
		width: width,
		height: height,
		maxWidth: width,
		maxHeight: height,
		gap: gap,
		flexDirection: direction,
        paddingInline: px,
        paddingBlock:py,
	};

	const cn = center ? 'center-container' : 'basic-container';

	return (
		<div
			className={`${cn} ${className || ''}`}
			style={style}>
			{children}
		</div>
	);
};

export default Container;
