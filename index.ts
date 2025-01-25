import express from "express";
import dotenv from 'dotenv';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import RedisConnection from './services/Redis';
import { setupSocketServer } from "./services/Socket";
import http from "http"

dotenv.config();

const startServer = async() => {

    const app = express();
    await dbConnection();
    await RedisConnection();
    await App(app);

    const server = http.createServer(app);
    setupSocketServer(server);
    
    app.listen(5000, () => {
        console.log("Listening on port 5000");
    });
}

startServer();