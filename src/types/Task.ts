/**
 * טיפוס המגדיר את רמות העדיפות האפשריות של משימה.
 */
export type TaskPriority = "low" | "medium" | "high";

/**
 * ממשק המגדיר את פרטי המשימה שהמשתמש מזין.
 */
export interface TaskInput {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
}

/**
 * ממשק המייצג משימה במערכת ניהול המשימות.
 */
export interface Task extends TaskInput {
    id: string;
    completed: boolean;
    createdAt: string;
}

/**
 * טיפוס המגדיר את אפשרויות סינון המשימות.
 */
export type TaskFilter = "all" | "completed" | "pending";