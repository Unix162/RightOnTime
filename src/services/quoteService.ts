import type { Quote } from "../types/Quote";

/**
 * ממשק המגדיר את מבנה התשובה המתקבלת משירות הגיבוי.
 */
interface DummyQuote {
    id: number;
    quote: string;
    author: string;
}

/**
 * פונקציה לקבלת ציטוט השראה באמצעות API חיצוני.
 * במקרה של כשל בשירות הראשי, מתבצעת פנייה לשירות חלופי.
 * @returns אובייקט המכיל את תוכן הציטוט ושם המחבר.
 */
export async function fetchQuote(): Promise<Quote> {

    try {

        // שליחת בקשה לקבלת ציטוט משירות Quotable
        const response = await fetch(
            "https://api.quotable.io/quotes/random?tags=inspirational",
            { signal: AbortSignal.timeout(5000) }
        );

        // בדיקה האם הבקשה הסתיימה בהצלחה
        if (!response.ok) {
            throw new Error("שגיאה בקבלת ציטוט מ-Quotable");
        }

        const data: Quote[] = await response.json();

        if (!data.length) {
            throw new Error("לא התקבל ציטוט");
        }

        return {
            content: data[0].content,
            author: data[0].author
        };

    } catch (error) {

        console.warn("שירות Quotable אינו זמין, פונה לשירות חלופי:", error);

        // שליחת בקשה לשירות הגיבוי
        const response = await fetch(
            "https://dummyjson.com/quotes/random",
            { signal: AbortSignal.timeout(5000) }
        );

        if (!response.ok) {
            throw new Error("לא ניתן לקבל ציטוט השראה");
        }

        const data: DummyQuote = await response.json();

        return {
            content: data.quote,
            author: data.author
        };
    }
}