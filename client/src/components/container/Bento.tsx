import Container from './Container';
import styles from '@styles/global.module.scss';

type bentoProps = {
	children: React.ReactNode;
	width: string;
	height: string;
    className?: string;
};
const Bento = ({children, width, height, className}: bentoProps) => {
	return (
		<Container
			width={width}
			height={height}
			px={styles.g4}
			py={styles.g4}
            className={`${className}`}
		>
			{children}
		</Container>
	);
};

export default Bento;
