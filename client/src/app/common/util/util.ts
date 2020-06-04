export const blendDT = (date: Date, time: Date) => {
    // build a date string
    // build a time string
    // THEN COMBINE THEM TOGETHER as a DATE_OBJECT
    const t = time.getHours() + ':' + time.getMinutes() + ':00';
    const y = date.getFullYear();
    const m = date.getMonth() + 1; // starts at 0 so we need to add 1
    const d = date.getDate();
    const ds = `${y}-${m}-${d}`;

    return new Date(ds + ' ' + t); // <--COMBINED DATE_AND_TIME

}