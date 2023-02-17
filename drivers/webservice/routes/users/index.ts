import { Router } from "express";
import users from "../../controllers/users";
import * as middlewares from "../../middlewares";

const router = Router();
const baseUrl = "/user";

router.get(`${baseUrl}s`, middlewares.auth, users.findAll);
router.get(`${baseUrl}/:id`, middlewares.auth, users.findOne);
router.post(`${baseUrl}`, middlewares.auth, users.create);
router.patch(`${baseUrl}/:id`, middlewares.auth, users.update);
router.delete(`${baseUrl}/:id`, middlewares.auth, users.remove);

export default router;
