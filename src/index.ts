import { serve } from "@hono/node-server";
import { Hono } from "hono";
import quiz from "./routes/quiz.js";
import { PrismaClient } from "@prisma/client";
import user from "./routes/user.js";

const app = new Hono();
export const prisma = new PrismaClient();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/quiz", quiz);
app.route("/user", user);
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
