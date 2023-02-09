// const students = require("./students");
// const auth = require("./auth");

import { Router } from "express";
import users from "./users";

const router = Router();

// router.use(auth);
router.use(users);
// router.use(students);

export default router;
