import express, {Request,Response,NextFunction} from 'express';
import { validationResult } from 'express-validator';
import { Volunteer, User, DangerZone  } from '../models';


export const getAllApplicants = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
    try {
        // Fetch all volunteer applicants and populate the userId field with name & email
        const applicants = await Volunteer.find().populate("userId", "name lastname phone");
    
        // Return the list of applicants
        return res.status(200).json({ data: applicants, token });
      } catch (error) {
        console.error("Error fetching applicants:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch applicants." , token});
      }
    
}


export const updateApplicationStatus = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
    try {
      const { applicationId } = req.params; // ID of the volunteer application
      const { status } = req.body; // New status ('accepted' or 'rejected')
  
      // Validate status input
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status. Allowed values: 'accepted' or 'rejected'.", token });
      }
  
      // Find and update the application
      const updatedApplication = await Volunteer.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true } // Return the updated document
      );
  
      // If application not found
      if (!updatedApplication) {
        return res.status(404).json({ success: false, message: "Application not found.", token });
      }
  
      return res.status(200).json({ success: true, message: `Application ${status} successfully.`, data: updatedApplication, token });
    } catch (error) {
      console.error("Error updating application status:", error);
      return res.status(500).json({ success: false, message: "Failed to update application status.", token });
    }
  };


  export const getAllUsers = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
    try {
      // Fetch all users from the database
      const users = await User.find();
  
      // Return the list of users
      return res.status(200).json({ data: users, token });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch users.", token });
    }
  };



  export const setDangerZone = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
  
    try {
      const { lat, lng, radius } = req.body;
  
      if (lat == null || lng == null || radius == null) {
        return res.status(400).json({ success: false, message: "lat, lng, and radius are required.", token });
      }
  
      const dangerZone = new DangerZone({ lat, lng, radius });
      await dangerZone.save();
  
      return res.status(201).json({ success: true, message: "Danger zone created.", data: dangerZone, token });
    } catch (error) {
      console.error("Error setting danger zone:", error);
      return res.status(500).json({ success: false, message: "Failed to create danger zone.", token });
    }
  };

  export const getAllDangerZones = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
  
    try {
      const zones = await DangerZone.find();
      return res.status(200).json({ success: true, data: zones, token });
    } catch (error) {
      console.error("Error fetching danger zones:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch danger zones.", token });
    }
  };


  export const deleteDangerZoneByCoordinates = async (req: Request, res: Response) => {
    const userId = req.userId;
    const token = req.nat;
  
    try {
      const { lat, lng } = req.body;
  
      if (lat == null || lng == null) {
        return res.status(400).json({ success: false, message: "lat and lng are required.", token });
      }
  
      const deletedZone = await DangerZone.findOneAndDelete({ lat, lng });
  
      if (!deletedZone) {
        return res.status(404).json({ success: false, message: "Danger zone not found with given coordinates.", token });
      }
  
      return res.status(200).json({ success: true, message: "Danger zone deleted successfully.", data: deletedZone, token });
    } catch (error) {
      console.error("Error deleting danger zone by coordinates:", error);
      return res.status(500).json({ success: false, message: "Failed to delete danger zone.", token });
    }
  };


  export const getUserConnectionsByAdmin = async (req: Request, res: Response) => {
    const token = req.nat;
    const { userId } = req.params; // user ID passed by admin
  
    try {
      // Find the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found', token });
      }
  
      // Filter connections based on their status
      const acceptedConnections = user.connections.filter(c => c.status === 'accepted');
      const pendingConnections = user.connections.filter(c => c.status === 'pending');
  
      return res.status(200).json({
        accepted: acceptedConnections,
        pending: pendingConnections,
        token
      });
    } catch (err) {
      console.error('Error fetching connections by admin:', err);
      return res.status(500).json({ msg: 'Server error', token });
    }
  };