import express from "express";
import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use(errorHandler);

export default app;
