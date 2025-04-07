"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  memberNo: z.string().optional(),
  memId: z.string().min(3, "ID Number is required"),
  fullName: z.string().min(3, "Full name is required"),
  telephone: z.string().min(10, "Enter a valid phone number"),
  emailAddress: z.string().email("Enter a valid email"),
  title: z.string().optional(),
  accountNumber: z.string().optional(),
  openingBalance: z.string().optional(),
});

export default function MemberForm() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [memberNo, setMemberNo] = useState("1001");
  const [accountNumber, setAccountNumber] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      memberNo: "",
      fullName: "",
      memId: "",
      telephone: "",
      emailAddress: "",
      accountNumber: "",
      openingBalance: "",
    },
  });

  // Fetch next member number when the form loads
  useEffect(() => {
    async function fetchNextMemberNumber() {
      try {
        const response = await fetch("/api/members");
        if (response.ok) {
          const data = await response.json();
          setMemberNo(data.nextMemberNo);
        }
      } catch (error) {
        console.error("Error fetching next member number:", error);
      }
    }
    fetchNextMemberNumber();
  }, []);

  // Function to generate account number
  const generateAccountNumber = () => {
    const randomNumber = Math.floor(10000000 + Math.random() * 9000000); // Generate 8 random digits
    setAccountNumber(`01${randomNumber}`); // Ensure it starts with "01"
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch("api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, memberNo, accountNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(
          `Member created! Member No: ${data.memberNo}, Account No: ${data.accountNumber}`
        );
        form.reset();
        setAccountNumber("");
      } else {
        console.error("Failed to save member");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <p className="loading"></p>
      ) : (
        <div className="mt-5 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center underline">
                Create New Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 px-5 grid grid-cols-2 gap-3"
                >
                  <FormItem>
                    <FormLabel>Member Number</FormLabel>
                    <Input value={memberNo} readOnly />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="memId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel className="mb-2">Account Number</FormLabel>
                    <div className="flex items-center gap-3">
                      <Input value={accountNumber} disabled />
                      <Button type="button" onClick={generateAccountNumber}>
                        Generate
                      </Button>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="openingBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Balance</FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            value={new Intl.NumberFormat().format(
                              Number(field.value.replace(/,/g, "")) || 0
                            )}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, ""); 
                              if (/^\d*$/.test(rawValue)) {
                                field.onChange(rawValue);
                              }
                            }}
                          />
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
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
