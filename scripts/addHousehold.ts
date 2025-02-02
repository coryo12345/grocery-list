import { eq } from "drizzle-orm";
import readline from "node:readline";
import { getDb } from "~/db";
import { household } from "~/db/schema";
import { hashPassword } from "~/server/utils/auth";

// Will add a household
// or update password if it already exists

if (process.argv.length < 4) {
  console.error(
    "Usage: `bun run scripts/addHousehold <householdname> <password>`",
  );
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const [_1, _2, username, password] = process.argv;

const db = await getDb();

const existing = await db
  .select()
  .from(household)
  .where(eq(household.householdName, username.toLowerCase()));

if (!existing) {
  console.error("unable to query db...");
  process.exit(1);
}

if (existing.length > 0) {
  console.log("Household already exists.");
  rl.question("Would you like to update? (y/n)", (ans) => {
    if (ans.charAt(0).toLowerCase() === "y") {
      update();
      rl.close();
    } else {
      process.exit(1);
      rl.close();
    }
  });
} else {
  console.log(`Creating household ${username}`);
  create();
}

async function create() {
  const hashed = hashPassword(password);
  await db.insert(household).values({
    householdName: username.toLowerCase(),
    password: hashed,
  });
  process.exit(0);
}

async function update() {
  const hashed = hashPassword(password);
  await db
    .update(household)
    .set({ password: hashed })
    .where(eq(household.householdName, username.toLowerCase()));
  process.exit(0);
}
