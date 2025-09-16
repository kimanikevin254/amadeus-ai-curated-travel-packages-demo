import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { Activity, FlightOffer, HotelOffer, SearchParams } from '../types';
import { amadeusService } from '../services/amadeus.service';
import { openAIService } from '../services/openai.service';

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

            const [flights, hotels, activities] = await Promise.all([
                amadeusService.searchFlights(searchParams),
                amadeusService.searchHotels(
                    searchParams.destination.iataCode,
                    searchParams.departureDate,
                    searchParams.returnDate
                ),
                amadeusService.searchActivities(
                    searchParams.destination.latitude,
                    searchParams.destination.longitude
                )
            ]);
    
            // Generate AI recommendation based on available options
            const aiRecommendation = await openAIService.generateTravelRecommendation(
                searchParams,
                { flights, hotels, activities }
            )
    
            res.status(200).json({
                success: true,
                data: { flights, hotels, activities, aiRecommendation },
            });
    
        } catch (error) {
            logger.error('Package creation failed', error);
    
            res.status(500).json({
                error: 'Failed to create travel package',
                message: 'Failed to create travel package',
            });
        }
    }
}

export const packagesController = new PackagesController();