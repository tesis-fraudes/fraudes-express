import "dotenv/config";
import express, { Application } from "express";
import serverless from "serverless-http";
import Server from "./src/index";

const app: Application = express();
const server: Server = new Server(app);

// 🟢 MODO LOCAL: levanta HTTP si te lo piden por env
const runLocal =
  process.env.RUN_LOCAL === "true" ||
  process.env.IS_LOCAL === "true" ||
  process.env.NODE_ENV === "local";

if (runLocal) {
  server.listen(); // ← arranca express en PORT (3000 por tu Server)
}

module.exports.handler = serverless(app);
