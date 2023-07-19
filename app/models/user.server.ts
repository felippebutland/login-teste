import type { Password, User } from "@prisma/client";
import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { generateCode } from "~/utils";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  console.log(email)
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string, cellphone: string, verified: boolean) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const token = generateCode(5)

  return prisma.user.create({
    data: {
      email,
      verified,
      cellphone,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      Tokens: {
        create: {
          value: token
        }
      }
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getToken(email: string, token: string) {
  const user = await prisma.user.findFirst({
    where: { email },
    include: {
      Tokens: true
    }
  });

  if(!user) {
    return null;
  }

  if(user.Tokens[0].value !== token) {
    return null
  }

  return json(
    {
      success: true,
      user
    },
    {
      status: 200
    }
  )
}
