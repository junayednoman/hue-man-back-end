import { Router } from "express";
import { deskControllers } from "./desk.controller";
import authVerify from "../../middlewares/authVerify";

const deskRoutes = Router();
deskRoutes.post("/", authVerify(["user"]), deskControllers.addToDesk);

export default deskRoutes;