import { Router } from "express";
import { createTask, deleteTask, findByIdTask, getAllTask, updateTask, validateToken } from "../controllers";

const routerTask: Router = Router();

routerTask.delete("/:id", deleteTask);
routerTask.put("/:id", updateTask);
routerTask.post("/", createTask);
routerTask.get("/:id", findByIdTask);
routerTask.get("/", getAllTask);

export default routerTask;