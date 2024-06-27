import { Router } from "express";
import { createUser, getUserData, updatePassUser, validateToken } from "../controllers";
import { authBasic } from "../utils/basicAuth";

const routerUser: Router = Router();

routerUser.put("/:id/password", authBasic, updatePassUser);
routerUser.post("/", authBasic, createUser);
routerUser.get("/", validateToken, getUserData);

export default routerUser;