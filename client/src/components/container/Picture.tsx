import '@styles/generic-styles/image.styles.scss';
type pictureProps = {
	src: string;
	width: string;
	height?: string;
	className?:string
};
const Picture = ({ src, width, height, className }: pictureProps) => {
const style = {
		width: 'auto',
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
				src={src}
				alt={src}
				className={`image ${className || ''}`}
			/>
		</div>
	);
};

export default Picture;
