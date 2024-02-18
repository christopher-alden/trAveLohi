import Bento from "@comp/container/Bento"
import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import styles from '@styles/global.module.scss'
import React from "react"

type sidebarProps = {
    children: React.ReactNode
    label?:string
}
const Sidebar = ({children, label}:sidebarProps) =>{
    return(
        <Bento width="400px" height='100%'>
            <Container px={styles.g8} py={styles.g8} direction="column" gap={styles.g4}  width="100%" height='100%' className="bg-black-gradient outline-secondary br-bento">
                <Label color={styles.white} fontSize={styles.f3xl}>{label}</Label>
                <Container direction="column" width="100%"  px="0px" py="0px" gap={styles.g4}>
                    {children}
                </Container>
            </Container>
        </Bento>
    )
}

export default Sidebar