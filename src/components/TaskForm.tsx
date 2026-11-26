import { useState } from "react";
import type { FormEvent } from "react";
import type { TaskInput, TaskPriority } from "../types/Task";

/**
 * ממשק המגדיר את הפרמטרים שמקבלת קומפוננטת הוספת המשימה.
 */
interface TaskFormProps {
    onAddTask: (details: TaskInput) => void;
}

/**
 * קומפוננטה המציגה טופס להוספת משימה חדשה.
 * @param onAddTask - פונקציה להוספת משימה למערכת.
 * @returns טופס להזנת פרטי המשימה.
 */
export default function TaskForm({ onAddTask }: TaskFormProps) {

    // שמירת פרטי המשימה
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [dueDate, setDueDate] = useState<string>("");

    /**
     * טיפול בשליחת הטופס והוספת משימה חדשה.
     * @param event - אירוע שליחת הטופס.
     */
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {

        event.preventDefault();

        // מניעת הוספת משימה ללא שם
        if (!title.trim()) {
            return;
        }

        // העברת פרטי המשימה לקומפוננטת האב
        onAddTask({
            title: title.trim(),
            description: description.trim(),
            priority,
            dueDate
        });

        // איפוס הטופס לאחר הוספת המשימה
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>

            <h2>הוספת משימה חדשה</h2>

            <label htmlFor="task-title">שם המשימה</label>

            <input
                id="task-title"
                type="text"
                placeholder="הזן את שם המשימה"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
            />

            <label htmlFor="task-description">תיאור המשימה</label>

            <textarea
                id="task-description"
                placeholder="הזן תיאור למשימה (אופציונלי)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />

            <label htmlFor="task-priority">רמת עדיפות</label>

            <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                    setPriority(event.target.value as TaskPriority)
                }
            >
                <option value="low">נמוכה</option>
                <option value="medium">בינונית</option>
                <option value="high">גבוהה</option>
            </select>

            <label htmlFor="task-due-date">
                תאריך יעד (אופציונלי)
            </label>

            <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
            />

            <button type="submit">
                הוסף משימה
            </button>

        </form>
    );
}