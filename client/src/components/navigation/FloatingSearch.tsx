import React, { useRef, useEffect} from 'react';
import styles from '@styles/global.module.scss';
import Container from '@comp/container/Container';
import Picture from '@comp/container/Picture';
import searchIcon from '@icons/search-icon.png';
interface floatingSearchProps {
	onSearchChange: (query: string) => void;
	children: React.ReactNode;
    handleClose: () => void;

}

const FloatingSearch = ({onSearchChange, children, handleClose}:floatingSearchProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onSearchChange(value);
	};

	return (
		<div onClick={handleClose} className="search-parent fixed ontop z1000 bg-dim no-br softblur">
			<Container
				direction="column"
				width="800px"
				className="zbelownav space-between search-container no-br"
			>
				<Container
					height="60px"
					width="100%"
					px="0px"
					py="0px"
					className="zbelownav space-between border-container no-br"
                    onClick={(e:any) => e.stopPropagation()}
                    
				>
					<Picture
						width='fit-content'
						className="icon-scale-smaller semi-transparent"
						src={searchIcon}
					/>
					<input
						ref={inputRef}
						style={{
							width: 'calc(100% - 50px)',
							height: '100%',
							color: styles.white,
							fontSize: styles.fxl,
							fontWeight: '300',
						}}
						onChange={handleInputChange}
						placeholder="Search"
						className="search-input "
                        onClick={(e) => e.stopPropagation()}
					/>
				</Container>
				<Container width="700px" px={styles.g4} gap={styles.g2} direction='column' className='result abs'>
                    {children}
                </Container>
			</Container>
		</div>
	);
};

export default FloatingSearch;
