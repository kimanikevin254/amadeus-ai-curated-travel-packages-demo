import { SearchParams } from "../types/travel.types";
import { logger } from "../utils/logger";
import { amadeusService } from "./amadeus.service";

export class PackagingService {
    async createTravelPackage(searchParams: SearchParams): Promise<any> {
        try {
            // Fetch flights, hotels, and activities concurrently
            const [flights, hotels, activities] = await Promise.all([
                amadeusService.searchFlights(searchParams),
                amadeusService.searchHotels(
                    searchParams.destination, 
                    searchParams.departureDate, 
                    searchParams.returnDate
                ),
                amadeusService.searchActivities(
                    searchParams.destinationLatitude, 
                    searchParams.destinationLongitude
                )
            ]);
            
            return { flights, hotels, activities  };
        } catch (error) {
            logger.error('Failed to create travel package', error);
            throw new Error('Failed to create travel package');
        }
    }
}

export const packagingService = new PackagingService();