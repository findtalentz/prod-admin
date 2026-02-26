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

interface ContactType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: Date;
}

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const { data } = await apiClient.get<APIResponse<ContactType[]>>("/contacts");
  const contacts = data.data || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Contact Messages ({contacts.length})</h2>
      <div className="border rounded-2xl p-4">
        {contacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No contact messages yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="max-w-[300px]">Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{contact.message}</TableCell>
                  <TableCell>{formatDate(contact.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
