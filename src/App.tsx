import { useState, useEffect } from "react";
import type {
  Task,
  TaskInput,
  TaskFilter as FilterType
} from "./types/Task";

import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import TaskFilter from "./components/TaskFilter";
import TaskSearch from "./components/TaskSearch";
import QuoteBox from "./components/QuoteBox";
import TaskStats from "./components/TaskStats";
import "./App.css";

// המפתח המשמש לשמירת המשימות באחסון המקומי
const STORAGE_KEY = "rightontime-tasks";

/**
 * הקומפוננטה הראשית של המערכת.
 * אחראית על ניהול המשימות, סינון, חיפוש, עריכה,
 * שמירה והצגת ממשק המשתמש.
 * @returns ממשק מערכת ניהול המשימות.
 */
function App() {

  // שמירת רשימת המשימות
  const [tasks, setTasks] = useState<Task[]>([]);

  // שמירת אפשרות הסינון הנוכחית
  const [filter, setFilter] = useState<FilterType>("all");

  // שמירת הטקסט שהוזן בשדה החיפוש
  const [searchTerm, setSearchTerm] = useState<string>("");

  // בדיקה האם הסתיימה טעינת המשימות
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  /**
   * טעינת המשימות מהאחסון המקומי בעת עליית האפליקציה.
   */
  useEffect(() => {

    try {

      const savedTasks = localStorage.getItem(STORAGE_KEY);

      if (savedTasks) {

        const parsedTasks: Task[] = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      }

    } catch (error) {

      console.error("שגיאה בטעינת המשימות:", error);

    } finally {

      setIsLoaded(true);
    }

  }, []);

  /**
   * שמירת רשימת המשימות באחסון המקומי בכל שינוי.
   */
  useEffect(() => {

    if (!isLoaded) {
      return;
    }

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );

    } catch (error) {

      console.error("שגיאה בשמירת המשימות:", error);
    }

  }, [tasks, isLoaded]);

  /**
   * הוספת משימה חדשה לרשימת המשימות.
   * @param details - פרטי המשימה שהמשתמש הזין.
   */
  function addTask(details: TaskInput): void {

    const newTask: Task = {
      ...details,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  /**
   * שינוי סטטוס ההשלמה של משימה קיימת.
   * @param id - המזהה הייחודי של המשימה.
   */
  function toggleTask(id: string): void {

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  /**
   * מחיקת משימה מרשימת המשימות לאחר קבלת אישור מהמשתמש.
   * @param id - המזהה הייחודי של המשימה למחיקה.
   */
  function deleteTask(id: string): void {

    const confirmed = window.confirm(
      "האם אתה בטוח שברצונך למחוק את המשימה?"
    );

    // ביטול הפעולה אם המשתמש לא אישר את המחיקה
    if (!confirmed) {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  /**
   * עדכון פרטי משימה קיימת תוך שמירה על יתר הנתונים שלה.
   * @param id - המזהה הייחודי של המשימה לעריכה.
   * @param details - פרטי המשימה המעודכנים.
   */
  function editTask(id: string, details: TaskInput): void {

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, ...details }
          : task
      )
    );
  }

  /**
   * סינון המשימות לפי סטטוס ההשלמה וטקסט החיפוש.
   * @returns מערך המשימות המתאימות לתנאי הסינון והחיפוש.
   */
  function getFilteredTasks(): Task[] {

    let result = tasks;

    // סינון לפי סטטוס השלמת המשימה
    switch (filter) {

      case "completed":
        result = result.filter((task) => task.completed);
        break;

      case "pending":
        result = result.filter((task) => !task.completed);
        break;
    }

    // הסרת רווחים והמרה לאותיות קטנות
    const normalizedSearch = searchTerm.trim().toLowerCase();

    // סינון לפי שם המשימה או התיאור שלה
    if (normalizedSearch !== "") {

      result = result.filter((task) =>

        task.title.toLowerCase().includes(normalizedSearch) ||

        (task.description ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }

    return result;
  }

  // קבלת רשימת המשימות לאחר הסינון והחיפוש
  const filteredTasks = getFilteredTasks();

  return (
    <main className="app-container" dir="rtl">

      <header className="app-header">

        <div className="app-brand">

          <img
            src="/favicon.svg"
            alt="לוגו RightOnTime"
            className="app-logo"
          />

          <div>
            <h1>RightOnTime</h1>
            <p>מערכת אישית לניהול משימות</p>
          </div>

        </div>

      </header>

      <TaskStats tasks={tasks} />

      <QuoteBox />

      <TaskForm onAddTask={addTask} />

      <section className="task-list">

        <h2>המשימות שלי</h2>

        <TaskSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
        />

        {filteredTasks.length === 0 && (
          <p>לא נמצאו משימות המתאימות לחיפוש או לסינון.</p>
        )}

        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
          />
        ))}

      </section>

    </main>
  );
}

export default App;