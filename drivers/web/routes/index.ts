// const { Router } = require("express");
// const students = require("./students");
// const users = require("./users");
// const auth = require("./auth");

import { Router } from "express";
import users from "./users";

const router = Router();

// router.use(auth);
router.use(users);
// router.use(students);

export default router;
