import { Router } from "express";
import { createCategory, deleteCategory, findByIdCategory, getAllCategory, updateCategory } from "../controllers";

const routerCategory: Router = Router();

routerCategory.delete("/:id", deleteCategory);
routerCategory.put("/:id", updateCategory);
routerCategory.post("/", createCategory);
routerCategory.get("/:id", findByIdCategory);
routerCategory.get("/", getAllCategory);

export default routerCategory;