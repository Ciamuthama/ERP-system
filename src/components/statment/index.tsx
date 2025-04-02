import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: number;
  type: "credit" | "debit";
  accountNumber: string;
  fullName: string;
  memberNo: number;
  amount: number;
  description: string;
  date: string;
}

interface TransactionsTableProps {
  dncData: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ dncData }) => {
  return (
    <div className="overflow-x-auto mb-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(Array.isArray(dncData) ? dncData : [])
            .filter((txn) => txn.type === "credit") 
            .map((txn, index, filteredData) => (
              <TableRow key={txn.id}>
                <TableCell>
                  {new Date(txn.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{txn.description.toLocaleUpperCase()}</TableCell>
                <TableCell>KSh {Number(txn.amount).toLocaleString()}</TableCell>
                <TableCell>
                  KSh {Number(
                    filteredData.slice(0, index + 1).reduce(
                      (acc, t) => acc + Number(t.amount), 
                      0
                    )
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
