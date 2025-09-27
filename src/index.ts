import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import { sequelize } from "./config/sequelize";
import * as qs from 'querystring';

import healthRoutes from './modules/health/health.routes';
import neuralNetworkRoutes from './modules/neural-network/neural-network.routes';
import transactionRoutes from './modules/transaction/transaction.routes';
import masterdataRoutes from './modules/masterdata/masterdata.routes';


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
      const ct = String(req.headers['content-type'] || '').toLowerCase();

      // 1) Si viene como Buffer, conviértelo a string
      if (Buffer.isBuffer(req.body)) {
        const raw = req.body.toString('utf8');

        if (ct.includes('application/json')) {
          try { req.body = JSON.parse(raw); } catch { req.body = {}; }
        } else if (ct.includes('application/x-www-form-urlencoded')) {
          req.body = qs.parse(raw);
        } else {
          // fallback: intenta JSON y si no, deja string
          try { req.body = JSON.parse(raw); } catch { req.body = raw; }
        }
      }

      // 2) Si viene como string plano (algunas pasarelas lo hacen)
      else if (typeof req.body === 'string') {
        // intenta JSON; si no, intenta urlencoded; si no, deja string
        try { req.body = JSON.parse(req.body); }
        catch {
          if (ct.includes('application/x-www-form-urlencoded')) {
            req.body = qs.parse(req.body);
          }
        }
      }

      // 3) A veces llega como { body: 'json-string' } anidado
      if (req.body && typeof (req.body as any).body === 'string') {
        const inner = (req.body as any).body;
        try { (req.body as any).body = JSON.parse(inner); } catch { /* ignore */ }
      }

      next();
    });

  }

  private routes() {
    this.app.use('/', masterdataRoutes);
    this.app.use(`/health`, healthRoutes);
    this.app.use(`/neural-network`, neuralNetworkRoutes);
    this.app.use('/transaction', transactionRoutes);
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
