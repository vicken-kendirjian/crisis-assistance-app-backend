import express from "express";
import dotenv from 'dotenv';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import RedisConnection from './services/Redis';
import { setupSocketServer } from "./services/Socket";
import http from "http"


//To bypass Twilio downtime
import { User } from "./models";
import { GeneratePassword, GenerateSalt, validatePassword } from './utility'


dotenv.config();

const startServer = async() => {

    const app = express();
    await dbConnection();
    await RedisConnection();
    await App(app);

    const server = http.createServer(app);
    setupSocketServer(server);

    // Bypassing user creation. ============================================
    // const password = "v"
    // const salt = await GenerateSalt();
    // const hashedPassword = await GeneratePassword(password, salt);
    // const user = new User({
    //       name: "Vicken",
    //       lastname:"Kendirjian",
    //       phone:"+96176696566",
    //       password: hashedPassword,
    //       salt,
    //       bloodType: "O+",
    //       location: { lat: null, lng: null },
    //       verified: true, // Mark the user as verified
    //     });
    
    //     await user.save();
    //=====================================================================
    app.listen(5000, () => {
        console.log("Listening on port 5000");
    });

    
}

startServer();