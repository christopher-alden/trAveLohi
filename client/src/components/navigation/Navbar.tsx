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
import { useContext, useEffect, useState } from "react";
import { UserContext } from "src/context/userContext";
import Button from '@comp/form/Button';

import FloatingSearch from './FloatingSearch';
import Dialog from '@comp/container/Dialog';
import debounce from 'lodash.debounce'
import { useMutation } from 'react-query';
import { queryClient } from 'src/App';
import { useSearch } from 'src/context/searchContext';



const Navbar = () =>{
    const { handleSearch, searchResults } = useSearch();
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [profileMenu, setProfileMenu] = useState<boolean>(false)
    const {user, setUser, logout} = useContext(UserContext);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const location = useLocation()

    const { mutate: logoutUser, error:logoutError, isLoading:logoutLoading } = useMutation(logout, {
		onSuccess: () => {
            setUser(null)
			queryClient.invalidateQueries('userData');
		},
		
	});

    const handleScroll = () => {
        console.log('run')
        const currentScrollY = window.scrollY;
        if (currentScrollY - lastScrollY > 0) {
            setShowNavbar(false);
            
        }
        else if(currentScrollY - lastScrollY < 0){
            setShowNavbar(true);
        }
        else return 
        setLastScrollY(currentScrollY);
        
    };

    useEffect(() => {
        const throttledHandleScroll = debounce(handleScroll, 300);
        window.addEventListener('scroll', throttledHandleScroll, { passive: false });
        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [lastScrollY]);

    const currency = [
        "IDR",
        "USD",
        "GBP"
    ]


    //TODO: pake reduceer
    const onProfileClick = () => {
        setProfileMenu(!profileMenu);
    }


    return(
        <>
            <Container width="100%" height="100px" className={`fixed z1000 space-between navbar no-br ${showNavbar ? ' ' : 'no-nav'}`} center>
                    <Container width='350px' px='0px' py='0px'>
                        <Picture src={fullLogo} width='150px'/>
                    </Container>
                    <Container px='0px' py='0px' gap={styles.g8}>
                        {NavbarRoutes.map((route, index) =>(
                            <Link key={index} className="fuckyou link" to={route.path}>
                                <Label key={index} color={styles.white} fontSize={styles.fbase} fontWeight={location.pathname === route.path ? '700' : '300'}>
                                    {route.name}
                                </Label>
                            </Link>
                        ))}
                    </Container>
                    <Container className='justify-end' width="350px" px='0px' py='0px' gap={styles.g4}>
                        <Button className='transparent-btn' onClick={()=>{setIsSearchVisible(true)}}>
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
            {isSearchVisible && 
                <FloatingSearch handleClose={() => setIsSearchVisible(false)} onSearchChange={handleSearch}>
                    {searchResults.map((result, index) => (
                        <Label
                            className="search-results pointer" 
                            key={index}
                            onClick={() => {console.log(result)}}
                            color={styles.white}
                        >
                            {`${result.city}, ${result.country}`}
                        </Label>
                    ))}
                </FloatingSearch>
            }
            {profileMenu && 
            <Dialog title='ceritanya dropdown' open={profileMenu} onClose={onProfileClick}>
                <Button className='primary-btn' onClick={logoutUser}>
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