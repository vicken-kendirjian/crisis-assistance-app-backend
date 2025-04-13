import express, {Request,Response,NextFunction} from 'express';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY, NEWS_API_KEY } from '../config';



export const getNews = async (req: Request, res: Response) => {

    const token = req.nat

    
    try {
        const response = await fetch(
            `https://content.guardianapis.com/search?q=lebanon&api-key=${NEWS_API_KEY}&order-by=newest&page-size=30`
        );

        //now I need to see if the response is all good and if so send it to front end
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch news' });
        }
      
        const data = await response.json();
        return res.status(200).json({ data, token });

    } catch (error) {
        console.error('Error fetching news:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
}