import { Router } from "express";
import { createToken, validateToken } from "../controllers";
import express from "express";
import { authBasic } from "../utils/basicAuth";

const routerToken: Router = Router();

routerToken.get("/", validateToken, (req, res) => {
    res.status(200).json({ userId:  req.query.userId });
});
routerToken.post("/", authBasic, express.urlencoded({ extended: true }), createToken);

export default routerToken;