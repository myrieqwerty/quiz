import { Hono } from "hono";
import { prisma } from "../index.js";

const quiz = new Hono();

quiz.get("/", (c) => {
  return c.json({ hello: "quiz" });
});

quiz.get("/:id", async (c) => {
  const id = c.req.param("id");
  const quiz = await prisma.quiz.findFirst({
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
    where: {
      id: Number(id),
    },
  });

  return c.json({ quiz: quiz });
});

quiz.post("/create", async (c) => {
  const newQuiz = await prisma.quiz.create({
    data: {
      title: "sdsdds",
    },
  });

  await prisma.question.createManyAndReturn({
    data: [
      { title: "q1", quizId: newQuiz.id },
      { title: "q2", quizId: newQuiz.id },
    ],
  });

  return c.json({ quiz: newQuiz });
});

export default quiz;
