import dotenv from "dotenv";

dotenv.config();

export const config2 = {
  dbURL: process.env.DB_URL ?? "",
  platform: process.env.PLATFORM ?? "prod",
};



type APIConfig = {
  fileServerHits: number;
};

export let config: APIConfig = {
  fileServerHits: 0
};
