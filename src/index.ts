import express, { Application } from "express";
import { DataSource } from 'typeorm';
import { globSync } from 'glob';
import cors, { CorsOptions } from "cors";
import * as path from 'path';
// import ClientRoutes from "./routes/client.routes";
// import HealthRoutes from "./routes/health.routes";
// import sequelize from "./database/config";
// import WinnerRoutes from "./routes/winner.routes";
// import { API_PREFIX } from "./constants/global.constant";
// import EventRoutes from "./routes/event.routes";

import healthRoutes from './modules/health/health.routes';
import neuralNetworkRoutes from './modules/neural-network/neural-network.routes';
import NeuralNetwork from "./modules/neural-network/neural-network.entity";


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
    const entities = globSync(path.join(__dirname, '../modules/**/*.entity.js'));
    
    console.log('🧭 Cargando entidades desde:', entities);
    
    console.log(__dirname);

    const AppDataSource = new DataSource({
      type: 'postgres',
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
       //entities: [NeuralNetwork],
       entities: entities
    });
    
    

    AppDataSource.initialize()
      .then(() => {
        console.log('🟢 Database connected');
        console.log('✅ Entidades cargadas:', AppDataSource.entityMetadatas.map(e => e.name));
      })
      .catch((err) => console.error('🔴 Database error:', err));

  }

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
