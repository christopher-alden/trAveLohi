import React from 'react';
import '@styles/generic-styles/form.styles.scss'

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    submit?: boolean;
    victor?:boolean;
};

const Button = ({ children, onClick, className='', submit, victor=false }: ButtonProps) => {
    const type = submit ? 'submit' : 'button'
    return (
        <button type={type} className={`button ${className}`} onClick={onClick} disabled={victor}>
            {children}
        </button>
    );
};

export default Button;
