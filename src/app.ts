import express from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routeNotFound from "./app/middlewares/routeNotFound";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://147.182.247.218:3003", "https://huemanexpressions.com/"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json("Yay! 'Hue-man' server is running!");
});

// Serve static files from the 'uploads' directory
app.use("/images", express.static('uploads/images'));
app.use("/audio", express.static('uploads/audio'));

// handle global errors
app.use(globalErrorHandler);

// handle api route not found
app.use(routeNotFound);

export default app;
