import { Request, Response } from 'express';
import { packagingService } from '../services/packaging.service';
import { logger } from '../utils/logger';
import { Activity, FlightOffer, HotelOffer, SearchParams } from '../types/travel.types';

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
        try {
            // Validate required fields
            const { origin, destination, departureDate, adults, travelStyle } = req.body;

            if (!origin || !destination.iataCode || !destination.latitude || !destination.longitude || !departureDate || !adults || !travelStyle ) {
                    res.status(400).json({
                        success: false,
                        error: {
                            message: 'Missing required fields: origin, destination.iatacode, destination.latitude, destination.longitude, departureDate, adults, travelStyle',
                        }
                    });
                return;
            }

            // Build search params
            const searchParams: SearchParams = {
                origin,
                destination,
                departureDate,
                adults,
                travelStyle
            };

            if (req.body.returnDate) {
                searchParams.returnDate = req.body.returnDate;
            }
            if (req.body.budget) {
                searchParams.budget = req.body.budget;
            }

            // Call service to create package
            const travelPackage = await packagingService.createTravelPackage(searchParams);
            
            res.status(200).json({
                success: true,
                data: travelPackage,
            });

        } catch (error) {
            logger.error('Package creation failed', error);
            
            res.status(500).json({
                error: 'Failed to create travel package',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export const packagesController = new PackagesController();