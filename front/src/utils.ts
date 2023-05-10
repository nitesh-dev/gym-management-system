

function unixMillisecondsToDateString(unixMilliseconds: number) {
    // Create a new Date object with the Unix timestamp in milliseconds
    const date = new Date(unixMilliseconds);

    // Extract the day, month, and year from the date object
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    // Extract the hours and minutes from the date object
    let hours = date.getHours();
    let minutes: any = date.getMinutes();

    // Convert the hours to 12-hour format and determine whether it's AM or PM
    let amOrPm = 'AM';
    if (hours >= 12) {
        amOrPm = 'PM';
        hours -= 12;
    }
    if (hours === 0) {
        hours = 12;
    }

    // Add leading zeros to the minutes if needed
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Construct the date string in the desired format
    const dateString = `${day} ${month} ${year}, ${hours}:${minutes} ${amOrPm}`;

    return dateString;
}



