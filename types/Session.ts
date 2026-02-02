export type Session = {
  _id: string;
  role: "SELLER" | "CLIENT" | "ADMIN";
  emailStatus: "UNVERIFIED" | "VERIFIED";
  identityStatus: "UNVERIFIED" | "VERIFIED" | "PENDING";
};
