import {
  pgTable,
  text,
  varchar,
  date,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const STATUS_ENUM = pgEnum("status", ["user", "admin"]);

export const users = pgTable("users", {
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  accountId: varchar("accountId", { length: 1000 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }),
  joinedAt: date("joinedAt").notNull(),
  status: STATUS_ENUM("status").notNull().default("user"),
});

export const trips = pgTable("trips", {
  id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
  tripDetail: text("tripDetail").notNull(),
  imageUrls: text("imageUrls")
    .array()
    .default(sql`ARRAY[]::text[]`),
  created_at: date("created_at").notNull(),
  payment_link: text("payment_link"),
  userId: varchar("userId", { length: 1000 }),
});
