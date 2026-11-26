/**
 * ממשק המגדיר את מבנה הנתונים של ציטוט השראה המתקבל ממקור חיצוני
 */
export interface Quote {
    content: string;    // תוכן הציטוט
    author: string;     // שם מחבר הציטוט
}