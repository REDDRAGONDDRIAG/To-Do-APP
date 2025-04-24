exports.updateLevel = async (userId, points) => {
    const levelThreshold = 100; // Punkty na poziom
    const newLevel = Math.floor(points / levelThreshold) + 1;
    const db = require("../../src/db");
    await db.query("UPDATE gamification SET level = ? WHERE user_id = ?", [newLevel, userId]);
    return newLevel;
  };