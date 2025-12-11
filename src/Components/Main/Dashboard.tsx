import React, { useState, useMemo, useEffect } from "react";
import styles from "../../style/Main/Dashboard.module.scss";
import { apiService } from "../../services/api.ts";
import type { Task as ApiTask } from "../../services/api.ts";

interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
  assignee: string;
  assigneeAvatar?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "critical";
}

const Dashboard: React.FC = () => {
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high" | "critical"
  >("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка задач с бэкенда
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTasks();
        // Преобразование данных из API в интерфейс компонента
        const transformed: Task[] = data.map((task: ApiTask) => {
          // Маппинг статуса
          let status: "todo" | "in-progress" | "done";
          switch (task.status?.toLowerCase()) {
            case "completed":
            case "done":
              status = "done";
              break;
            case "in_progress":
            case "in-progress":
              status = "in-progress";
              break;
            default:
              status = "todo";
          }

          // Маппинг приоритета (ожидаем low, medium, high, critical)
          const priority = task.priority as
            | "low"
            | "medium"
            | "high"
            | "critical";

          // Имя назначенного
          const assigneeName = task.assignee?.name || "Не назначено";
          // Аватар - первые буквы имени
          const assigneeAvatar = assigneeName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          // Дата в формате YYYY-MM-DD
          const dueDate = task.due_date
            ? task.due_date.split(" ")[0]
            : undefined;

          return {
            id: task.id,
            title: task.title,
            status,
            assignee: assigneeName,
            assigneeAvatar,
            dueDate,
            priority,
          };
        });
        setTasks(transformed);
        setError(null);
      } catch (err) {
        console.error("Ошибка загрузки задач:", err);
        setError("Не удалось загрузить задачи. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };

  // Фильтрация и сортировка задач
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Фильтрация по приоритету
    if (priorityFilter !== "all") {
      filtered = tasks.filter((task) => task.priority === priorityFilter);
    }

    // Сортировка от менее важных к критически важным (asc) или наоборот (desc)
    const sorted = [...filtered].sort((a, b) => {
      const orderA = priorityOrder[a.priority];
      const orderB = priorityOrder[b.priority];
      return sortOrder === "asc" ? orderA - orderB : orderB - orderA;
    });

    return sorted;
  }, [tasks, priorityFilter, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "#667EEA";
      case "in-progress":
        return "#FDC700";
      case "done":
        return "#05DF72";
      default:
        return "#667EEA";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "todo":
        return "К выполнению";
      case "in-progress":
        return "В работе";
      case "done":
        return "Выполнено";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "#FF6467";
      case "high":
        return "#FF8C42";
      case "medium":
        return "#FDC700";
      case "low":
        return "#667EEA";
      default:
        return "#667EEA";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "critical":
        return "Критический";
      case "high":
        return "Высокий";
      case "medium":
        return "Средний";
      case "low":
        return "Низкий";
      default:
        return priority;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    const color = getStatusColor(status);
    return {
      backgroundColor: `${color}20`,
      borderColor: `${color}40`,
      color: color,
      border: "2px solid",
      padding: "4px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    };
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardContent}>
        {/* Панель задач */}
        <div className={`${styles.panel} ${styles.tasksPanel}`}>
          <div className={styles.panelHeader}>
            <div className={styles.titleContainer}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4.16663 10H15.8333M10 4.16675V15.8334" />
              </svg>
              <h2>Задачи</h2>
            </div>
          </div>

          {/* Фильтры и сортировка */}
          <div className={styles.filtersContainer}>
            <div className={styles.priorityFilters}>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "all" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("all")}
              >
                Все
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "low" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("low")}
                style={{
                  backgroundColor:
                    priorityFilter === "low"
                      ? `${getPriorityColor("low")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "low"
                      ? getPriorityColor("low")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "low"
                      ? getPriorityColor("low")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Низкий
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "medium" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("medium")}
                style={{
                  backgroundColor:
                    priorityFilter === "medium"
                      ? `${getPriorityColor("medium")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "medium"
                      ? getPriorityColor("medium")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "medium"
                      ? getPriorityColor("medium")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Средний
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "high" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("high")}
                style={{
                  backgroundColor:
                    priorityFilter === "high"
                      ? `${getPriorityColor("high")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "high"
                      ? getPriorityColor("high")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "high"
                      ? getPriorityColor("high")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Высокий
              </button>
              <button
                className={`${styles.filterButton} ${
                  priorityFilter === "critical" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setPriorityFilter("critical")}
                style={{
                  backgroundColor:
                    priorityFilter === "critical"
                      ? `${getPriorityColor("critical")}20`
                      : "transparent",
                  borderColor:
                    priorityFilter === "critical"
                      ? getPriorityColor("critical")
                      : "rgba(255, 255, 255, 0.1)",
                  color:
                    priorityFilter === "critical"
                      ? getPriorityColor("critical")
                      : "rgba(255, 255, 255, 0.6)",
                }}
              >
                Критический
              </button>
            </div>
            <button
              className={styles.sortButton}
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"} Сортировка
            </button>
          </div>

          {loading ? (
            <div className={styles.tasksList}>
              <div className={styles.taskItem} style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                Загрузка задач...
              </div>
            </div>
          ) : error ? (
            <div className={styles.tasksList}>
              <div className={styles.taskItem} style={{ borderLeftColor: '#FF6467', color: '#FF6467' }}>
                {error}
              </div>
            </div>
          ) : filteredAndSortedTasks.length === 0 ? (
            <div className={styles.tasksList}>
              <div className={styles.taskItem} style={{ justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                Нет задач для отображения
              </div>
            </div>
          ) : (
            <div className={styles.tasksList}>
              {filteredAndSortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={styles.taskItem}
                  style={{
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  }}
                >
                  <div className={styles.taskHeader}>
                    <div className={styles.taskStatus}>
                      <span style={getStatusBadgeStyle(task.status)}>
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: getStatusColor(task.status),
                            display: "inline-block",
                          }}
                        />
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    <div
                      className={styles.priorityBadge}
                      style={{
                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                        borderColor: getPriorityColor(task.priority),
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {getPriorityText(task.priority)}
                    </div>
                  </div>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <div className={styles.taskFooter}>
                    <div className={styles.taskAssignee}>
                      <div className={styles.assigneeAvatar}>
                        {task.assigneeAvatar ||
                          task.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                      </div>
                      <span>{task.assignee}</span>
                    </div>
                    {task.dueDate && (
                      <span className={styles.taskDueDate}>
                        {new Date(task.dueDate).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
