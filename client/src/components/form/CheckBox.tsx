import '@styles/generic-styles/form.styles.scss'
type checkBoxProps = {
    children: React.ReactNode;
}

const CheckBox = ({children}:checkBoxProps) =>{
    return (
        <label className="checkbox">
            <input type="checkbox"/>
            {children}
        </label>
    );
}

export default CheckBox