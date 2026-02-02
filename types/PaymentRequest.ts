import { PaymentMethod } from "./PaymentMethod";

export type PaymentRequest = {
  _id: string;
  amount: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  paymentMethod: PaymentMethod;
  paymentMethodType: "paypal" | "bank";
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: Date;
};
