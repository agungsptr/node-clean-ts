import { Router } from "express";
import * as students from "../../controllers/students";
import * as middlewares from "../../middlewares";

const router = Router();
const baseUrl = "/student";

router.get(`${baseUrl}s`, middlewares.auth, students.findAll);
router.get(`${baseUrl}/:id`, middlewares.auth, students.findOne);
router.post(`${baseUrl}`, middlewares.auth, students.create);
router.patch(`${baseUrl}/:id`, middlewares.auth, students.update);
router.delete(`${baseUrl}/:id`, middlewares.auth, students.remove);

export default router;
