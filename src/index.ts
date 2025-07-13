import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
// import ClientRoutes from "./routes/client.routes";
// import HealthRoutes from "./routes/health.routes";
// import sequelize from "./database/config";
// import WinnerRoutes from "./routes/winner.routes";
// import { API_PREFIX } from "./constants/global.constant";
// import EventRoutes from "./routes/event.routes";

import healthRoutes from './modules/health/health.routes';
import neuralNetworkRoutes from './modules/neural-network/neural-network.routes';

import { AppDataSource } from './config/ormconfig';

export default class Server {
  private app: Application;
  private port: string | undefined;

  constructor(app: Application) {
    this.port = "3000";
    this.app = app;

    AppDataSource.initialize()
      .then(() => {
        console.log('🟢 Database connected');
        console.log('✅ Entidades cargadas:', AppDataSource.entityMetadatas.map(e => e.name));
      })
      .catch((err) => console.error('🔴 Database error:', err));

    console.log(
      '✅ Entidades cargadas:',
      AppDataSource.entityMetadatas.map(e => e.name)
    );

    this.middlewares();

    this.routes();
  }

  // async dbConnection() {
  //   sequelize
  //     .authenticate()
  //     .then(() => console.log("Database connected!"))
  //     .catch((err) => console.error("Error: ", err));
  // }

  private middlewares() {
    const corsOptions: CorsOptions = {
      origin: "*",
    };

    this.app.use(cors(corsOptions));

    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes() {
    this.app.use(`/health`, healthRoutes);
    this.app.use(`/neural-network`, neuralNetworkRoutes);
    //this.app.use(`/${API_PREFIX}/v1/winners`, new WinnerRoutes().router);
    //this.app.use(`/${API_PREFIX}/v1/events`, new EventRoutes().router);
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
