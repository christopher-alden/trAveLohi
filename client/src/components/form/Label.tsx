import styles from '@styles/global.module.scss'

type labelProps = {
	children: React.ReactNode;
	fontSize?: string;
	color?: string;
	fontWeight?: string;
	className?:string;
	onClick?: any;
};
const Label = ({ children, fontSize = styles.fbase, color=styles.black, fontWeight='300', className='', onClick}: labelProps) => {
	const style = {
		fontSize: fontSize,
		color: color,
		fontWeight:fontWeight
	};

	return <div onClick={onClick} style={style} className={className}>{children}</div>;
};
export default Label;
