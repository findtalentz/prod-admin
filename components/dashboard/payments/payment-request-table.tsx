"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { PaymentRequest } from "@/types/PaymentRequest";
import { AxiosError } from "axios";
import { Building, Calendar, CreditCard, DollarSign, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Props {
  paymentRequests: PaymentRequest[];
}

export default function PaymentRequestTable({ paymentRequests }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const getStatusVariant = (status: PaymentRequest["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: PaymentRequest["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "✅";
      case "PENDING":
        return "⏳";
      case "FAILED":
        return "❌";
      default:
        return "📝";
    }
  };

  const getMethodIcon = (methodType: string) => {
    switch (methodType) {
      case "bank":
        return <Building className="h-4 w-4" />;
      case "paypal":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (methodType: string) => {
    switch (methodType) {
      case "bank":
        return "Bank Transfer";
      case "paypal":
        return "PayPal";
      default:
        return "Payment";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const acceptWithdraw = async (
    sellerId: string,
    amount: number,
    requestId: string
  ) => {
    setLoadingId(requestId);
    try {
      const { data } = await apiClient.post<APIResponse<string>>(
        "/admin/accept/withdraw",
        {
          sellerId,
          amount,
          withdrawId: requestId,
        }
      );
      router.refresh();
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  if (paymentRequests.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No Payment Requests
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are no payment requests to display.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Amount</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Date</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentRequests.map((paymentRequest) => (
          <TableRow key={paymentRequest._id} className="hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-lg">
                    {formatAmount(paymentRequest.amount)}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {paymentRequest.user.firstName}{" "}
                    {paymentRequest.user.lastName}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getMethodIcon(paymentRequest.paymentMethodType)}
                  <span className="font-medium">
                    {getMethodLabel(paymentRequest.paymentMethodType)}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center">
                <Badge
                  variant={getStatusVariant(paymentRequest.status)}
                  className="capitalize gap-1"
                >
                  {getStatusIcon(paymentRequest.status)}
                  {paymentRequest.status.toLowerCase()}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center">
                <div className="text-center space-y-1">
                  <div className="flex items-center gap-1 justify-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(paymentRequest.createdAt)}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Button
                disabled={
                  loadingId === paymentRequest._id ||
                  paymentRequest.status === "COMPLETED"
                }
                onClick={() =>
                  acceptWithdraw(
                    paymentRequest.user._id,
                    paymentRequest.amount,
                    paymentRequest._id
                  )
                }
              >
                {loadingId === paymentRequest._id ? (
                  <BeatLoader color="#fff" />
                ) : (
                  "Accept"
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
