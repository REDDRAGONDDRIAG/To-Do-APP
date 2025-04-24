const db = require("../../src/db");
const { calculatePoints } = require("../functions/calculatePoints");

exports.awardPoints = async (req, res) => {
  const { taskId } = req.body;
  const userId = req.user.id;
  try {
    const [task] = await db.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
    if (!task.length) return res.status(404).json({ error: "Task not found" });
    
    const points = calculatePoints(task[0]);
    await db.query("UPDATE gamification SET points = points + ? WHERE user_id = ?", [points, userId]);
    
    res.json({ message: `Awarded ${points} points` });
  } catch (error) {
    res.status(500).json({ error: "Failed to award points" });
  }
};

exports.getUserStats = async (req, res) => {
  const userId = req.user.id;
  try {
    const [stats] = await db.query("SELECT points, level, achievements FROM gamification WHERE user_id = ?", [userId]);
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};