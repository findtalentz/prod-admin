"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserType } from "@/types/User";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserBlogDialog from "./user-delete-dialog";

interface Porps {
  users: UserType[];
}
const UserTable = ({ users }: Porps) => {
  const router = useRouter();

  return (
    <>
      <h2 className="text-2xl font-semibold mb-3">Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email Status</TableHead>
            <TableHead>Identity Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Earning</TableHead>
            <TableHead>Spend</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/dashboard/users/${user._id}`)}
            >
              <TableCell>
                <Image
                  src={user.image}
                  alt={user.firstName}
                  width={60}
                  height={60}
                  className="rounded"
                />
              </TableCell>
              <TableCell> {user.firstName + " " + user.lastName} </TableCell>
              <TableCell> {user.email} </TableCell>
              <TableCell> {user.role} </TableCell>
              <TableCell> {user.emailStatus} </TableCell>
              <TableCell> {user.identityStatus} </TableCell>
              <TableCell> {user.location} </TableCell>
              <TableCell> {user.balance} </TableCell>
              <TableCell> {user.totalEarning} </TableCell>
              <TableCell> {user.totalSpend} </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <UserBlogDialog userId={user._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UserTable;
