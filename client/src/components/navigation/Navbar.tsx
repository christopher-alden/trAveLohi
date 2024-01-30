import fullLogo from '@assets/full-logo.png';
import userIcon from '@icons/user-icon.png'
import globeIcon from '@icons/globe-icon.png'
import searchIcon from '@icons/search-icon.png'
import logoutIcon from '@icons/logout-icon.png'

import '@styles/generic-styles/container.styles.scss'
import '@styles/generic-styles/form.styles.scss'
import styles from '@styles/global.module.scss'

import Container from "@comp/container/Container"
import Picture from "@comp/container/Picture";
import Label from "@comp/form/Label";

import { NavbarRoutes } from "@myLayout/navbar.layout";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "src/context/userContext";
import Button from '@comp/form/Button';

import FloatingSearch from './FloatingSearch';
import Dialog from '@comp/container/Dialog';


const Navbar = () =>{
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [profileMenu, setProfileMenu] = useState<boolean>(false)
    const {user, logout} = useContext(UserContext);
    const location = useLocation()

    const currency = [
        "IDR",
        "USD",
        "GBP"
    ]

    const onSearchClick = () => {
        setShowSearch(!showSearch);
    }

    //TODO: pake reduceer
    const onProfileClick = () => {
        setProfileMenu(!profileMenu);
    }
    return(
        <>
            <Container width="100%" height="100px" className="fixed z1000 space-between navbar no-br" center>
                    <Container width='350px' px='0px' py='0px'>
                        <Picture src={fullLogo} width='150px'/>
                    </Container>
                    <Container px='0px' py='0px' gap={styles.g8}>
                        {NavbarRoutes.map((route, index) =>(
                            <Link className="fuckyou link" to={route.path}>
                                <Label key={index} color={styles.white} fontSize={styles.fbase} fontWeight={location.pathname === route.path ? '700' : '300'}>
                                    {route.element}
                                </Label>
                            </Link>
                        ))}
                    </Container>
                    <Container className='justify-end' width="350px" px='0px' py='0px' gap={styles.g4}>
                        <Button className='transparent-btn' onClick={onSearchClick}>
                            <Container px='0px' py='0px' gap={styles.g1} center>
                                <Picture width='25px' className='' src={searchIcon}/>
                            </Container>
                        </Button>
                        <Button className='transparent-btn'>
                            <Container px='0px' py='0px' gap={styles.g1} center>
                                <Picture width='25px' className='icon-scale' src={globeIcon}/>
                                <Label fontSize={styles.fbase} color={styles.white}>EN</Label>
                            </Container>
                        </Button>
                        {user ?
                        (<Button className='transparent-btn' onClick={onProfileClick}>
                            <Container px='0px' py='0px' gap={styles.g1} center>
                                <Picture width='25px' className='icon-scale' src={userIcon}/>
                                <Label fontSize={styles.fbase} color={styles.white}>{user?.firstName}</Label>
                            </Container>
                        </Button>)
                        :
                        (<>
                            <Link to='/login' className='link'>
                                <Container px='0px' py='0px' gap={styles.g1} center>
                                        <Picture width='25px' className='icon-scale' src={userIcon}/>
                                        <Label fontSize={styles.fbase} color={styles.white}>Login</Label>
                                </Container>
                            </Link>
                        </>)}
                    </Container>
            </Container>
            {showSearch && <FloatingSearch/>}
            {profileMenu && 
            <Dialog title='ceritanya dropdown' open={profileMenu} onClose={onProfileClick}>
                <Button className='primary-btn' onClick={logout}>
                    <Container px='0px' py='0px' gap={styles.g1} center>
                        <Picture width='25px' className='icon-scale' src={logoutIcon}/>
                        <Label fontSize={styles.fbase} color={styles.white}>Logout</Label>
                    </Container>
                </Button>
            </Dialog>
            }
        </>
    )
}

export default Navbar