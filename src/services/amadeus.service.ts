import { amadeus } from "../config/amadeus";
import { Activity, FlightOffer, HotelOffer, SearchParams } from "../types/travel.types";
import { logger } from "../utils/logger";

export class AmadeusService {
    async searchFlights(searchParams: SearchParams): Promise<FlightOffer[]> {
        try {
            const params = {
                originLocationCode: searchParams.origin,
                destinationLocationCode: searchParams.destination,
                departureDate: searchParams.departureDate,
                adults: searchParams.adults,
            };

            if (searchParams.returnDate) {
                Object.assign(params, { returnDate: searchParams.returnDate });
            }

            const response = await amadeus.shopping.flightOffersSearch.get({
                ...params,
                max: 5,
                currencyCode: 'USD'
            })

            return response.data.map((flight: FlightOffer) => ({
                id: flight.id,
                oneWay: !searchParams.returnDate,
                price: {
                    total: flight.price.total,
                    currency: flight.price.currency,
                },
                itineraries: flight.itineraries.map((itinerary) => ({
                    duration: itinerary.duration,
                    segments: itinerary.segments.map((segment) => ({
                        departure: {
                            iataCode: segment.departure.iataCode,
                            at: segment.departure.at,
                        },
                        arrival: {
                            iataCode: segment.arrival.iataCode,
                            at: segment.arrival.at,
                        },
                        carrierCode: segment.carrierCode,
                        aircraft: { code: segment.aircraft.code },
                        duration: segment.duration,
                    })),
                })),
            }));
        } catch (error) {
            logger.error('Flight search failed', error);
            throw new Error('Flight search failed');
        }
    }

    async searchHotels(destination: string, checkInDate: string, checkOutDate?: string): Promise<HotelOffer[]> {
        try {
            // First, get hotel IDs in the traveller's destination
            const hotelIds = await amadeus.referenceData.locations.hotels.byCity.get({
                cityCode: destination,
            });

            if (!hotelIds.data || hotelIds.data.length === 0) {
                return [];
            }

            // Get hotel IDs for the first 3 hotels
            const selectedHotelIds = hotelIds.data.slice(0, 3).map((hotel: any) => hotel.hotelId).join(',');

            // Now, search for hotel offers using the retrieved hotel IDs
            const response = await amadeus.shopping.hotelOffersSearch.get({
                hotelIds: selectedHotelIds,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
            });

            return response.data.map((hotelOffer: HotelOffer) => ({
                hotel: {
                    hotelId: hotelOffer.hotel.hotelId,
                    name: hotelOffer.hotel.name,
                },
                offers: hotelOffer.offers.map((offer) => ({
                    id: offer.id,
                    price: {
                        currency: offer.price.currency,
                        total: offer.price.total,
                    },
                    room: {
                        type: offer.room.type,
                        typeEstimated: offer.room.typeEstimated,
                        description: offer.room.description,
                    },
                })),
            }));
        } catch (error) {
            logger.error('Hotel search failed', error);
            throw new Error('Hotel search failed');
        }
    }

    async searchActivities(latitude: number, longitude: number): Promise<Activity[]> {
        try {
            const response = await amadeus.shopping.activities.get({
                latitude,
                longitude,
            });

            return response.data.map((activity: Activity) => ({
                id: activity.id,
                name: activity.name,
                shortDescription: activity.shortDescription,
                price: {
                    amount: activity.price.amount,
                    currencyCode: activity.price.currencyCode,
                },
                pictures: activity.pictures,
            }));
        } catch (error) {
            logger.error('Activity search failed', error);
            throw new Error('Activity search failed');
        }
    }
}

export const amadeusService = new AmadeusService();