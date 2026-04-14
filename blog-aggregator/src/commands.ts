export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

import { readConfig, setUser } from "./config";

export const handlerLogin: CommandHandler = (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("Username is required");
  }

  const username = args[0];

  const cfg = readConfig(); // always read fresh config
  setUser(cfg, username);   // update only current_user_name

  console.log(`User set to ${username}`);
};
