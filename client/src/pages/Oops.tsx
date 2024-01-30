import Label from '@comp/form/Label';
import mogged from '@assets/mogged.jpg';
import Picture from '@comp/container/Picture';
import '@styles/generic-styles/image.styles.scss';
import styles from '@styles/global.module.scss'
import Container from '@comp/container/Container';

const Oops = () => {
	return (
		<>
			<div className="background-dim">
				<Picture
					src={mogged}
					width="100vw"
					height="100vh"
					className="background-image zoom-in-out"
				/>
			</div>
            <Container width='100%' height='100vh' center={true}>
                <Label fontSize={styles.f5xl} color={styles.white} fontWeight='700' >TOLONG LOGIN DULU TOLONG</Label>
            </Container>
		</>
	);
};

export default Oops;
