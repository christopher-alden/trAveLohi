import Container from "@comp/container/Container";
import styles from '@styles/global.module.scss'
import '@styles/generic-styles/container.styles.scss'
import '@styles/generic-styles/form.styles.scss'
import { useState } from "react";
import Picture from "@comp/container/Picture";
import searchIcon from '@icons/search-icon.png'

const FloatingSearch = () =>{

    const [query, setQuery] = useState();

    return (
        <Container px="0px" py="0px" center width="100vw" height="100vh" className="fixed ontop zbelownav bg-dim no-br softblur">
            <Container height="60px" width="800px" px="0px" py="0px" className="zbelownav space-between border-container search-container">
                <Picture width='100%' className='icon-scale-smaller semi-transparent' src={searchIcon}/>
                <input
                    style={{
                        
                        width: '100%',
                        height: '100%',
                        color: styles.white,
                        fontSize: styles.fxl
                    }}
                    placeholder="Spotlight Search"
                    className={`fuckyou`}
			/>
            </Container>
        </Container>
    );
}

export default FloatingSearch