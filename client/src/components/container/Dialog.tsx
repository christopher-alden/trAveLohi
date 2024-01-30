import React, {useState} from 'react';
import close from '@icons/close-icon-black.png';
// import '@styles/generic-styles/dialog.styles.scss';
import '@styles/generic-styles/container.styles.scss';
import styles from '@styles/global.module.scss';

import Label from '@comp/form/Label';
import Button from '@comp/form/Button';
import Picture from '@comp/container/Picture';

type dialogProps = {
	open?: boolean;
	onClose?: () => void;
	title?: string;
	children?: React.ReactNode;
};

const Dialog = ({open, onClose, title, children}: dialogProps) => {

	return (
		<>
			{open && (
				<div className={`popup ${open ? 'open' : ''}`}>
					<div
						className="overlay"
						onClick={onClose}
					></div>
					<div className="dialog bg-white">
						<div className="header">
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
						<div className="body">{children}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Dialog;
