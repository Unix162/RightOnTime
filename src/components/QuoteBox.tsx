import { useState, useEffect } from "react";
import type { Quote } from "../types/Quote";
import { fetchQuote } from "../services/quoteService";

/**
 * קומפוננטה המציגה ציטוט השראה המתקבל באמצעות API חיצוני.
 * אחראית על טעינת הציטוט, הצגתו וטיפול בשגיאות.
 * @returns רכיב המציג ציטוט השראה.
 */
export default function QuoteBox() {

    // שמירת הציטוט שהתקבל מהשרת
    const [quote, setQuote] = useState<Quote | null>(null);

    // שמירת מצב הטעינה
    const [loading, setLoading] = useState<boolean>(true);

    // שמירת הודעת השגיאה
    const [error, setError] = useState<string>("");

    // מונה המשמש להפעלת בקשה לקבלת ציטוט חדש
    const [requestCount, setRequestCount] = useState<number>(0);

    /**
     * טעינת ציטוט בעת עליית הקומפוננטה
     * ובכל שינוי של מונה הבקשות.
     */
    useEffect(() => {

        let isActive = true;

        /**
         * קבלת ציטוט מהשירות החיצוני ועדכון התצוגה.
         */
        async function loadQuote(): Promise<void> {

            try {

                const newQuote = await fetchQuote();

                if (isActive) {
                    setQuote(newQuote);
                }

            } catch {

                if (isActive) {
                    setError("לא ניתן לטעון ציטוט השראה כרגע.");
                }

            } finally {

                if (isActive) {
                    setLoading(false);
                }
            }
        }

        void loadQuote();

        // מניעת עדכון הקומפוננטה לאחר סיום השימוש בה
        return () => {
            isActive = false;
        };

    }, [requestCount]);

    /**
     * הפעלת בקשה חדשה לקבלת ציטוט השראה.
     */
    function refreshQuote(): void {

        setLoading(true);
        setError("");
        setRequestCount((previousCount) => previousCount + 1);
    }

    return (
        <section className="quote-box">

            <h2>השראה יומית</h2>

            {loading && (
                <p>טוען ציטוט השראה...</p>
            )}

            {!loading && error && (
                <p className="quote-error">{error}</p>
            )}

            {!loading && !error && quote && (
                <div className="quote-content" dir="ltr">

                    <blockquote>
                        "{quote.content}"
                    </blockquote>

                    <p>— {quote.author}</p>

                </div>
            )}

            <button
                type="button"
                onClick={refreshQuote}
                disabled={loading}
            >
                הצג ציטוט חדש
            </button>

        </section>
    );
}