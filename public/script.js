const API_URL = "http://localhost:3000/api/tasks"; // URL backendu

// DOM Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Fetch tasks from the server and render them
const fetchTasks = async () => {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Failed to fetch tasks", error);
    }
};

// Render tasks to the DOM
const renderTasks = (tasks) => {
    taskList.innerHTML = ""; // Clear current tasks
    tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.dataset.id = task.id;
        taskItem.className = task.completed ? "completed" : "";
        taskItem.innerHTML = `
            <span>${task.name}</span>
            <div>
                <button onclick="toggleComplete(${task.id}, ${!task.completed})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
};

// Add a new task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = taskInput.value.trim();
    if (!name) return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (response.ok) {
            const newTask = await response.json();
            renderTasks([...taskList.children].map(li => li.dataset).concat(newTask));
            taskInput.value = ""; // Clear input
            fetchTasks(); // Refresh task list
        }
    } catch (error) {
        console.error("Failed to add task", error);
    }
});

// Toggle task completion
const toggleComplete = async (taskId, completed) => {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed }),
        });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error("Failed to toggle task", error);
    }
};

// Delete a task
const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });

        if (response.ok) {
            fetchTasks();
        }
    } catch (error) {
        console.error("Failed to delete task", error);
    }
};

// Initial fetch
fetchTasks();

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch(API_URL); // Pobierz zadania z backendu
                const tasks = await response.json();

                // Mapuj zadania na wydarzenia kalendarza
                const events = tasks.map(task => ({
                    title: task.name,
                    start: task.dueDate,
                    id: task.id,
                }));

                successCallback(events);
            } catch (error) {
                console.error('Failed to fetch tasks for calendar', error);
                failureCallback(error);
            }
        },
        eventClick: function (info) {
            if (confirm(`Czy na pewno chcesz usunąć zadanie "${info.event.title}"?`)) {
                deleteTask(info.event.id); // Usuń zadanie po kliknięciu
            }
        },
    });

    calendar.render();
});