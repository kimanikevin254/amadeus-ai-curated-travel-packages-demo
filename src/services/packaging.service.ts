import { SearchParams } from "../types/travel.types";
import { logger } from "../utils/logger";
import { amadeusService } from "./amadeus.service";

export class PackagingService {
    async createTravelPackage(searchParams: SearchParams): Promise<any> {
        try {
            // Fetch flights
            const flights = await amadeusService.searchFlights(searchParams);
            return { flights  };
        } catch (error) {
            logger.error('Failed to create travel package', error);
            throw new Error('Failed to create travel package');
        }
    }
}

export const packagingService = new PackagingService();