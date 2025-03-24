"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { getSingleMember } from "@/lib/actions";

const formSchema = z.object({
  accountNumber: z.string().min(8, "Account number is required"),
  memberName: z.string().min(1, "Member name is required"),
  memberNo: z.string().optional(),
  transactionDate: z.string().min(1, "Transaction date is required"),
  transactionType: z.string().min(1, "Transaction type is required"),
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanBalance: z.string().min(1, "Loan balance is required"),
  savings: z.string().optional(),
  withdrawable: z.string().optional(),
  shares: z.string().optional(),
  description: z
    .string()
    .optional()
   
});

export default function FosaStatementForm() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
      memberName: "",
      memberNo:"",
      transactionDate: "",
      transactionType: "",
      loanAmount: "",
      loanBalance: "",
      savings: "", 
      withdrawable: "",
      shares: "", 
      description: "",
    },
  });

  async function searchMember() {
    if (!searchQuery) return;
    setLoading(true);

    try {
      // Check FOSA statements first
      const res = await fetch(`/api/fosa?memberNo=${searchQuery}`);
      const data = await res.json();
      console.log("FOSA API Response:", data);

      if (res.ok && data.length > 0) {
        form.reset({
        memberNo:searchQuery ||"", 
          accountNumber: data[0].accountNumber || "",
          memberName: data[0].memberName || "",
          transactionDate: data[0].transactionDate || "",
          transactionType: data[0].transactionType || "",
          loanAmount: data[0].loanAmount?.toString() || "",
          loanBalance: data[0].loanBalance?.toString() || "",
          savings: data[0].savings?.toString() || "",
          withdrawable: data[0].withdrawable?.toString() || "",
          shares: data[0].shares?.toString() || "",
          description: data[0].description || "",
        });
      } else {
        // If not found, check in members
        const memberData = await getSingleMember(searchQuery);
        console.log("Member API Response:", memberData);

        if (memberData && Object.keys(memberData).length > 0) {
          form.reset({
            memberNo:searchQuery ||"",
            accountNumber: memberData.accountNumber || "", // ✅ Corrected from "fosaAccountNo"
            memberName: memberData.fullName || "", // ✅ Assuming "fullName" should be "memberName"
            transactionDate: "", // Keep empty since it's a new transaction
            transactionType: "",
            loanAmount: "0",
            loanBalance: "0", // ✅ Corrected from "balance"
            savings: "0", // ✅ Added because it's in DB
            withdrawable: "0", // ✅ Added because it's in DB
            shares: "0", // ✅ Added because it's in DB
            description: "",
          });
        } else {
          alert("Member not found.");
        }
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: any) => {
    try {
      console.log("Raw Submitted Data:", data); // Debugging log

      // Ensure transactionDate is properly formatted
      let transactionDate = data.transactionDate
        ? new Date(data.transactionDate)
        : null;

      if (!transactionDate || isNaN(transactionDate.getTime())) {
        alert("Invalid transaction date. Please select a valid date.");
        return;
      }

      // Convert to MySQL format (YYYY-MM-DD)
      transactionDate = transactionDate.toISOString().split("T")[0];

      const payload = {
        ...data,
        transactionDate, // ✅ Correctly formatted
      };

      console.log("Final Payload:", payload); // Debugging log

      const response = await fetch("/api/fosa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("Server Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit form");
      }

      console.log("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-[70vw]">
      <h3 className="font-semibold text-center">FOSA Statement</h3>

      {/* Search Input */}
      <div className="flex gap-2 mb-5 w-[30rem]">
        <Input
          type="text"
          placeholder="Search Member Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={searchMember} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>


      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 gap-3 px-5 w-full">{Object.keys(formSchema.shape).map((field) =>
            field !== "description" ? (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {field.name.replace(/([A-Z])/g, " $1").trim().toLocaleUpperCase()}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <div key={"1"}>
                <FormField
                  key="description"
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter description (at least 5 characters)"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="transactionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
              </div>
            )
          )}</div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          {successMessage && (
            <p className="text-green-600 mt-2">{successMessage}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
