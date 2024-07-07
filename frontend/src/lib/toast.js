
import { toast } from "sonner"

const getCurrentDateTime = () => {
    var curr = new Date();

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var dayName = days[curr.getDay()];
    var monthName = months[curr.getMonth()];
    var day = String(curr.getDate()).padStart(2, '0');
    var year = curr.getFullYear();

    var hours = curr.getHours();
    var minutes = String(curr.getMinutes()).padStart(2, '0');
    var period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour time format
    var time = `${hours}:${minutes} ${period}`;

    var datetime = `${dayName}, ${monthName} ${day}, ${year} at ${time}`;
    return datetime;
}

console.log(getCurrentDateTime());

export const customToast = (desc) => {
    toast(desc, {
        description: getCurrentDateTime(),
        action: {
            label: "Close",
            // onClick: () => console.log("Undo"),
        },
    })
}