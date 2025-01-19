import express from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routeNotFound from "./app/middlewares/routeNotFound";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({ message: "Hello Developer!" });
});

// handle global errors
app.use(globalErrorHandler);

// handle api route not found
app.use(routeNotFound);

export default app;
