export const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(`1970-01-01T${checkIn}:00`);
    const end = new Date(`1970-01-01T${checkOut}:00`);

    // If checkOut is earlier than checkIn, it might be the next day, 
    // but for this simple implementation we'll just handle same day or return 0
    if (end <= start) return 0;

    const diff = (end - start) / (1000 * 60 * 60);

    return Math.round(diff * 100) / 100;
};
