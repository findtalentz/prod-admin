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

interface Subscriber {
  _id: string;
  email: string;
  createdAt: Date;
}

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const { data } = await apiClient.get<APIResponse<Subscriber[]>>("/subscribes");
  const subscribers = data.data || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Subscriptions ({subscribers.length})</h2>
      <div className="border rounded-2xl p-4">
        {subscribers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No subscriptions yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{formatDate(sub.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
