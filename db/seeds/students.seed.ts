import Students from "../models/students.model";
import Users from "../models/users.model";

/** Seeder data */
async function seedDatabase(): Promise<void> {
  const user = await Users.findOne({ username: { $eq: "agungsptr" } });
  if (!user) return;

  const data = [
    {
      name: "agung1",
      age: 17,
      grade: 3,
      perfect: true,
      createdBy: {
        userId: user.id,
        username: user.username,
      },
    },
    {
      name: "agung2",
      age: 9,
      grade: 4,
      createdBy: {
        userId: user.id,
        username: user.username,
      },
    },
    {
      name: "agung3",
      age: 16,
      grade: 5,
      createdBy: {
        userId: user.id,
        username: user.username,
      },
    },
  ];

  await Students.insertMany(data);
  console.log("Student has beed seeded");
}

export { seedDatabase as seed };
