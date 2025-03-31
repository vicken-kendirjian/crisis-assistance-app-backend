import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, Volunteer } from '../models';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../config';
import { generateAccessToken } from '../utility';
import { UserPayload, VolunteerInput } from '../dto';


export const ApplyAsVolunteer = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.nat
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), token });
      }
    const { service, title, description, contactDetails } = <VolunteerInput>req.body;
    const userId = req.userId;
    try{
        // const user = await User.findById(userId)

        const alreadyApplied = await Volunteer.findOne({userId})
        if(alreadyApplied){
            return res.status(500).json({msg: "You cannot apply more than once", token})
        }

        const volunteer = new Volunteer({
            userId,
            service,
            title,
            description,
            contactDetails
        })

        await volunteer.save()

        return res.status(200).json({msg: 'Application has been submitted successfully', token})

    }catch(err) {
        return res.status(500).json({msg: 'Server error', token});
    }

    

}