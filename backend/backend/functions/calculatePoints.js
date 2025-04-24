exports.calculatePoints = (task) => {
    let points = 10; // Bazowa liczba punktów
    if (task.difficulty === "hard") points += 20;
    if (task.difficulty === "medium") points += 10;
    if (task.status === "completed") points += 5;
    return points;
  };