import Controller from "./controller";
import * as usersUC from "../../../use-cases/users";
import { User } from "../../../models/user";

const users = Controller<User>(usersUC);

export default { ...users };
