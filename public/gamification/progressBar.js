export function updateProgressBar(points, levelThreshold) {
    const progress = (points / levelThreshold) * 100;
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${points}/${levelThreshold} XP`;
  }