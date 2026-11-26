import type { TaskFilter as FilterType } from "../types/Task";

/**
 * ממשק המגדיר את הפרמטרים שמקבלת קומפוננטת סינון המשימות.
 */
interface TaskFilterProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

/**
 * קומפוננטה המאפשרת לסנן את המשימות לפי סטטוס ההשלמה שלהן.
 * @param currentFilter - אפשרות הסינון הנוכחית.
 * @param onFilterChange - פונקציה לעדכון אפשרות הסינון.
 * @returns רכיב המכיל שלושה כפתורי סינון.
 */
export default function TaskFilter({
    currentFilter,
    onFilterChange
}: TaskFilterProps) {

    return (
        <div className="task-filters">

            <button
                type="button"
                className={currentFilter === "all" ? "active" : ""}
                onClick={() => onFilterChange("all")}
            >
                כל המשימות
            </button>

            <button
                type="button"
                className={currentFilter === "completed" ? "active" : ""}
                onClick={() => onFilterChange("completed")}
            >
                הושלמו
            </button>

            <button
                type="button"
                className={currentFilter === "pending" ? "active" : ""}
                onClick={() => onFilterChange("pending")}
            >
                טרם הושלמו
            </button>

        </div>
    );
}