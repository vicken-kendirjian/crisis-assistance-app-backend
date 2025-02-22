import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { Volunteer } from '../models';


export const getAllApplicants = async (req: Request, res: Response) => {
    try {
        // Fetch all volunteer applicants and populate the userId field with name & email
        const applicants = await Volunteer.find().populate("userId", "name lastname phone");
    
        // Return the list of applicants
        return res.status(200).json({ data: applicants });
      } catch (error) {
        console.error("Error fetching applicants:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch applicants." });
      }
    
}


export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
      const { applicationId } = req.params; // ID of the volunteer application
      const { status } = req.body; // New status ('accepted' or 'rejected')
  
      // Validate status input
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status. Allowed values: 'accepted' or 'rejected'." });
      }
  
      // Find and update the application
      const updatedApplication = await Volunteer.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true } // Return the updated document
      );
  
      // If application not found
      if (!updatedApplication) {
        return res.status(404).json({ success: false, message: "Application not found." });
      }
  
      return res.status(200).json({ success: true, message: `Application ${status} successfully.`, data: updatedApplication });
    } catch (error) {
      console.error("Error updating application status:", error);
      return res.status(500).json({ success: false, message: "Failed to update application status." });
    }
  };