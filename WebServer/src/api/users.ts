import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { users } from "../schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await db
      .insert(users)
      .values({ email })
      .returning();

    const user = result[0];

    return res.status(201).json({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
