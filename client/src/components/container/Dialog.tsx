import React from 'react';
import close from '@icons/close-icon-black.png';
import '@styles/generic-styles/container.styles.scss';
import styles from '@styles/global.module.scss';

import Label from '@comp/form/Label';
import Button from '@comp/form/Button';
import Picture from '@comp/container/Picture';
import Container from './Container';

type dialogProps = {
	open?: boolean;
	onClose?: () => void;
	title?: string;
	children?: React.ReactNode;
};

const Dialog = ({open, onClose, title, children}: dialogProps) => {

	return (
		<Container  height='100vh' width='100vw'  className={`popup no-br bg-dim softblur z1000 ${open ? 'open' : ''}`}>
			{open && (
				<>
					<div className="overlay" onClick={onClose}></div>
					<Container width='60vw' height='80vh' direction='column'  className="dialog no-br  bg-notthatwhite">
						<div className="header no-br">
							<Label fontSize={styles.f3xl}>{title}</Label>
							<Button
								onClick={onClose}
								className="no-padding"
							>
								<Picture
									width="25px"
									src={close}
									className="close-button"
								/>
							</Button>
						</div>
						<Container width='100%'  className="no-padding scroll-y no-br">
							{children}
						</Container>
					</Container>
				</>
			)}
			</Container>
	);
};

export default Dialog;
