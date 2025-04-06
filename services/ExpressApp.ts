import express, { Application } from "express";
import bodyParser from "body-parser";
import { AuthRoute, SocialRoute, VolunteerRoute, GoogleRoute } from "../routes";
import { ChatRoute } from "../routes/ChatRoute";



export default async(app: Application) => {

    const cors = require("cors");
    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    app.use('/auth', AuthRoute);
    app.use('/user/social', SocialRoute);
    app.use('/user/volunteer', VolunteerRoute)
    app.use('/user/geoloc/', GoogleRoute)
    app.use('/user/assistant', ChatRoute)
    return app;

}



