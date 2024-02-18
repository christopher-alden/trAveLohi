import { useRef, useState } from "react";
import Label from "./Label";
import styles from '@styles/global.module.scss'
import Container from "@comp/container/Container";

type CustomDatePickerProps = {
    setTime: (time:Date) => void
    mainTheme?: boolean
}

const CustomDatePicker = ({ setTime, mainTheme=true}:CustomDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [displayDate, setDisplayDate] = useState("");
    const [displayDay, setDisplayDay] = useState("")

    const dateInputRef = useRef<HTMLInputElement>(null);

    const formatDateDisplay = (dateValue: string) => {
        const date = new Date(dateValue);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }); 
    
        return {
            dayOfWeek,
            formattedDate
        };
    };
    

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const time:Date = new Date(event.target.value)
        setSelectedDate(event.target.value);
        const { dayOfWeek, formattedDate } = formatDateDisplay(event.target.value);
        setDisplayDay(dayOfWeek)
        setDisplayDate(formattedDate); 
        setTime(time)
    };

    const handleClick = () => {
        if (dateInputRef.current) {
            console.log("clicked")
            dateInputRef.current.showPicker()
        }
    };

    return (
        <div className="relative">
            <Container direction="column" className="no-padding"  onClick={handleClick}>
                <Label color={mainTheme ? styles.black: styles.white}fontSize={styles.f3xl} fontWeight="700">{displayDate || 'Select Date'}</Label>
                <Label color={mainTheme ? styles.black: styles.white} >{displayDay || ''}</Label>
            </Container>
            <input
                id="date-picker"
                type="date"
                ref={dateInputRef}
                onChange={handleDateChange}
                className={`none abs`}
                value={selectedDate}
            />
        </div>
    );
};

export default CustomDatePicker;
