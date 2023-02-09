// const { Router } = require("express");
// const users = require("../../controllers/users");
// const middleware = require("../../middlewares");

import { Router } from "express";
import * as users from "../../controllers/users"

const router = Router();
const baseUrl = "/user";

// router.get(`${baseUrl}s`, middleware.auth, users.findAll);
// router.get(`${baseUrl}/:id`, middleware.auth, users.findOne);
router.post(`${baseUrl}`, users.create);
// router.patch(`${baseUrl}/:id`, middleware.auth, users.update);
// router.delete(`${baseUrl}/:id`, middleware.auth, users.remove);

export default router;
