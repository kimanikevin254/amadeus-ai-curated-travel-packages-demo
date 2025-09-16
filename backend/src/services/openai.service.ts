import { openai, OPENAI_CONFIG } from "../config/openai";
import { FlightOffer, SearchParams } from "../types";
import { logger } from "../utils/logger";

export class OpenAIService {
    private getSystemPrompt(): string {
        return `You are an expert travel advisor with 20+ years of experience creating personalized travel packages. Your expertise includes:

- Deep knowledge of global destinations, cultures, and seasonal travel patterns
- Understanding of different travel styles and what makes each unique
- Ability to match traveler personalities with perfect experiences
- Expertise in optimizing value while respecting budget constraints
- Knowledge of practical travel logistics and insider tips

TRAVEL STYLE DEFINITIONS:
• LUXURY: Premium experiences, high-end accommodations, exclusive access, personalized service
• BUDGET: Value-focused, authentic local experiences, efficient spending, smart compromises  
• FAMILY: Kid-friendly activities, safety-first, educational experiences, convenient logistics
• ADVENTURE: Active experiences, outdoor activities, unique challenges, off-the-beaten-path
• BUSINESS: Efficiency-focused, premium comfort, reliable logistics, work-friendly amenities

YOUR TASK:
Create a compelling, personalized travel recommendation that feels like advice from a trusted friend who knows travel inside and out. Be enthusiastic but genuine, specific but not overwhelming.

RESPONSE FORMAT:
1. **Personal Welcome** (2-3 sentences tailored to their style)
2. **Flight Recommendation** (pick the best option with clear reasoning)
3. **Hotel Recommendation** (pick the best option with clear reasoning)
4. **Activity Recommendations** (pick 2-3 activities that fit their interests and style)
5. **Suggested Itinerary** (day-by-day outline)
6. **Budget Breakdown** (transparent cost analysis)
7. **Pro Tips** (2-3 insider tips for their destination)

GUIDELINES:
- Be specific about WHY each recommendation fits their profile
- Include practical details (timing, booking tips, what to expect)
- Balance must-do experiences with hidden gems
- Consider seasonality, local events, and cultural factors
- Keep the tone conversational and engaging
- Focus on experiences, not just logistics`;
    }

    async generateTravelRecommendation(
        userPreferences: SearchParams,
        availableOptions: {
            flights: FlightOffer[];
            hotels: any[];
            activities: any[];
        }
    ): Promise<string> {
        try {
            const userPrompt = `Create a personalized travel package for:
**Traveler Profile:**
- Destination: ${userPreferences.destination.iataCode}
- Travel Style: ${userPreferences.travelStyle}
- Interests: ${
                userPreferences.interests
                    ? userPreferences.interests.join(", ")
                    : "Not specified"
            }
- Budget: ${
                userPreferences.budget
                    ? `$${userPreferences.budget}`
                    : "Not specified"
            }
- Duration: ${
                userPreferences.returnDate
                    ? `${userPreferences.departureDate} to ${userPreferences.returnDate}`
                    : `Open`
            }
- Group Size: ${userPreferences.adults} adult(s)

**Available Options:**

**FLIGHTS:**
${availableOptions.flights
    ?.map(
        (flight) =>
            `• $${flight.price.total} - ${flight.itineraries[0]?.duration} - Carrier: ${flight.itineraries[0]?.segments[0]?.carrierCode}`
    )
    .join("\n")}

**HOTELS:**
${availableOptions.hotels
    ?.map(
        (hotel) =>
            `• ${hotel.hotel.name} (${hotel.hotel.rating || "N/A"}⭐) - from $${
                hotel.offers[0]?.price.total
            }`
    )
    .join("\n")}

**ACTIVITIES:**
${availableOptions.activities
    ?.slice(0, 8)
    ?.map(
        (activity) =>
            `• ${activity.name} - $${activity.price.amount} ${
                activity.rating ? `(${activity.rating}⭐)` : ""
            }`
    )
    .join("\n")}

Please provide specific recommendations from the available options and explain why each choice perfectly matches their ${
                userPreferences.travelStyle
            } travel style`;

            const completion = await openai.chat.completions.create({
                model: OPENAI_CONFIG.model,
                messages: [
                    { role: "system", content: this.getSystemPrompt() },
                    { role: "user", content: userPrompt },
                ],
                max_tokens: OPENAI_CONFIG.maxTokens,
                temperature: OPENAI_CONFIG.temperature,
            });

            return (
                completion.choices[0].message?.content ||
                "No recommendation generated."
            );
        } catch (error) {
            logger.error("Failed to generate AI recommendation", error);
            throw new Error("Failed to generate AI recommendation");
        }
    }
}

export const openAIService = new OpenAIService();