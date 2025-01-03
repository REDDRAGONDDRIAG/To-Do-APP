const API_URL = "http://localhost:3000/tasks"; // Replace with your backend URL

// DOM elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Fetch tasks from the server
async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  renderTasks(tasks);
}

// Render tasks to the DOM
function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.className = task.completed ? "completed" : "";
    taskItem.innerHTML = `
      <span>${task.name}</span>
      <div>
        <button class="complete-btn" onclick="toggleComplete(${task.id})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Add a new task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newTask = {
    name: taskInput.value,
    completed: false,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });

  if (response.ok) {
    taskInput.value = "";
    fetchTasks();
  }
});

// Toggle task completion
async function toggleComplete(taskId) {
  const task = await fetch(`${API_URL}/${taskId}`).then(res => res.json());
  task.completed = !task.completed;

  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (response.ok) {
    fetchTasks();
  }
}

// Delete a task
async function deleteTask(taskId) {
  const response = await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });

  if (response.ok) {
    fetchTasks();
  }
}

// Initial fetch
fetchTasks();
