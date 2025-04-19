import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models';


export const getUser = async (req: Request, res: Response) => {

    const token = req.nat;
    const userId = req.userId;
    console.log(userId)
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({msg: "User not found", token})
        }
        return res.status(200).json({user, token})
    }catch(err){
        console.log(err);
        return res.status(500).json({msg: "An Error has occured while getting user", token})
    }
}