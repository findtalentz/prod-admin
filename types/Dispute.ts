export type Dispute = {
  _id: string;
  title: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  job: {
    _id: string;
    title: string;
    description: string;
  };
  type: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  evidence: string;
  description: string;
  createdAt: string;
};
