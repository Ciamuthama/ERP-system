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
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { getDNC } from "@/lib/actions";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  accountName: z.string().min(3, "Full name is required"),
  balances: z.string().min(3),
  accountNumber: z.string(),
  code: z.string(),
  isBankAccount: z.boolean().default(false),
});

export default function ChatOfAccount() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [accounts, setAccounts] = useState<
    {
      id: string;
      accountNumber: string;
      accountName: string;
      balances: string;
      code: string;
      isBankAccount: boolean;
    }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      accountNumber: "",
      accountName: "",
      balances: "",
      isBankAccount: false,
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
      const accountsData = await fetchAccounts();
      const transactions = await getDNC();

      let totalCredit = 0;
      let totalDebit = 0;

      transactions.forEach(({ amount, type }) => {
        const parsedAmount = parseFloat(amount);
        if (type === "credit") {
          totalCredit += parsedAmount;
        } else if (type === "debit") {
          totalDebit += parsedAmount;
        }
      });

      const updatedAccounts = accountsData.map((account) => {
        if (account.isBankAccount) {
          return {
            ...account,
            balances: (
              parseFloat(account.balances) +
              totalDebit -
              totalCredit
            ).toFixed(2),
          };
        }
        return account;
      });

      setAccounts(updatedAccounts);
    }

    loadAccounts();
  }, []);

  return (
    <>
      {loading ? (
        <p className="loading"></p>
      ) : (
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
                  <TableCell className="font-medium">
                    {item.accountNumber}
                  </TableCell>
                  <TableCell>{item.accountName}</TableCell>
                  <TableCell>{item.balances}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog>
            <DialogTrigger className="border p-2 rounded-md bg-black text-white font-semibold">
              Open New Account
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create New Account</DialogTitle>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 px-5 grid grid-cols-1 gap-3"
                >
                  <FormField
                    control={form.control}
                    name="isBankAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is Bank Account?</FormLabel>
                        <FormControl>
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value}
                            className="peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
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
                          <Input {...field} type="number" />
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
                          <Input {...field}  value={new Intl.NumberFormat().format(
                              Number(field.value.replace(/,/g, "")) || 0
                            )}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, ""); 
                              if (/^\d*$/.test(rawValue)) {
                               
                                field.onChange(rawValue);
                              }
                            }}/>
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
      )}
    </>
  );
}
