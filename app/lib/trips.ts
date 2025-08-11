import { db } from "../../database/drizzle";
import { trips } from "../../database/schema";
import { desc, eq } from "drizzle-orm";

export const getAllTrips = async (limit: number, offset: number) => {
  const allTrips = await db
    .select()
    .from(trips)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(trips.created_at));

  if (allTrips.length === 0) {
    console.error("No trips found.");
    return { allTrips: [], total: 0 };
  }

  return {
    allTrips: allTrips,
    total: allTrips.length,
  };
};

export const getTripById = async (tripId: string) => {
  const trip = await db
    .select()
    .from(trips)
    .where(eq(trips.id, tripId))
    .limit(1);

  if (trip.length === 0) {
    console.error("Trip not found.");
    return null;
  }

  return trip.pop();
};
