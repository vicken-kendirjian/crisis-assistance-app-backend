import express, {Request,Response,NextFunction} from 'express';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '../config';
import { DangerZone } from '../models/DangerZone';


export const getHospitals = async (req: Request, res: Response) => {

    const token = req.nat
    const lat = req.query.lat as string;
    const lng = req.query.lng as string;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=hospital-hopital&key=${GOOGLE_MAPS_API_KEY}`
        );

        //now I need to see if the response is all good and if so send it to front end
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch hospital data from Google Maps API' });
        }
      
        const data = await response.json();
        return res.status(200).json({ hospitals: data.results, token });

    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return res.status(500).json({ error: 'Internal server error', token });
    }
    
}


export const getShelters = async (req: Request, res: Response) => {

    const token = req.nat
    const lat = req.query.lat as string;
    const lng = req.query.lng as string;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&keyword=Beirut+Shelter&key=${GOOGLE_MAPS_API_KEY}`
        );

        //now I need to see if the response is all good and if so send it to front end
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch shelters data from Google Maps API' });
        }
      
        const data = await response.json();
        return res.status(200).json({ shelters: data.results, token });

    } catch (error) {
        console.error('Error fetching shelters:', error);
        return res.status(500).json({ error: 'Internal server error', token });
    }
    
}


export const getFoodOrgs = async (req: Request, res: Response) => {

    const token = req.nat
    const lat = req.query.lat as string;
    const lng = req.query.lng as string;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&keyword=free+food+charity&key=${GOOGLE_MAPS_API_KEY}`
        );

        //now I need to see if the response is all good and if so send it to front end
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch food orgs data from Google Maps API', token });
        }
      
        const data = await response.json();
        return res.status(200).json({ foodOrgs: data.results, token });

    } catch (error) {
        console.error('Error fetching food orgs:', error);
        return res.status(500).json({ error: 'Internal server error',token });
    }
    
}


export const getDangerZones = async (req: Request, res: Response) => {
    const token = req.nat
    try {
        const dangerZones = await DangerZone.find();
        return res.status(200).json({ dangerZones, token });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error', token });
      }    
}