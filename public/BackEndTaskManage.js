import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { db, auth, googleAuthProvider } from './Config.js';
import { messaging } from './Config.js';
import { getToken } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging.js";
import { getRedirectResult, signInWithRedirect } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";


let currentUser = null;

// async function signIn() {
//     try {
//         const result = await signInWithPopup(auth, googleAuthProvider);
//         currentUser = result.user;
//         await requestPermissionAndSaveToken(currentUser.uid);
//         console.log("Signed in as:", currentUser.displayName);
//         fetchTasks();
//     } catch (error) {
//         console.error("Authentication failed:", error);
//     }
// }
async function signIn() {
    try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        currentUser = result.user;
        await requestPermissionAndSaveToken(currentUser.uid);
        console.log("Signed in as:", currentUser.displayName);
        fetchTasks();
    } catch (error) {
        console.error("Authentication failed:", error);
        alert('Nie udało się zalogować. Spróbuj ponownie!');
    }
}

async function handleRedirectResult() {
    try {
        const result = await getRedirectResult(auth);

        if (result) {
            currentUser = result.user;
            console.log("Signed in as:", currentUser.displayName);
            
            await requestPermissionAndSaveToken(currentUser.uid);
            
            fetchTasks();
        } else {
            console.log("Nie znaleziono wyników logowania.");
        }
    } catch (error) {
        console.error("Błąd podczas logowania po przekierowaniu:", error);
    }
}

handleRedirectResult();

const taskList = document.getElementById('taskList');

const tasksCollection = collection(db, "tasks");

async function addTaskBack() {
    if (!currentUser) {
        alert("Please sign in first. Or your new Task won't be saved online!");
        return;
    }

    const taskInput = document.getElementById('taskInput');
    console.log(taskInput);
    const prioritySelect = document.getElementById('prioritySelect');
    console.log(prioritySelect);
    const taskDate = document.getElementById('taskDate');
    console.log(taskDate);

    const taskText = taskInput.value.trim();
    console.log(taskText);
    const taskPriority = parseInt(prioritySelect.value);
    console.log(taskPriority);
    const taskDueDate = taskDate.value;
    console.log(taskDueDate);

    console.warn("sdss");

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
            <button class="delete-btn" onclick="deleteTaskBack('${task.id}')">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

async function requestPermissionAndSaveToken(uid) {
    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: "BG5t51LWlghJOAbkclP68VNMCbtFdzHF3NVtBM2k2Kt0uf8uU3MEHx06xyWEDY2N6lXLIerm6-eVsL4J1NjPD_w"
            });

            if (token) {
                console.log("📲 FCM Token:", token);
                await addDoc(collection(db, "fcmTokens"), {
                    uid,
                    token,
                    createdAt: new Date()
                });
            }
        } else {
            console.warn("❌ Użytkownik odrzucił pozwolenie na powiadomienia.");
        }
    } catch (err) {
        console.error("Błąd pobierania tokena:", err);
    }
}



window.addTaskBack = addTaskBack;
window.deleteTaskBack = deleteTaskBack;
window.signIn = signIn;