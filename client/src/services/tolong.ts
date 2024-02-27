export function formatDateAndTime(dateInput: Date | undefined): { date: string; time: string } {
    if (!dateInput) {
        return { date: "Unknown date", time: "Unknown time" };
    }

    const date = new Date(dateInput);
    
    const dateString = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });

    const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
    });

    return { date: dateString, time: timeString };
}