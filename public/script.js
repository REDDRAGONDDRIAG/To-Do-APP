const API_URL = "http://localhost:3000/api/tasks";

// Inicjalizacja Firebase
const { initializeApp } = firebase;
const { getFirestore, doc, onSnapshot, setDoc, updateDoc } = firebase.firestore;

const firebaseConfig = {
    apiKey: "AIzaSyDd_44xy9naaIhgjY_Ikv73LdhZq78A9Ws",
    authDomain: "todo-44034.firebaseapp.com",
    projectId: "todo-44034",
    storageBucket: "todo-44034.appspot.com",
    messagingSenderId: "711287731990",
    appId: "1:711287731990:web:fbb4c6aac2de3c4ea64237",
    measurementId: "G-GKYH0GPTXW"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let userKey = window.userEmail || "guest";
let userRef = doc(db, "users", userKey);

// Pobierz dane gamifikacji w czasie rzeczywistym
onSnapshot(userRef, (doc) => {
  const data = doc.data() || { score: 0, level: 1 };
  score = data.score || 0;
  level = data.level || Math.floor(score / 100) + 1;
  updateScore();
}, (error) => console.error("Error fetching data:", error));

// Punktacja wg priorytetu
function getPointsForPriority(priority) {
  switch (priority.toLowerCase()) {
    case 'p1': return 15;
    case 'p2': return 12;
    case 'p3': return 9;
    case 'p4': return 6;
    case 'p5': return 3;
    default: return 5;
  }
}

function updateLevel() {
  level = Math.floor(score / 100) + 1;
  updateDoc(userRef, { level }).catch(console.error);
  document.getElementById("level").textContent = level;
}

function updateXPBar() {
  const xp = score % 100;
  document.getElementById("xp-bar").style.width = xp + "%";
}

function updateScore() {
  document.getElementById("score").textContent = score;
  updateLevel();
  updateXPBar();
}

// DOM refs
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");

// Fetch & render
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.innerHTML = `
      <span>${task.name}</span>
      <span class="priority">${task.priority}</span>
      <button onclick="toggleComplete(${task.id})">Complete</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

fetchTasks();

// Add task
async function addTask() {
  const name = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (!name) return;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, priority })
  });

  if (res.ok) {
    taskInput.value = "";
    fetchTasks();
    // Inicjalizacja lub aktualizacja gamifikacji
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, { score: 5, level: 1 });
    } else {
      await updateDoc(userRef, { score: docSnap.data().score + 5 });
    }
  }
}

// Complete task
async function toggleComplete(id) {
  const li = document.querySelector(`li[data-id="${id}"]`);
  const priority = li.querySelector(".priority").textContent.toLowerCase();
  const points = getPointsForPriority(priority);

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: true })
  });

  const docSnap = await getDoc(userRef);
  score = docSnap.data().score + points;
  await updateDoc(userRef, { score });
  updateScore();

  alert(`Zadanie ukończone. +${points} pkt.`);
  fetchTasks();
}

// Delete task
async function deleteTask(id) {
  const li = document.querySelector(`li[data-id="${id}"]`);
  const priority = li.querySelector(".priority").textContent.toLowerCase();
  const points = getPointsForPriority(priority);

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  const docSnap = await getDoc(userRef);
  score = docSnap.data().score + points;
  await updateDoc(userRef, { score });
  updateScore();

  alert(`Zadanie usunięte. +${points} pkt.`);
  li.remove();
}
