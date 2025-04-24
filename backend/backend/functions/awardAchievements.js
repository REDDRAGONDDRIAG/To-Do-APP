exports.checkAchievements = async (userId, completedTasks) => {
    const db = require("../../src/db");
    let achievements = [];
    if (completedTasks >= 10) {
      achievements.push("10 Tasks Completed");
      await db.query("UPDATE gamification SET achievements = JSON_ARRAY_APPEND(achievements, '$', ?) WHERE user_id = ?", ["10 Tasks Completed", userId]);
    }
    return achievements;
  };