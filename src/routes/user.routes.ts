import { Router } from "express";
import { createUser, updatePassUser } from "../controllers";

const routerUser: Router = Router();

routerUser.put("/:id/password", updatePassUser);
routerUser.post("/", createUser);

export default routerUser;