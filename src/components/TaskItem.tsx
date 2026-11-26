import { useState } from "react";
import type { FormEvent } from "react";
import type { Task, TaskInput, TaskPriority } from "../types/Task";

/**
 * ממשק המגדיר את הפרמטרים שמקבלת קומפוננטת המשימה.
 */
interface TaskItemProps {
    task: Task;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onEditTask: (id: string, details: TaskInput) => void;
}

// התאמת רמות העדיפות לתצוגה בעברית
const priorityLabels: Record<TaskPriority, string> = {
    low: "נמוכה",
    medium: "בינונית",
    high: "גבוהה"
};

/**
 * קומפוננטה המציגה משימה בודדת ומאפשרת לערוך,
 * להשלים ולמחוק אותה.
 * @param props - פרטי המשימה והפונקציות לביצוע פעולות עליה.
 * @returns רכיב להצגת משימה או טופס לעריכתה.
 */
export default function TaskItem({
    task,
    onToggleTask,
    onDeleteTask,
    onEditTask
}: TaskItemProps) {

    // שמירת מצב העריכה
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // שמירת פרטי המשימה במהלך העריכה
    const [editedTitle, setEditedTitle] = useState(task.title);

    const [editedDescription, setEditedDescription] = useState(
        task.description ?? ""
    );

    const [editedPriority, setEditedPriority] = useState<TaskPriority>(
        task.priority ?? "medium"
    );

    const [editedDueDate, setEditedDueDate] = useState(
        task.dueDate ?? ""
    );

    /**
     * מעבר למצב עריכה וטעינת פרטי המשימה הנוכחיים.
     */
    function startEditing(): void {

        setEditedTitle(task.title);
        setEditedDescription(task.description ?? "");
        setEditedPriority(task.priority ?? "medium");
        setEditedDueDate(task.dueDate ?? "");
        setIsEditing(true);
    }

    /**
     * ביטול העריכה ללא שמירת השינויים.
     */
    function cancelEditing(): void {
        setIsEditing(false);
    }

    /**
     * שמירת פרטי המשימה המעודכנים.
     * @param event - אירוע שליחת טופס העריכה.
     */
    function handleSave(event: FormEvent<HTMLFormElement>): void {

        event.preventDefault();

        if (!editedTitle.trim()) {
            return;
        }

        onEditTask(task.id, {
            title: editedTitle.trim(),
            description: editedDescription.trim(),
            priority: editedPriority,
            dueDate: editedDueDate
        });

        setIsEditing(false);
    }

    // הצגת טופס עריכת המשימה
    if (isEditing) {
        return (
            <form className="task-form" onSubmit={handleSave}>

                <h2>עריכת משימה</h2>

                <label htmlFor={`edit-title-${task.id}`}>
                    שם המשימה
                </label>

                <input
                    id={`edit-title-${task.id}`}
                    type="text"
                    value={editedTitle}
                    onChange={(event) =>
                        setEditedTitle(event.target.value)
                    }
                    required
                />

                <label htmlFor={`edit-description-${task.id}`}>
                    תיאור המשימה
                </label>

                <textarea
                    id={`edit-description-${task.id}`}
                    value={editedDescription}
                    onChange={(event) =>
                        setEditedDescription(event.target.value)
                    }
                />

                <label htmlFor={`edit-priority-${task.id}`}>
                    רמת עדיפות
                </label>

                <select
                    id={`edit-priority-${task.id}`}
                    value={editedPriority}
                    onChange={(event) =>
                        setEditedPriority(
                            event.target.value as TaskPriority
                        )
                    }
                >
                    <option value="low">נמוכה</option>
                    <option value="medium">בינונית</option>
                    <option value="high">גבוהה</option>
                </select>

                <label htmlFor={`edit-date-${task.id}`}>
                    תאריך יעד
                </label>

                <input
                    id={`edit-date-${task.id}`}
                    type="date"
                    value={editedDueDate}
                    onChange={(event) =>
                        setEditedDueDate(event.target.value)
                    }
                />

                <button type="submit">
                    שמור שינויים
                </button>

                <button
                    type="button"
                    onClick={cancelEditing}
                    style={{ backgroundColor: "#64748b" }}
                >
                    ביטול
                </button>

            </form>
        );
    }

    // הגדרת עדיפות ברירת מחדל עבור משימות ישנות
    const priority = task.priority ?? "medium";

    return (
        <article className={`task-item ${task.completed ? "completed" : ""}`}>

            <div className="task-details">

                <h3>{task.title}</h3>

                {task.description && (
                    <p>{task.description}</p>
                )}

                <p className={`priority-label priority-${priority}`}>
                    עדיפות: {priorityLabels[priority]}
                </p>

                {task.dueDate && (
                    <p>
                        תאריך יעד:{" "}
                        <bdi>
                            {task.dueDate.split("-").reverse().join("/")}
                        </bdi>
                    </p>
                )}

                <span>
                    {task.completed ? "הושלמה" : "טרם הושלמה"}
                </span>

            </div>

            <div className="task-actions">

                <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                >
                    {task.completed ? "בטל השלמה" : "סמן כהושלמה"}
                </button>

                <button
                    type="button"
                    onClick={startEditing}
                    style={{ backgroundColor: "#2563eb" }}
                >
                    עריכה
                </button>

                <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                >
                    מחק
                </button>

            </div>

        </article>
    );
}