import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { signInWithPopup, signOut, getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { db, auth, googleAuthProvider, messaging } from './Config.js';
import { getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging.js";

let currentUser = null;

async function signIn() {
    try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        currentUser = result.user;
        console.log("✅ Signed in as:", currentUser.displayName);

        fetchTasks();

        showNotificationModal(); 

    } catch (error) {
        console.error("❌ Authentication failed:", error);
    }
}

function showNotificationModal() {
    const modal = document.getElementById('notificationModal');
    modal.style.display = 'block';

    document.getElementById('allowNotificationsBtn').onclick = () => {
        console.log("👆 Kliknięto Zezwól");
    
        modal.style.display = 'none';
    
        Notification.requestPermission().then(permission => {
            console.log("📩 Wynik requestPermission:", permission);
    
            if (permission === 'granted') {
                requestFcmToken();
                console.warn('Użytkownik wydał zgodę na powiadomienia');
            } else {
                console.warn('⚠️ Użytkownik nie zezwolił na powiadomienia.');
            }
        });
    };
    
    document.getElementById('denyNotificationsBtn').onclick = () => {
        modal.style.display = 'none';
        console.log("❌ Użytkownik nie wyraził zgody na powiadomienia.");
    };
}

async function requestFcmToken() {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BG5t51LWlghJOAbkclP68VNMCbtFdzHF3NVtBM2k2Kt0uf8uU3MEHx06xyWEDY2N6lXLIerm6-eVsL4J1NjPD_w"
        });

        if (currentToken) {
            await setDoc(doc(db, "fcmTokens", currentUser.uid), {
                token: currentToken,
                timestamp: new Date()
            });

            console.log("📩 FCM token zapisany w bazie.");
        } else {
            console.warn('⚠️ Brak tokenu FCM.');
        }
    } catch (err) {
        console.error('❌ Błąd przy pobieraniu tokena FCM:', err);
    }
}

async function signOutUser() {
    try {
        await signOut(auth);
        currentUser = null;
        taskList.innerHTML = '';
        console.log("✅ Signed out successfully.");
    } catch (error) {
        console.error("❌ Sign out failed:", error);
    }
}

function showLoginRequiredMessage() {
    const modal = document.getElementById('loginRequiredModal');
    modal.style.display = 'block';

    document.getElementById('loginRequiredBtn').onclick = () => {
        signIn();
        modal.style.display = 'none';
    };
}

const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');
const tasksCollection = collection(db, "tasks");

async function addTaskBack() {
    if (!currentUser) {
        showLoginRequiredMessage();
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
            userId: currentUser.uid
        });
        taskInput.value = '';
        taskDate.value = '';
        fetchTasks();
    } catch (error) {
        console.error("❌ Error adding task:", error);
    }
}

async function deleteTaskBack(id) {
    try {
        await deleteDoc(doc(db, "tasks", id));
        fetchTasks();
    } catch (error) {
        console.error("❌ Error deleting task:", error);
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(reg => {
            console.log("✅ Service Worker zarejestrowany:", reg);
        })
        .catch(err => console.error("❌ Błąd Service Workera:", err));
}

onMessage(messaging, (payload) => {
    console.log("🔔 Powiadomienie (foreground):", payload);
    showAppNotification(payload.notification.title, payload.notification.body);
});

function showAppNotification(title, body) {
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('app-notification');
    notificationDiv.innerHTML = `
        <strong>${title}</strong>: ${body}
        <button onclick="this.parentElement.remove()">X</button>
    `;
    document.body.appendChild(notificationDiv);
}

window.addTaskBack = addTaskBack;
window.deleteTaskBack = deleteTaskBack;
window.signIn = signIn;
window.signOut = signOutUser;
window.requestFcmToken = requestFcmToken;
window.showNotificationModal = showNotificationModal;
window.showLoginRequiredMessage = showLoginRequiredMessage;
