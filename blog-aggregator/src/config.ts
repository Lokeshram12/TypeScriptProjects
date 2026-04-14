import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

// ---------- Helpers ----------

function getConfigFilePath(): string {
    
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();

  // Convert camelCase → snake_case for saving
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  fs.writeFileSync(filePath, JSON.stringify(rawConfig, null, 2));
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config: not an object");
  }

  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: db_url must be a string");
  }

  if (
    rawConfig.current_user_name !== undefined &&
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("Invalid config: current_user_name must be a string");
  }

  // Convert snake_case → camelCase
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

// ---------- Exports ----------

export function readConfig(): Config {
  const filePath = getConfigFilePath();

  if (!fs.existsSync(filePath)) {
    // Return default config if file doesn't exist
    return {
      dbUrl: "postgres://example",
    };
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(fileContents);

  return validateConfig(parsed);
}

export function setUser(cfg: Config, userName: string): void {
  const updatedConfig: Config = {
    ...cfg,
    currentUserName: userName,
  };

  writeConfig(updatedConfig);
}