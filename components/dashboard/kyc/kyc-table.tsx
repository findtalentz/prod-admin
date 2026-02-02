"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { KYC, KYCStatus } from "@/types/KYC";
import KYCDetails from "./kyc-details";

interface Props {
  kyc: KYC[];
}

const columns = [
  { id: 1, label: "User Name", value: "user.firstName" },
  { id: 3, label: "Email", value: "user.email" },
  { id: 4, value: "status", label: "Status" },
  { id: 5, value: "", label: "Action" },
];

const STATUS_MAP: Record<
  KYCStatus,
  { color: "destructive" | "secondary" | "default"; label: string }
> = {
  pending: { color: "secondary", label: "Pending" },
  verified: { color: "default", label: "Verified" },
  rejected: { color: "destructive", label: "Rejected" },
};

const KYCTable = ({ kyc }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id}>Email</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {kyc.map((item) => (
          <TableRow key={item._id}>
            <TableCell>
              {item.user.firstName + " " + item.user.lastName}
            </TableCell>
            <TableCell>{item.user.email}</TableCell>
            <TableCell>
              <Badge variant={STATUS_MAP[item.status].color}>
                {STATUS_MAP[item.status].label}
              </Badge>
            </TableCell>
            <TableCell> {item.verificationType} </TableCell>
            <TableCell className="space-x-3">
              <KYCDetails kyc={item} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default KYCTable;
