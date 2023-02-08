import mongoose from "../connection";
import * as users from "./users.seed";
import * as students from "./students.seed";

mongoose.connection.on("connected", async () => {
  const db = mongoose.connection.db;

  /** Drop all collections */
  const collections = await db.listCollections().toArray();
  for (const collection of collections) {
    await db.dropCollection(collection.name);
  }

  /** Seeding database */
  await users.seed();
  await students.seed();

  mongoose.connection.close();
});
