import Container from "@comp/container/Container"
import Footer from "@comp/navigation/Footer"
import Navbar from "@comp/navigation/Navbar"
import ProtectedRoute from "src/middleware/ProtectedRoute"
import styles from '@styles/global.module.scss'
import Label from "@comp/form/Label"
import Button from "@comp/form/Button"


const MyReservations = () =>{
    return(
        <ProtectedRoute>
            <Container width="100%" height="100%" className="bg-notthatwhite no-padding no-br" direction="column">
                <Navbar/>
                <Container width="100%" height="100vh" className="no-padding min-h-full no-br relative" direction="column">
                    <Container width="100%" height="35%" className="no-padding bg-black no-br justify-end" direction="column">
                        <Container width="100%" height="100%" className="bg-black no-br">
                            <Container className="no-padding push-navbar" direction="column">
                                <Label color={styles.white} className="lh-5xl ls-5xl" fontSize={styles.f5xl}>My Reservations</Label>
                            </Container>
                        </Container>
                        <Container width="100%" className="space-between items-end" >
                            <Container width="100%" direction="row" gap={styles.g16} className="no-padding" >
                                <Label  fontSize={styles.fxl} color={styles.white}>Cart</Label>
                                <Label fontSize={styles.fxl} color={styles.white}>Ticket</Label>
                            </Container>

                        </Container>
                    </Container>
                    
                </Container>
                <Footer/>
            </Container>
        </ProtectedRoute>
    )
}

export default MyReservations