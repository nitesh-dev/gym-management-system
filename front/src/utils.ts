

export function unixMillisecondsToDateString(unixMilliseconds: number) {
    // Create a new Date object with the Unix timestamp in milliseconds
    const date = new Date(unixMilliseconds);

    // Extract the day, month, and year from the date object
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();


    // Construct the date string in the desired format
    const dateString = `${day} ${month} ${year}`;

    return dateString;
}

export function timeStringToUnixMilliseconds(time: string) {
    const [hour, minute] = time.split(":").map(Number);

    return (hour * 60 + minute) * 60 * 1000;
}

export function unixMillisecondsToTimeString(timeInMilliseconds: number) {
    const dateObj = new Date(timeInMilliseconds);
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();

    let hour12 = hour % 12;
    const meridian = hour < 12 ? "AM" : "PM";
    if (hour12 === 0) {
        hour12 = 12;
    }

    return `${hour12}:${minute.toString().padStart(2, "0")} ${meridian}`;
}

export function getAge(dob: number) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}



