import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { Activity, FlightOffer, HotelOffer, SearchParams } from '../types';

export class PackagesController {
    async createPackage(req: Request, res: Response): Promise<{
        success: boolean;
        data: {
            flights: FlightOffer[];
            hotels: HotelOffer[];
            activities: Activity[];
            aiRecommendation: string;
        }
    } | void> {
        
    }
}

export const packagesController = new PackagesController();