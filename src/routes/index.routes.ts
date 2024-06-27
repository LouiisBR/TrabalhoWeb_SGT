import { Request, Response, Router } from "express";
import routerUser from "./user.routes";
import routerCategory from "./category.routes";
import routerTask from "./task.routes";
import routerToken from "./token.routes";
import { validateToken } from "../controllers";

const dataIni = new Date();

const router: Router = Router();

router.get("/status", (req: Request, res: Response) => {
    const dataNow = new Date();
    res.json({ message: "status Ok", dataIni, dataNow}).status(200);
});


router.use("/token", routerToken)
router.use("/user", routerUser)
router.use("/category", validateToken, routerCategory)
router.use("/task", validateToken, routerTask)

router.use("*", (req: Request, res: Response) => {
    res.status(404).json({ message: "essa url não faz parte dessa API" });
});

export default router;