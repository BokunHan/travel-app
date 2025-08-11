import { STATUS_ENUM } from "./database/schema";

interface User {
  name: string;
  email: string;
  accountId: string;
  imageUrl: string;
  joinedAt: Date;
  status: STATUS_ENUM;
}

interface Trip {
  tripDetail: string;
  imageUrls: string[];
  created_at: Date;
  payment_link: string;
  userId: string;
}
