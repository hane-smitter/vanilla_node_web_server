import chalk from "chalk";
import { client, DB } from "../../src/db/mongodb.js";
import seedDatabase from "./seedDatabase.mjs";

DB.on("connected", async function () {
  console.log(chalk.rgb(208, 60, 240)("DB is connected"));
  console.log(chalk.italic("Seeding DB..."));
  await seedDatabase();
  console.log(chalk.italic("Closing connection..."));
  client.close();
}).on("error", function () {
  console.error.bind(console, chalk.red("DB NOT CONNECTED! => "));
  if (client.close) {
    console.log(chalk.italic("Closing connection..."));
    client.close();
  }
});
