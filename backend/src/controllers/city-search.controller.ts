import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { amadeusService } from '../services/amadeus.service';

export class CitySearchController {
    async searchCities(req: Request, res: Response): Promise<any> {
        try {
            const { keyword } = req.query;

            if (!keyword || typeof keyword !== 'string') {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Missing or invalid required field: keyword',
                    }
                });
                return;
            }

            // Call Amadeus service to search cities
            const cities = await amadeusService.searchCities(keyword);

            res.status(200).json({
                success: true,
                data: cities,
            });
        } catch (error) {
            logger.error('City search failed', error);
            res.status(500).json({
                error: 'City search failed',
                message: 'City search failed',
            });
        }
    }
}

export const citySearchController = new CitySearchController();