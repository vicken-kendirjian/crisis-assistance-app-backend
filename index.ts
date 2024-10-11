import express from "express";
import dotenv from 'dotenv';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import RedisConnection from './services/Redis';

dotenv.config();

const startServer = async() => {
    const app = express();
    await dbConnection();
    await RedisConnection();
    await App(app);
    
    app.listen(8000, () => {
        console.log("Listening on port 8000");
    });
}

startServer();