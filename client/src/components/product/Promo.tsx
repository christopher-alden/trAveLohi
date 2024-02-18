import Container from "@comp/container/Container";
import Picture from "@comp/container/Picture";
import ss from '@styles/variables/slider.module.scss';
import Label from "@comp/form/Label";
import styles from '@styles/global.module.scss';

type promoTypes = {
    promo: Promo,
    width?: string,
    height: string
}

const Promo = ({ promo, width = "100%", height }: promoTypes) => {
    const validFromDate = new Date(promo.fromDate);
    const validToDate = new Date(promo.toDate);
    return (
        <Container width={width} height={height} px="0px" py="0px" className={`clip ${ss.sliderCard}`}>
            <Container direction="row" width="100%" height="100%" className={`${ss.sliderInfo}  z1`}>
                <Container px="0px" py="0px" direction="column" width="50%" height="100%" className={`${ss.sliderDetails}`} gap={styles.g2} >
                    <Label color={styles.white} className={`${ss.sliderDesc}`}>{promo.description}</Label> 
                    <Label fontSize={styles.f6xl} color={styles.white} className={`${ss.sliderTitle} lh-6xl`}>{`${promo.amount}%`}</Label>
                </Container>
                <Container direction="column" px="0px" py="0px" width="50%" height="100%" className={`${ss.sliderValid} `} >
                    <Label color={styles.white} fontSize={styles.fsm} className={`${ss.sliderValidText}`}>Valid From {validFromDate.toLocaleDateString()} - {validToDate.toLocaleDateString()}</Label>
                </Container>
            </Container>
            {/* <Container width='100%' height='100%' className="abs bg-soft-dim no-br z-18"/> */}
            <Picture width="100%" src={promo.image} className="z-1000 newdim"></Picture>
        </Container>
    );
};

export default Promo;
