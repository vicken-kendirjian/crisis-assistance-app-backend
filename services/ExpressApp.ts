import express, { Application } from "express";
import bodyParser from "body-parser";
import { AuthRoute } from "../routes";



export default async(app: Application) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));


    app.use('/auth', AuthRoute);
    return app;

}



