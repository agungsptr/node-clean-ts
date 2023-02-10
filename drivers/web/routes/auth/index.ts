import { Router } from "express";
import * as auth from "../../controllers/auth";
import * as middlewares from "../../middlewares";

const router = Router();
const baseUrl = "/auth";

router.post(`${baseUrl}/login`, auth.login);
router.post(`${baseUrl}/logout`, middlewares.auth, auth.logout);

export default router;
