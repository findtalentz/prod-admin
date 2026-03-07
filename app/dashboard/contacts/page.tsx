import ContactTable from "@/components/dashboard/contacts/contact-table";
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
  try {
    const { data } = await apiClient.get<APIResponse<ContactType[]>>(
      "/contacts",
      { params: { pageSize: 100 } }
    );
    const contacts = data.data || [];
    const totalCount = data.count || contacts.length;

    return <ContactTable contacts={contacts} totalCount={totalCount} />;
  } catch {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Contact Messages</h2>
        <div className="border rounded-2xl p-8 text-center text-muted-foreground">
          <p className="font-medium">Failed to load contacts</p>
          <p className="text-sm mt-1">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }
}
