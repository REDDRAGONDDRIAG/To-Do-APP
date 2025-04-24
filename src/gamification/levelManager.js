const db = require("../db");

exports.updateLevel = async (userId, points) => {
  const levelThreshold = 100;
  const newLevel = Math.floor(points / levelThreshold) + 1;
  await db.query("UPDATE gamification SET level = ? WHERE user_id = ?", [newLevel, userId]);
  return newLevel;
};