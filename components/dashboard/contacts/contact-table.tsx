"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { AxiosError } from "axios";
import { Eye, Mail, Search, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: Date;
}

interface Props {
  contacts: Contact[];
  totalCount: number;
}

export default function ContactTable({ contacts, totalCount }: Props) {
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const filtered = search
    ? contacts.filter(
        (c) =>
          c.firstName.toLowerCase().includes(search.toLowerCase()) ||
          c.lastName.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.message.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/contacts/${deleteId}`);
      toast.success("Contact deleted");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete contact");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Contact Messages{" "}
          <Badge variant="secondary" className="text-sm ml-2">
            {totalCount}
          </Badge>
        </h2>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-2xl">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No contact messages found</p>
            {search && (
              <p className="text-sm mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="max-w-[300px]">Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate text-sm text-muted-foreground">
                      {contact.message}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <AlertDialog
                        open={deleteId === contact._id}
                        onOpenChange={(open) =>
                          setDeleteId(open ? contact._id : null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this contact message
                              from {contact.firstName} {contact.lastName}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                              disabled={isDeleting}
                              onClick={handleDelete}
                              variant="destructive"
                            >
                              {isDeleting ? (
                                <BeatLoader color="#fff" size={8} />
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Contact Detail Sheet */}
      <Sheet
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      >
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Contact Message</SheetTitle>
          </SheetHeader>
          {selectedContact && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </p>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Received {formatDate(selectedContact.createdAt)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Message
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() =>
                  window.open(`mailto:${selectedContact.email}`, "_blank")
                }
              >
                <Mail className="w-4 h-4 mr-2" /> Reply via Email
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
