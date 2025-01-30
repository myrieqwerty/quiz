import { Hono } from "hono";
import { prisma } from "../index.js";
import { compare, hash } from "bcrypt";

const user = new Hono();

user.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await prisma.user.findFirst({ where: { id: id } });
  return c.json({ user: user });
});

user.post("registration", async (c) => {
  //получить данные из фронта
  const { name, email, password, number } = await c.req.parseBody();

  const userExist = await prisma.user.findFirst({
    where: { email: String(email) },
  });

  if (userExist) {
    return c.json({ message: "пользователь уже существует" });
  }
  //хеширование пароль

  const hashPassword = await hash(String(password), 10);

  //сохранение в БД

  const newUser = await prisma.user.create({
    data: {
      name: name,
      password: hashPassword,
      email: email,
      number: number,
    },
  });
  //отправить сообщение об успешной регистрации

  return c.json({ user: newUser });
});

user.post("login", async (c) => {
  const { name, password } = await c.req.parseBody();
  const foundUser = await prisma.user.findFirst({
    where: { name: String(name) },
  });

  if (!foundUser) {
    return c.json({ message: "not found" });
  }
  const passwordMatched = compare(String(password), foundUser.password);

  if (!passwordMatched) {
    return c.json({ message: "неверный пароль" });
  }
  //генерация токена и возвращение в фронт
  return c.json({ user: foundUser });
});

export default user;
