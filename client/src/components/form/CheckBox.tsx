import React from 'react';

type CheckBoxProps = {
    children: React.ReactNode;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    defaultValue?: boolean;
}

const CheckBox = ({children, name, onChange, defaultValue}: CheckBoxProps) => {
    return (
        <label className="checkbox">
            <input defaultChecked={defaultValue} type="checkbox" name={name} onChange={onChange} />
            {children}
        </label>
    );
}

export default CheckBox;
