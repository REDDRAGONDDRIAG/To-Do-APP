const tasks = [];

function addTaskFront() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskDate = document.getElementById('taskDate');
    const taskList = document.getElementById('taskList');

    const taskText = taskInput.value.trim();
    const taskPriority = prioritySelect.value;
    const taskDueDate = taskDate.value;
    

    if (!taskText) {
        alert('Please enter a task.');
        return;
    }

    if (!taskDueDate) {
        alert('Please select a date.');
        return;
    }

    // Add the new task to the tasks array
    tasks.push({ text: taskText, priority: parseInt(taskPriority), dueDate: taskDueDate });

    // Sort tasks by priority and date
    tasks.sort((a, b) => {
        if (a.dueDate === b.dueDate) {
            return a.priority - b.priority;
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    // Clear input field
    taskInput.value = '';
    taskDate.value = '';

    // Render tasks
    renderTasks(taskList);
}

function deleteTaskFront(index) {
    tasks.splice(index, 1); // Remove the task at the specified index
    renderTasks(document.getElementById('taskList')); // Re-render the task list
}

function renderTasks(taskList) {
    // Clear the existing tasks
    taskList.innerHTML = '';

    // Add sorted tasks to the list
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `priority-p${task.priority}`;
        li.innerHTML = `
            ${task.text} (P${task.priority}) - ${task.dueDate}
            <button class="delete-btn" onclick="deleteTaskFront(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

window.addTaskFront = addTaskFront;
window.deleteTaskFront = deleteTaskFront;