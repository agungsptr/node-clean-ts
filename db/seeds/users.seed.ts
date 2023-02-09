import { hashPassword } from "../../commons/utils";
import UsersModel from "../models/users.model";

/** Seeder data */
async function seedDatabase(): Promise<void> {
  const data = [
    {
      firstName: "agung",
      lastName: "saputra",
      username: "agungsptr",
      password: hashPassword("24434"),
    },
  ];

  await UsersModel.insertMany(data);
  console.log("User has beed seeded");
}

export { seedDatabase as seed };
