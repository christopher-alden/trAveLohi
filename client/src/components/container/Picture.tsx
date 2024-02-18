import '@styles/generic-styles/image.styles.scss';
type pictureProps = {
	src: string;
	width: string;
	height?: string;
	className?:string
	// onMouseEnter?:any,
	// onMouseLeave?:any,
};
const Picture = ({ src, width, height, className}: pictureProps) => {
const style = {
		width: width,
		height: height,
		maxWidth: width,
		maxHeight: height,
        display: 'flex',
        flexShrink: 0,
		overflow:'hidden',
	};

	return (
		<div style={style}>
			<img
				// onMouseEnter={onMouseEnter}
				// onMouseLeave={onMouseLeave}
				src={src}
				alt={src}
				className={`image ${className || ''}`}
			/>
		</div>
	);
};

export default Picture;
