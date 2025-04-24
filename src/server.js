const express = require("express");
const app = express();
const tasksRoutes = require("../backend/routes/tasks");
const gamificationRoutes = require("../backend/routes/gamification");

app.use(express.json());
app.use("/api/tasks", tasksRoutes);
app.use("/api/gamification", gamificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));