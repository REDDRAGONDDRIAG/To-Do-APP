import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { db, auth, googleAuthProvider } from './Config.js';

let currentUser = null;

async function signIn() {
    try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        currentUser = result.user;
        console.log("Signed in as:", currentUser.displayName);
        fetchTasks();
    } catch (error) {
        console.error("Authentication failed:", error);
    }
}

const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');

const tasksCollection = collection(db, "tasks");

async function addTaskBack() {
    if (!currentUser) {
        alert("Please sign in first. Or your new Task won't be saved online!");
        return;
    }

    const taskText = taskInput.value.trim();
    const taskPriority = parseInt(prioritySelect.value);
    const taskDueDate = taskDate.value;

    if (!taskText) return alert('Please enter a task.');
    if (!taskDueDate) return alert('Please select a date.');

    try {
        await addDoc(tasksCollection, {
            text: taskText,
            priority: taskPriority,
            dueDate: taskDueDate,
            userId: currentUser.uid // 🔐 add user ID to match your rules
        });
        taskInput.value = '';
        taskDate.value = '';
        fetchTasks();
    } catch (error) {
        console.error("Error adding task:", error);
    }
}

async function deleteTaskBack(id) {
    try {
        await deleteDoc(doc(db, "tasks", id));
        fetchTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

async function fetchTasks() {
    taskList.innerHTML = '';
    const querySnapshot = await getDocs(tasksCollection);
    const tasks = [];

    querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.userId === currentUser?.uid) {
            tasks.push({ id: doc.id, ...data });
        }
    });

    tasks.sort((a, b) => {
        if (a.dueDate === b.dueDate) return a.priority - b.priority;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `priority-p${task.priority}`;
        li.innerHTML = `
            ${task.text} (P${task.priority}) - ${task.dueDate}
            <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
        `;
        taskList.appendChild(li);
    });
}


window.addTaskBack = addTaskBack;
window.deleteTaskBack = deleteTaskBack;
window.signIn = signIn;