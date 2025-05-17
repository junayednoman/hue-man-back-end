import { Router } from "express";
import { printControllers } from "./print.controller";
import authVerify from "../../middlewares/authVerify";

const printRouters = Router();

printRouters.get("/", authVerify(["user"]),printControllers.getPrints)
printRouters.patch("/:id",authVerify(["user"]), printControllers.increaseCount)

export default printRouters;