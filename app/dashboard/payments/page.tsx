import PaymentMethodsRequest from "@/components/dashboard/payments/payment-methods-request";
import PaymentRequestTable from "@/components/dashboard/payments/payment-request-table";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { PaymentMethod } from "@/types/PaymentMethod";
import { PaymentRequest } from "@/types/PaymentRequest";

export default async function Payments() {
  const { data: paymentMethods } = await apiClient.get<
    APIResponse<PaymentMethod[]>
  >("payment-methods/all");
  const { data: paymentRequests } = await apiClient.get<
    APIResponse<PaymentRequest[]>
  >("/withdraws");
  return (
    <div className="grid grid-cols-1 gap-10">
      <div className="space-y-6 border rounded-2xl p-4">
        <h2 className="text-2xl font-semibold">Payment Requests</h2>
        <PaymentRequestTable paymentRequests={paymentRequests.data} />
      </div>
      <div className="space-y-6 border rounded-2xl p-4">
        <h2 className="text-2xl font-semibold">Payment Methods</h2>
        <PaymentMethodsRequest paymentMethods={paymentMethods.data} />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
