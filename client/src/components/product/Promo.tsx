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
        <Container width={width} height={height} px="0px" py="0px" direction="column" gap={styles.g4} className={`clip no-br ${ss.sliderCard} `}>
            <Container direction="column" className={`no-padding clip ${ss.sliderPictureCtr} no-br`} width="100%"  height="85%" >
                <Picture width="100%" height='100%' src={promo.image} className="z-1000 newdim-soft"></Picture>
                <Label fontSize={styles.f6xl} color={styles.white} className={`${ss.sliderTitle} lh-6xl`} >{`${promo.amount}%`}</Label>
            </Container>
            <Container className="no-padding justify-end items-end" direction="row" width="100%" height="15%">
                <Container className="no-padding items-start justify-end" direction="column" width="60%">
                    <Label color={styles.black} className={`${ss.sliderDesc}`}>{promo.description}</Label> 
                    <Label color={styles.secondaryWhite} className={`${ss.sliderValidText}`}>{validFromDate.toLocaleDateString()} - {validToDate.toLocaleDateString()}</Label>
                </Container>
                <Container className="no-padding justify-end items-end" width="40%">
                    <Label color={styles.black} className={`${ss.sliderDesc} lh`} fontSize={styles.fxl}>[{promo.code}]</Label> 
                </Container>
            </Container>
            {/* <Container width='100%' height='80%' className="abs left-right-gradient no-br z-18"/> */}
        </Container>
    );
};

export default Promo;
