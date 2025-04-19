import express, { Application } from "express";
import bodyParser from "body-parser";
import { AuthRoute, SocialRoute, VolunteerRoute, GoogleRoute, NewsRoute, UserRoute } from "../routes";
import { ChatRoute } from "../routes/ChatRoute";
import { User } from "../models";




export default async(app: Application) => {

    const cors = require("cors");
    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    app.use('/auth', AuthRoute);
    app.use('/user/social', SocialRoute);
    app.use('/user/volunteer', VolunteerRoute)
    app.use('/user/geoloc', GoogleRoute)
    app.use('/user/assistant', ChatRoute)
    app.use('/user/news', NewsRoute)
    app.use('/user/profile', UserRoute)
    return app;

}



