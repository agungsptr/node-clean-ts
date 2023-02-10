import { Router } from "express";
import auth from "./auth";
import users from "./users";
import students from "./students";

const router = Router();

router.use(auth);
router.use(users);
router.use(students);

export default router;
