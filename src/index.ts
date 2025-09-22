import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import { sequelize } from "./config/sequelize";

import healthRoutes from './modules/health/health.routes';
import neuralNetworkRoutes from './modules/neural-network/neural-network.routes';


export default class Server {
  private app: Application;
  private port: string | undefined;

  constructor(app: Application) {
    this.port = "3000";
    this.app = app;

    this.dbConnection();

    this.middlewares();

    this.routes();
  }

  async dbConnection() {
    
    try {
      await sequelize.authenticate();
      console.log('🟢 Database connected');
      await sequelize.sync(); // ⚠️ no uses esto en prod si no quieres que cree o altere tablas
    } catch (error) {
      console.error('🔴 Database error:', error);
    }

  }

  private middlewares() {
    const corsOptions: CorsOptions = {
      origin: "*",
    };

    this.app.use(cors(corsOptions));

    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: true }));

    // Normaliza body cuando API Gateway lo pasa como string
    this.app.use((req, _res, next) => {
      const ct = (req.headers['content-type'] || '').toString().toLowerCase();
      // si viene como JSON y el body es string, intenta parsear
      if (ct.includes('application/json') && typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body || '{}');
        } catch (e) {
          // si falla el parseo, lo dejamos como string
        }
      }
      next();
    });
  }

  private routes() {
    this.app.use(`/health`, healthRoutes);
    this.app.use(`/neural-network`, neuralNetworkRoutes);
  }

  listen() {
    this.app
      .listen(this.port, () => {
        console.log(`Server is running on port ${this.port}.`);
      })
      .on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.log("Error: address already in use");
        } else {
          console.log(err);
        }
      });
  }
}
