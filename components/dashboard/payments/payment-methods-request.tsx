import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { PaymentMethod } from "@/types/PaymentMethod";
import { Building, Calendar, CreditCard, Mail, User } from "lucide-react";
import PaymentMethodDetails from "./payment-method-details";

interface Props {
  paymentMethods: PaymentMethod[];
}

export default function PaymentMethodsRequest({ paymentMethods }: Props) {
  const getMethodIcon = (methodType: PaymentMethod["methodType"]) => {
    switch (methodType) {
      case "bank":
        return <Building className="h-4 w-4" />;
      case "paypal":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (methodType: PaymentMethod["methodType"]) => {
    switch (methodType) {
      case "bank":
        return "Bank Account";
      case "paypal":
        return "PayPal";
      default:
        return "Payment Method";
    }
  };

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

  const getDisplayValue = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.methodType === "bank") {
      return `••••${paymentMethod.accountNumber.slice(-4)}`;
    } else {
      return paymentMethod.email;
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No Payment Methods
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are no payment method requests to display.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Type</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Method Details</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentMethods.map((paymentMethod) => (
          <TableRow key={paymentMethod._id} className="hover:bg-muted/50">
            <TableCell>
              <div className="flex justify-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getMethodIcon(paymentMethod.methodType)}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {paymentMethod.user.firstName} {paymentMethod.user.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {paymentMethod.user.email}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getMethodIcon(paymentMethod.methodType)}
                  <span className="font-medium">
                    {getMethodLabel(paymentMethod.methodType)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getDisplayValue(paymentMethod)}
                </div>
                {paymentMethod.methodType === "bank" && (
                  <div className="text-xs text-muted-foreground">
                    {paymentMethod.bankName} • {paymentMethod.accountType}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center">
                <Badge
                  variant={getStatusVariant(paymentMethod.verificationType)}
                  className="capitalize"
                >
                  {paymentMethod.verificationType}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(paymentMethod.createdAt)}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <PaymentMethodDetails paymentMethod={paymentMethod} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
