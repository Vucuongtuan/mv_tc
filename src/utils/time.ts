





export const getTimeNow = (date?:Date,option?: { 
    day?: boolean, 
    month?: boolean, 
    year?: boolean, 
    hours?: boolean, 
    minutes?: boolean, 
    seconds?: boolean 
}) => {
    const now = date || new Date();
    const vnTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    
    const pad = (num: number): string => num.toString().padStart(2, '0');
    
    const year = vnTime.getFullYear();
    const month = pad(vnTime.getMonth() + 1);
    const day = pad(vnTime.getDate());
    const hours = pad(vnTime.getHours());
    const minutes = pad(vnTime.getMinutes());
    const seconds = pad(vnTime.getSeconds());
    
    if (!option) {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    const dateParts: string[] = [];
    const timeParts: string[] = [];
    
    if (option.year) dateParts.push(year.toString());
    if (option.month) dateParts.push(month);
    if (option.day) dateParts.push(day);
    
    if (option.hours) timeParts.push(hours);
    if (option.minutes) timeParts.push(minutes);
    if (option.seconds) timeParts.push(seconds);
    
    const dateStr = dateParts.join('-');
    const timeStr = timeParts.join(':');
    
    if (dateStr && timeStr) {
        return `${dateStr} ${timeStr}`;
    } else if (dateStr) {
        return dateStr;
    } else if (timeStr) {
        return timeStr;
    }
    
    return '';
}