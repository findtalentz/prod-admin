export type ActivityItem = {
  _id: string;
  type: "user_registered" | "job_created" | "withdrawal_requested" | "dispute_opened";
  description: string;
  user: { firstName: string; lastName: string } | null;
  createdAt: string;
};
