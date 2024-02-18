import {useEffect, useState} from 'react';
import styles from '@styles/global.module.scss'
import ss from '@styles/variables/slideshow.module.scss';
import Container from '@comp/container/Container';
import Picture from '@comp/container/Picture';
import Label from '@comp/form/Label'

type slideshowProps = {
    content: any;
}

//TODO: bikin transition smooth
const Slideshow = ({content}:slideshowProps) => {
	const {images} = content;

	const [nextIndex, setNextIndex] = useState(0);
	// const [currentIndex, setCurrentIndex] = useState(0);

	const nextSlide = () => {
        // setCurrentIndex(nextIndex)
		setNextIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	useEffect(() => {
		// console.log('Current Index:', nextIndex);
        // console.log("prev index", currentIndex)
		const interval = setInterval(nextSlide, 10000);
		return () => clearInterval(interval);
	}, [nextIndex]);

	const nextImage = images[nextIndex];
	// const currentImage = images[currentIndex];

	return (
        <>
            <Container className='abs z-1000 brl-m' px="0px"py="0px" width="100%" height='100%'>
                <Picture className="abs z-10 baseline brl-m newdim" width="100%" height='100%' src={nextImage.src}/>
                {/* <Container  width='100%'height='100%' className="abs bg-soft-dim no-br z-9"/> */}
            </Container>

            <Container px="0px"py="0px" width="100%" height='100%'  className={`${ss.slideshowInfoContainer} `}>
                <Container width='100%' height='fit-content' direction='column' gap={styles.g4} className={`${ss.slideshowInfoHeader} `}>
                    <Container direction='column' px='0px' py='0px'>
                        <Label className='lh-6xl' fontWeight='700' color={styles.white} fontSize={styles.f6xl}>{nextImage.location}</Label>
                        <Label  color={styles.white} fontSize={styles.f3xl}>{nextImage.country}</Label>
                    </Container>
                    <Label   color={styles.white} fontSize={styles.fxl}>{nextImage.description}</Label>
                </Container>
            </Container>
        </>
		
	);
};

export default Slideshow;
