export const calculateHours = (checkIn, checkOut) => {
    const start = new Date(`1970-01-01T${checkIn}:00`);
    const end = new Date(`1970-01-01T${checkOut}:00`);

    const diff = (end - start) / (1000 * 60 * 60);

    return Math.round(diff * 100) / 100;
};
