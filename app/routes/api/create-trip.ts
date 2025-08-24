import { type ActionFunctionArgs, data } from "react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "~/lib/utils";
import { db } from "../../../database/drizzle";
import { trips } from "../../../database/schema";

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    country,
    duration,
    travelStyle,
    interests,
    budget,
    groupType,
    userId,
  } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
    Budget: '${budget}'
    Interests: '${interests}'
    TravelStyle: '${travelStyle}'
    GroupType: '${groupType}'
    Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
    {
    "name": "A descriptive title for the trip",
    "description": "A brief description of the trip and its highlights not exceeding 100 words",
    "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
    "duration": ${duration},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "country": "${country}",
    "interests": "${interests}",
    "groupType": "${groupType}",
    "bestTimeToVisit": [
      '🌸 Season (from month to month): reason to visit',
      '☀️ Season (from month to month): reason to visit',
      '🍁 Season (from month to month): reason to visit',
      '❄️ Season (from month to month): reason to visit'
    ],
    "weatherInfo": [
      '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
      '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
    ],
    "location": {
      "city": "name of the city or region",
      "coordinates": [latitude, longitude],
      "openStreetMap": "link to open street map"
    },
    "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
      ]
    },
    ...
    ]
    }`;

    let trip = null;
    let retry = 0;
    const max_retries = 3;

    while (retry < max_retries) {
      const textResult = await genAI
        .getGenerativeModel({
          model: "gemini-2.5-flash",
        })
        .generateContent(prompt, {});

      if (!textResult || !textResult.response)
        console.error("Error generating content");

      trip = parseMarkdownToJson(textResult.response.text());
      if (trip) break;

      retry++;
    }

    if (retry >= max_retries) return null;

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashAccessKey}`,
    );

    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const result = await db
      .insert(trips)
      .values({
        tripDetail: JSON.stringify(trip),
        created_at: new Date().toISOString(),
        imageUrls,
        userId,
      })
      .returning({ id: trips.id });

    return data({ id: result[0].id });
  } catch (e) {
    console.error("Error generating travel plan", e);
  }
};
