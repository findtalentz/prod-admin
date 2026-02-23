"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { Transaction } from "@/types/Transaction";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "completed":
      return "default" as const;
    case "pending":
      return "secondary" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export default function TransactionTable() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<APIResponse<Transaction[]>>({
    queryKey: ["admin-transactions", status, page],
    queryFn: () =>
      apiClient
        .get<APIResponse<Transaction[]>>("/transactions", {
          params: { status: status || undefined, page, pageSize: 10 },
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  const transactions = data?.data || [];
  const pageCount = data?.pageCount || 1;

  if (!isLoading && transactions.length === 0 && !status) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No Transactions
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          There are no transactions to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={status || "all"}
        onValueChange={(v) => {
          setStatus(v === "all" ? "" : v);
          setPage(1);
        }}
      >
        <TabsList>
          {statusFilters.map((f) => (
            <TabsTrigger key={f.value || "all"} value={f.value || "all"}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ref</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx._id}>
                <TableCell>{formatDate(tx.createdAt as unknown as Date)}</TableCell>
                <TableCell className="font-medium">
                  {tx.user?.firstName} {tx.user?.lastName}
                </TableCell>
                <TableCell className="capitalize">{tx.type}</TableCell>
                <TableCell>${tx.amount.toLocaleString()}</TableCell>
                <TableCell className="capitalize">
                  {tx.paymentGateway || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(tx.status)}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[120px] truncate">
                  {tx.gatewayRef || "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
