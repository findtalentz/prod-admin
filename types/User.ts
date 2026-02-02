export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phone: string;
  location: string;
  role: "SELLER" | "CLIENT" | "ADMIN";
  emailStatus: "UNVERIFIED" | "VERIFIED";
  identityStatus: "UNVERIFIED" | "VERIFIED" | "PENDING";
  totalEarning: number;
  totalSpend: number;
  balance: number;
};
