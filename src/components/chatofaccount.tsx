"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartofAccount } from "@/app/data/chartofaccount";

export default function ChatOfAccount() {
  const cfa = ChartofAccount;
  return (
    <div className="mx-auto">
      <h3 className="font-semibold text-center">Chat Of Account</h3>
      <Table className="w-full">
        <TableCaption>Chat of Account</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Account Number</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Short Code</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cfa.map((item) => (
            <TableRow key={item.short_code}>
              <TableCell className="font-medium">{item.account_no}</TableCell>
              <TableCell>{item.account_name}</TableCell>
              <TableCell>{item.short_code}</TableCell>
              <TableCell className="text-right">{item.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
