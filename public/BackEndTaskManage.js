import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { db, auth, googleAuthProvider } from './Config.js';
import { addEventToCalendar } from './GoogleCalendar.js';

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

    if (!taskText) {
        alert('Please enter a task.');
        return;
    }

    if (!taskDueDate) {
        alert('Please select a date.');
        return;
    }

    try {
        // Add task to Firestore
        const docRef = await addDoc(tasksCollection, {
            text: taskText,
            priority: taskPriority,
            dueDate: taskDueDate,
            userId: currentUser.uid
        });

        // Add event to Google Calendar
        try {
            await addEventToCalendar({
                text: taskText,
                priority: taskPriority,
                dueDate: taskDueDate
            });
            console.log('Task successfully added to Google Calendar');
        } catch (calendarError) {
            console.error('Error adding to Google Calendar:', calendarError);
            alert('Task was saved but failed to add to Google Calendar. Please check your calendar permissions.');
        }

        // Clear inputs
        taskInput.value = '';
        taskDate.value = '';
        
        // Refresh task list
        fetchTasks();
    } catch (error) {
        console.error("Error adding task:", error);
        alert('Failed to save task. Please try again.');
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
    try {
        taskList.innerHTML = '';
        const querySnapshot = await getDocs(tasksCollection);
        const tasks = [];

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === currentUser?.uid) {
                tasks.push({ id: doc.id, ...data });
            }
        });

        // Sort tasks by due date and priority
        tasks.sort((a, b) => {
            if (a.dueDate === b.dueDate) {
                return a.priority - b.priority;
            }
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        // Render tasks
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `priority-p${task.priority}`;
            li.innerHTML = `
                ${task.text} (P${task.priority}) - ${task.dueDate}
                <button class="delete-btn" onclick="deleteTaskBack('${task.id}')">Delete</button>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Make functions available globally
window.addTaskBack = addTaskBack;
window.deleteTaskBack = deleteTaskBack;
window.signIn = signIn;

// Initialize by fetching tasks if user is already signed in
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        fetchTasks();
    }
});