import express from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routeNotFound from "./app/middlewares/routeNotFound";

const app = express();

app.use(cors({ origin: ["http://localhost:5000"] }));
app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({ message: "Hello Developer!" });
});

// Serve static files from the 'uploads' directory
app.use("/images", express.static('uploads/images'));
app.use("/audio", express.static('uploads/audio'));

// handle global errors
app.use(globalErrorHandler);

// handle api route not found
app.use(routeNotFound);

export default app;
