"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  accountName: z.string().min(3, "Full name is required"),
  balances: z.string().min(3),
  accountNumber: z.string(),
});

export default function ChatOfAccount() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [accounts, setAccounts] = useState<{ id: string; accountNumber: string; accountName: string; balances: string }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      accountName: "",
      balances: "",
    },
  });



  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setSuccessMessage("");

    try {
      const formattedData = {
        ...values,
        balances: parseFloat(values.balances),
      };

      const response = await fetch("/api/chartofaccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error("API Error:", responseData.error);
        return;
      }

      setSuccessMessage("Account created!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAccounts() {
    try {
        const response = await fetch("/api/chartofaccount");

        if (!response.ok) {
            throw new Error("Failed to fetch accounts");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return [];
    }
}




useEffect(() => {
    async function loadAccounts() {
        const data = await fetchAccounts();
        setAccounts(data);
    }

    loadAccounts();
}, []);


  return (
    <div className="mx-auto">
      <h3 className="font-semibold text-center">Chart Of Account</h3>
      <Table className="w-full">
        <TableCaption>Chart of Account</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Account Number</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.accountNumber}</TableCell>
              <TableCell>{item.accountName}</TableCell>
              <TableCell>{item.balances}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog>
        <DialogTrigger className="border p-2 rounded-md bg-black text-white font-semibold">Open New Account</DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-5 grid grid-cols-1 gap-3"
            >
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balances"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                {successMessage && (
                  <p className="text-green-600 mt-2">{successMessage}</p>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
