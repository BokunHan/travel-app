import { db } from "../../database/drizzle";
import { trips, users } from "../../database/schema";
import { parseTripData } from "./utils";
import { eq } from "drizzle-orm";

export interface Document {
  [key: string]: any;
}

type FilterByDate = (
  items: Document[],
  key: string,
  start: string,
  end?: string,
) => number;

export const getUsersAndTripsStats = async (): Promise<DashboardStats> => {
  try {
    const d = new Date();
    const startCurrent = new Date(
      d.getFullYear(),
      d.getMonth(),
      1,
    ).toISOString();
    const startPrev = new Date(
      d.getFullYear(),
      d.getMonth() - 1,
      1,
    ).toISOString();
    const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();

    const [allUsers, allTrips] = await Promise.all([
      db.select().from(users),
      db.select().from(trips),
    ]);

    const filterByDate: FilterByDate = (items, key, start, end) =>
      items.filter((item) => item[key] >= start && (!end || item[key] <= end))
        .length;

    const filterUsersByRole = (role: string) => {
      return allUsers.filter((u) => u.status === role);
    };

    const allUserRole = filterUsersByRole("user");

    return {
      totalUsers: allUsers.length,
      usersJoined: {
        currentMonth: filterByDate(
          allUsers,
          "joinedAt",
          startCurrent,
          undefined,
        ),
        lastMonth: filterByDate(allUsers, "joinedAt", startPrev, endPrev),
      },
      userRole: {
        total: allUserRole.length,
        currentMonth: filterByDate(
          allUserRole,
          "joinedAt",
          startCurrent,
          undefined,
        ),
        lastMonth: filterByDate(allUserRole, "joinedAt", startPrev, endPrev),
      },
      totalTrips: allTrips.length,
      tripsCreated: {
        currentMonth: filterByDate(
          allTrips,
          "created_at",
          startCurrent,
          undefined,
        ),
        lastMonth: filterByDate(allTrips, "created_at", startPrev, endPrev),
      },
    };
  } catch (error) {
    console.error("Error getting users and trips stats", error);
    return {} as DashboardStats;
  }
};

export const getUserGrowthPerDay = async () => {
  const allUsers = (await db.select().from(users)) as Document[];
  const userGrowth = allUsers.reduce(
    (acc: { [key: string]: number }, user: Document) => {
      const date = new Date(user.joinedAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(userGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsCreatedPerDay = async () => {
  const allTrips = (await db.select().from(trips)) as Document[];
  const tripGrowth = allTrips.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      const date = new Date(trip.created_at);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(tripGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsByTravelStyle = async () => {
  const allTrips = (await db.select().from(trips)) as Document[];
  const travelStyleCounts = allTrips.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      const tripDetail = parseTripData(trip.tripDetail);

      if (tripDetail && tripDetail.travelStyle) {
        const travelStyle = tripDetail.travelStyle;
        acc[travelStyle] = (acc[travelStyle] || 0) + 1;
      }

      return acc;
    },
    {},
  );

  return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
    count: Number(count),
    travelStyle,
  }));
};

export const getTripCountByUserId = async (id: string) => {
  return db.$count(trips, eq(trips.userId, id));
};
