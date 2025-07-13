import "dotenv/config";
import express, { Application } from "express";
import serverless from "serverless-http";
import Server from "./src/index";

const app: Application = express();
const server: Server = new Server(app);

// server.listen();

module.exports.handler = serverless(app);
