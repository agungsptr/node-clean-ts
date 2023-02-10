import { Router } from "express";
import * as students from "../../controllers/students";

const router = Router();
const baseUrl = "/student";

router.get(`${baseUrl}s`, students.findAll);
router.get(`${baseUrl}/:id`, students.findOne);
router.post(`${baseUrl}`, students.create);
router.patch(`${baseUrl}/:id`, students.update);
router.delete(`${baseUrl}/:id`, students.remove);

export default router;
