import { SearchParams } from "../types/travel.types";
import { logger } from "../utils/logger";
import { amadeusService } from "./amadeus.service";
import { openAIService } from "./openai.service";

export class PackagingService {
    async createTravelPackage(searchParams: SearchParams): Promise<any> {
        try {
            // Fetch flights, hotels, and activities concurrently
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

            return { flights, hotels, activities, aiRecommendation  };
        } catch (error) {
            logger.error('Failed to create travel package', error);
            throw new Error('Failed to create travel package');
        }
    }
}

export const packagingService = new PackagingService();