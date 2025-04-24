import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const pointsDisplay = document.getElementById("points-display");
const levelDisplay = document.getElementById("level-display");
const challengesDisplay = document.getElementById("challenges-display");

const loadUserData = async (userId) => {
    const pointsSnapshot = await database.ref(`users/${userId}/points`).once("value");
    const points = pointsSnapshot.val() || 0;
    pointsDisplay.textContent = `Punkty: ${points}`;

    const levelSnapshot = await database.ref(`users/${userId}/level`).once("value");
    const level = levelSnapshot.val() || 1;
    levelDisplay.textContent = `Poziom: ${level}`;

    const challengesSnapshot = await database.ref(`users/${userId}/challenges`).once("value");
    const challenges = challengesSnapshot.val() || 0;
    challengesDisplay.textContent = `Wyzwania: ${challenges}`;
};

const fetchTasks = async () => {
    const response = await fetch("http://localhost:3000/api/tasks");
    const tasks = await response.json();
    renderTasks(tasks);
};

const renderTasks = (tasks) => {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.textContent = task.name;
        taskItem.addEventListener('click', async () => {
            await markTaskAsCompleted(task.id);
            const points = await updatePoints(10);  // Add points for completing the task
            loadUserData("user1");
        });
        taskList.appendChild(taskItem);
    });
};

const markTaskAsCompleted = async (taskId) => {
    await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ completed: true }),
        headers: { "Content-Type": "application/json" },
    });
};

const updatePoints = async (pointsToAdd) => {
    const userId = "user1";
    const userPointsSnapshot = await database.ref(`users/${userId}/points`).once("value");
    const currentPoints = userPointsSnapshot.val() || 0;
    const newPoints = currentPoints + pointsToAdd;

    await database.ref(`users/${userId}/points`).set(newPoints);
    pointsDisplay.textContent = `Punkty: ${newPoints}`;
    return newPoints;
};

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = taskInput.value.trim();
    if (taskName) {
        addTask(taskName);
        taskInput.value = "";
    }
});

const addTask = async (taskName) => {
    await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({ name: taskName }),
        headers: { "Content-Type": "application/json" },
    });
    fetchTasks();
};

const init = () => {
    loadUserData("user1");
    fetchTasks();
};

init();
