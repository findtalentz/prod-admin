"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, formatDate } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { PaymentMethod } from "@/types/PaymentMethod";
import { AxiosError } from "axios";
import {
  Building,
  Calendar,
  CreditCard,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Props {
  paymentMethod: PaymentMethod;
}

export default function PaymentMethodDetails({ paymentMethod }: Props) {
  const [open, setOpen] = useState(false);
  const [isApproving, setApproving] = useState(false);
  const [isRejecting, setRejecting] = useState(false);
  const router = useRouter();

  const getStatusVariant = (status: PaymentMethod["verificationType"]) => {
    switch (status) {
      case "verified":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: PaymentMethod["verificationType"]) => {
    switch (status) {
      case "verified":
        return <Shield className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Shield className="h-4 w-4 text-amber-600" />;
      case "rejected":
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getMethodIcon = () => {
    switch (paymentMethod.methodType) {
      case "bank":
        return <Building className="h-5 w-5" />;
      case "paypal":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodLabel = () => {
    switch (paymentMethod.methodType) {
      case "bank":
        return "Bank Account";
      case "paypal":
        return "PayPal";
      default:
        return "Payment Method";
    }
  };

  const handleStatusUpdate = async (
    newStatus: PaymentMethod["verificationType"]
  ) => {
    const isApproving = newStatus === "verified";
    const isRejecting = newStatus === "rejected";

    if (isApproving) setApproving(true);
    if (isRejecting) setRejecting(true);

    try {
      await apiClient.put(`/payment-methods/${paymentMethod._id}`, {
        verificationType: newStatus,
      });

      toast.success(
        `Payment method ${
          newStatus === "verified" ? "approved" : "rejected"
        } successfully`
      );
      router.refresh();
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setApproving(false);
      setRejecting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CreditCard className="h-4 w-4" />
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl px-0">
        <ScrollArea className="h-full px-6">
          <SheetHeader className="mb-6 text-left">
            <div className="flex items-center gap-3 mb-2">
              {getMethodIcon()}
              <SheetTitle className="text-2xl font-bold">
                {getMethodLabel()} Details
              </SheetTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={getStatusVariant(paymentMethod.verificationType)}
                className="gap-1"
              >
                {getStatusIcon(paymentMethod.verificationType)}
                {paymentMethod.verificationType.charAt(0).toUpperCase() +
                  paymentMethod.verificationType.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated {formatDate(paymentMethod.updatedAt)}
              </span>
            </div>
          </SheetHeader>

          <div className="space-y-6 pb-6">
            {/* User Information Section */}
            <section>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </p>
                  <p className="font-medium">
                    {paymentMethod.user.firstName} {paymentMethod.user.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium">{paymentMethod.user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Method Type
                  </p>
                  <p className="font-medium">{getMethodLabel()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created On
                  </p>
                  <p className="font-medium">
                    {formatDate(paymentMethod.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Payment Method Details Section */}
            <section>
              <h3 className="font-semibold text-lg mb-4">
                {getMethodLabel()} Details
              </h3>
              <div className="space-y-4">
                {paymentMethod.methodType === "bank" && (
                  <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Bank Name
                        </p>
                        <p className="font-medium">{paymentMethod.bankName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Account Type
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {paymentMethod.accountType}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Account Holder
                        </p>
                        <p className="font-medium">
                          {paymentMethod.accountHolderName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Routing Number
                        </p>
                        <p className="font-mono font-medium">
                          ••••{paymentMethod.routingNumber.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="font-mono font-medium">
                        ••••{paymentMethod.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod.methodType === "paypal" && (
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        PayPal Email
                      </p>
                      <p className="font-medium text-lg">
                        {paymentMethod.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Verification Actions Section */}
            {paymentMethod.verificationType === "pending" && (
              <section>
                <h3 className="font-semibold text-lg mb-4">
                  Verification Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    disabled={isRejecting || isApproving}
                    onClick={() => handleStatusUpdate("rejected")}
                    variant="destructive"
                    className="flex-1 gap-2"
                  >
                    {isRejecting ? (
                      <BeatLoader size={8} color="white" />
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    disabled={isApproving || isRejecting}
                    onClick={() => handleStatusUpdate("verified")}
                    className="flex-1 gap-2"
                  >
                    {isApproving ? (
                      <BeatLoader size={8} color="white" />
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              </section>
            )}

            {/* Status Message for non-pending methods */}
            {paymentMethod.verificationType !== "pending" && (
              <section>
                <h3 className="font-semibold text-lg mb-4">
                  Verification Status
                </h3>
                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    paymentMethod.verificationType === "verified" &&
                      "bg-green-50 border-green-200",
                    paymentMethod.verificationType === "rejected" &&
                      "bg-red-50 border-red-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(paymentMethod.verificationType)}
                    <p className="font-medium">
                      This payment method has been{" "}
                      <span className="capitalize">
                        {paymentMethod.verificationType}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated on {formatDate(paymentMethod.updatedAt)}
                  </p>
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
