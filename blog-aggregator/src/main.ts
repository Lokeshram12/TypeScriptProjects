import { handlerLogin } from "./commands";
import { registerCommand, runCommand, CommandsRegistry } from "./registry";

function main() {
  const registry: CommandsRegistry = {};

  // Register commands
  registerCommand(registry, "login", handlerLogin);

  // Get CLI args
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Not enough arguments");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Unknown error");
    }
    process.exit(1);
  }
}

main();