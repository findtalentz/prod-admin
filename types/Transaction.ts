export type Transaction = {
  _id: string;
  type: "deposit" | "checkout";
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  status: "pending" | "completed" | "failed";
  gatewayRef: string;
  paymentGateway?: "stripe" | "paypal";
  createdAt: string;
};
