const db = require("../db");

exports.addAchievement = async (userId, achievement) => {
  await db.query(
    "UPDATE gamification SET achievements = JSON_ARRAY_APPEND(achievements, '$', ?) WHERE user_id = ?",
    [achievement, userId]
  );
};