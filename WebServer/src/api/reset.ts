import type { Request, Response } from "express";
import { config2,config } from "../config.js";
import { db } from "../db/index.js";
import { users } from "../schema.js";

export async function handlerReset(_: Request, res: Response) {
  // Prevent production usage
  if (config2.platform !== "dev") {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Reset hit counter
  config.fileServerHits = 0;

  // Delete all users
  await db.delete(users);

  return res.status(200).json({
    message: "All users deleted and hits reset to 0",
  });
}
