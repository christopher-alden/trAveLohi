import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture"
import footerBg from '@assets/footer2.jpg'
import Label from "@comp/form/Label"
import styles from '@styles/global.module.scss'
import { Link } from "react-router-dom"
const externalLinks = [
    {
        "label":"Instagram",
        "link":"https://www.traveloka.com/en-id"
    },
    {
        "label":"Twitter",
        "link":"www.instagram.com"
    },
    {
        "label":"Youtube",
        "link":"www.instagram.com"
    },
    {
        "label":"Tiktok",
        "link":"www.instagram.com"
    }
]

const internalLinks = [
    {
        "label":"Privacy Policy",
        "link":"https://www.traveloka.com/en-id/privacy-notice"
    },
    {
        "label":"Terms of Use",
        "link":"https://www.traveloka.com/en-id/termsandconditions"
    },
    {
        "label":"Legal Disclaimer",
        "link":"https://www.contractscounsel.com/t/us/legal-disclaimer"
    },
    {
        "label":"Cookie Policy",
        "link":"https://www.traveloka.com/en-id/privacy-notice"
    },
    {
        "label":"Blog",
        "link":"https://www.traveloka.com/en-id/explore"
    }
]


const Footer = () => {
    return(
        <Container width="100vw" height="125vh" className="relative no-padding footer-ctr">
            <Container width="100vw" height="100%" className="abs bg-soft-soft-dim no-padding z-9 no-br"></Container>
            {/* <Picture width="100vw" src={footerBg} className="abs z-10"></Picture> */}
            <Container width="100vw" height="100%" className="abs parallax no-br"></Container>
            <Container direction="column" width="100vw" height="125vh" className="abs no-padding space-between z2">
                <Container direction="column" width="100%" height="40%" center className="no-padding" gap={styles.g8}>
                    <Label className="z-8 text-center lh-5xl main-text" color={styles.white} fontSize={styles.f7xl}>Discover the World<br/>One Flight at a Time.</Label>
                    <Label color={styles.white} className="word-wrap text-center">Embark on unforgettable journeys with ease. Our platform offers seamless<br/> bookings and unbeatable deals to turn your travel dreams into reality.</Label>
                </Container>
                <Container direction="column" width="100%" height="50%" center className="no-padding space-between footer">
                    <Container width="100%" className="justify-end">
                        <Container className="no-padding" gap={styles.g4}>
                            {
                                externalLinks.map((link, index)=>{
                                    return(
                                        <Link to={link.link} key={index} className="fuckyou">
                                            <Label color={styles.white}>{link.label}</Label>
                                        </Link>
                                    )
                                })
                            }
                        </Container>
                    </Container>

                    <div className="lh-footer" >Travelohi</div>

                    <Container width="100%" className="space-between" >
                        <Label color={styles.white}>
                            © 2024 Christopher Alden. All Rights Reserved
                        </Label>
                        <Container className="no-padding" gap={styles.g4}>
                            {
                                internalLinks.map((link, index)=>{
                                    return(
                                        <Link to={link.link} key={index}  className="fuckyou">
                                            <Label color={styles.white}>{link.label}</Label>
                                        </Link>
                                    )
                                })
                            }
                        </Container>
                    </Container>
                    
                </Container>
            </Container>

        </Container>
    )
}

export default Footer