import dotenv from "dotenv";
dotenv.config();
export const config2 = {
    dbURL: process.env.DB_URL ?? "",
    platform: process.env.PLATFORM ?? "prod",
};
export let config = {
    fileServerHits: 0
};
