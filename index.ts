import express from "express";
import dotenv from 'dotenv';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import RedisConnection from './services/Redis';
import { setupSocketServer } from "./services/Socket";
import http from "http"
import mongoose from "mongoose";


//To bypass Twilio downtime
import { User, Volunteer } from "./models";
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

    //Adding a new volunteer
    // const dummyUserId = new mongoose.Types.ObjectId("660fab0b1f2c67001cb86cf8");

    // const createTestVolunteer = async () => {
    //   try {
    //     const volunteer = new Volunteer({
    //       userId: dummyUserId,
    //       service: "medical",
    //       title: "General Practitioner",
    //       status: "accepted",
    //       description: "Doctor available for volunteer medical assistance.",
    //       contactDetails: "+96170111222"
    //     });
    
    //     const savedVolunteer = await volunteer.save();
    //     console.log("Test volunteer saved:", savedVolunteer);
    //   } catch (error) {
    //     console.error("Error saving test volunteer:", error);
    //   }
    // };
    
    // createTestVolunteer();
    app.listen(5000, () => {
        console.log("Listening on port 5000");
    });

    
}

startServer();