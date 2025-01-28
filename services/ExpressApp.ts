import express, { Application } from "express";
import bodyParser from "body-parser";
import { AuthRoute, SocialRoute, VolunteerRoute } from "../routes";



export default async(app: Application) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    app.use('/auth', AuthRoute);
    app.use('/user/social', SocialRoute);
    app.use('/user/volunteer', VolunteerRoute)
    return app;

}



