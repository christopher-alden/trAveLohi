import Container from "@comp/container/Container"
import Label from "@comp/form/Label"
import Footer from "@comp/navigation/Footer"
import Navbar from "@comp/navigation/Navbar"
import styles from "@styles/global.module.scss"
import { useContext, useState } from "react"
import { UserContext } from "src/context/userContext"
import arrow from '@icons/arrow-icon.png'
import Picture from "@comp/container/Picture"
import useContent from "src/hooks/useContent"
import React from "react"
import { UserRole } from "@myTypes/user.types"
import Button from "@comp/form/Button"
import { useMutation } from "react-query"
import { queryClient } from "src/App"
import { useNavigate } from "react-router-dom"

const Profile = () =>{
    const {user,setUser, logout} = useContext(UserContext)
    const {contents, content, switchContent} = useContent(UserRole.user);
    const navigate = useNavigate();
    
    const { mutate: logoutUser, error:logoutError, isLoading:logoutLoading } = useMutation(logout, {
		onSuccess: () => {
            setUser(null)
			queryClient.invalidateQueries('userData');
            navigate('/login')
		},
		
	});
    return(
        <Container width="100%" height="100%" className="bg-notthatwhite no-padding no-br" direction="column">
            <Navbar/>
            <Container width="100%" height="100vh" className="no-padding min-h-full no-br relative" direction="column">
                <Container width="100%" height="35%" className="no-padding bg-black no-br justify-end" direction="column">
                    <Container width="100%" height="100%" className="bg-black no-br">
                        <Container className="no-padding push-navbar" direction="column">
                            <Label color={styles.secondaryWhite} fontSize={styles.fxl}>Profile</Label>
                            <Label color={styles.white} className="lh-5xl ls-5xl" fontSize={styles.f5xl}>{user?.firstName + ' ' + user?.lastName}</Label>
                        </Container>
                    </Container>

                    <Container width="100%" className="space-between items-end" >
                        <Container width="100%" direction="row" gap={styles.g16} className="no-padding" >
                            {contents.map(({key, name})=>(
                                <Container key={key} onClick={() => switchContent(key)} className="no-padding" gap={styles.g1} >
                                    <Label fontSize={styles.fxl} color={content?.key == key ? styles.white : styles.secondaryWhite}>{name}</Label>
                                    <Picture width="30px" className={`icon-topright ${content?.key != key && 'bento-icon'}`} src={arrow} />
                                </Container>
                            ))}
                        </Container>
                        <Button onClick={()=>{logoutUser()}} className="outline-btn">
                            Logout
                        </Button>
                    </Container>
                    
                </Container>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <div className="flex-grow bg-notthatwhite">
                        {content?.element}
                    </div>
                </React.Suspense>
                
            </Container>
            <Footer/>
        </Container>
    )
}

export default Profile