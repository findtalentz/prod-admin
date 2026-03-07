export type Job = {
  _id: string;
  title: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  seller?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    _id: string;
    name: string;
  };
  status: "IN_PROGRESS" | "OPEN" | "COMPLETED" | "CANCELLED";
  budgetAmount: number;
  description: string;
  location: string;
  createdAt: string;
};
