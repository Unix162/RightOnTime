/**
 * ממשק המגדיר את הפרמטרים שמקבלת קומפוננטת החיפוש.
 */
interface TaskSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

/**
 * קומפוננטה המאפשרת לחפש משימות לפי שם או תיאור.
 * @param searchTerm - הטקסט שהמשתמש הזין בשדה החיפוש.
 * @param onSearchChange - פונקציה לעדכון ערך החיפוש.
 * @returns שדה חיפוש משימות.
 */
export default function TaskSearch({
    searchTerm,
    onSearchChange
}: TaskSearchProps) {

    return (
        <div className="task-form">

            <label htmlFor="task-search">
                חיפוש משימות
            </label>

            <input
                id="task-search"
                type="search"
                placeholder="חפש לפי שם משימה או תיאור..."
                value={searchTerm}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
            />

        </div>
    );
}