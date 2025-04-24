exports.getUserProfile = async (req, res) => {
    const userId = req.user.id;
    const user = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    res.json(user);
  };