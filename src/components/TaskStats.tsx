import type { Task } from "../types/Task";

/**
 * ממשק המגדיר את הנתונים שמקבלת קומפוננטת הסטטיסטיקה.
 */
interface TaskStatsProps {
    tasks: Task[];
}

/**
 * קומפוננטה המציגה נתונים סטטיסטיים על המשימות במערכת.
 * @param tasks - מערך כלל המשימות במערכת.
 * @returns כרטיסי סטטיסטיקה ומד התקדמות.
 */
export default function TaskStats({ tasks }: TaskStatsProps) {

    // מספר המשימות הכולל
    const totalTasks = tasks.length;

    // מספר המשימות שהושלמו
    const completedTasks = tasks.filter((task) => task.completed).length;

    // מספר המשימות שטרם הושלמו
    const pendingTasks = totalTasks - completedTasks;

    // חישוב אחוז השלמת המשימות ומניעת חלוקה באפס
    const progress = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    return (
        <section className="task-stats">

            <div className="stats-grid">

                <div className="stat-card stat-total">
                    <span>סך המשימות</span>
                    <strong>{totalTasks}</strong>
                </div>

                <div className="stat-card stat-completed">
                    <span>משימות שהושלמו</span>
                    <strong>{completedTasks}</strong>
                </div>

                <div className="stat-card stat-pending">
                    <span>משימות שנותרו</span>
                    <strong>{pendingTasks}</strong>
                </div>

            </div>

            <div className="progress-section">

                <div className="progress-header">
                    <span>התקדמות כללית</span>
                    <strong>{progress}%</strong>
                </div>

                <progress
                    className="progress-bar"
                    value={progress}
                    max={100}
                    aria-label="אחוז השלמת המשימות"
                />

            </div>

        </section>
    );
}