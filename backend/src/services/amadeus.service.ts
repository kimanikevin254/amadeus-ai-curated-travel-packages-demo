import { amadeus } from "../config/amadeus";
import { Activity, CitySearch, FlightOffer, HotelOffer, SearchParams } from "../types";
import { logger } from "../utils/logger";

export class AmadeusService {
    async searchCities(keyword: string): Promise<CitySearch[]> {
        try {
            const response = await amadeus.referenceData.locations.cities.get({
                keyword,
                max: 10,
            });

            return response.data || [];
        } catch (error) {
            logger.error('City search failed', error);
            throw new Error('City search failed');
        }
    }
}

export const amadeusService = new AmadeusService();