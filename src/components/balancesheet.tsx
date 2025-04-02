"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drc } from "./modal/drc";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  type: z.string().nonempty({ message: "Card type is required" }),
  accountNumber: z.string().nonempty({ message: "Account number is required" }),
  memberNo: z.string().nonempty({ message: "Member number is required" }),
  fullName: z.string().nonempty({ message: "Full name is required" }),
  description: z.string().optional(),
  amount: z.string().regex(/^[0-9]+$/, { message: "Amount must be a number" }),
});

export function DebitCreditCards() {
  const [dnc, setDnc] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loanChecked, setLoanChecked] = useState(false);
  const [loanNumber, setLoanNumber] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      memberNo: "",
      accountNumber: "",
      fullName: "",
      description: "",
      amount: "0",
    },
  });

  // Generate a random 6-digit loan number
  const generateLoanNumber = () => {
    const value = Math.floor(100000 + Math.random() * 900000).toString();
    setLoanNumber(value);

    // Update the description field
    form.setValue("description", `Loan #${value}`);
  };

  // Handle checkbox toggle
  const handleLoanCheckboxChange = (checked: boolean) => {
    setLoanChecked(checked);
    if (checked) {
      generateLoanNumber();
    } else {
      setLoanNumber(null);
      form.setValue("description", ""); // Reset description if unchecked
    }
  };

  async function searchMember() {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const [res, memberRes] = await Promise.all([
        fetch(`/api/dnc?memberNo=${searchQuery}`),
        fetch(`/api/members/${searchQuery}`),
      ]);

      const fosaData = await res.json();
      const memberData = await memberRes.json();

      if (memberRes.ok && memberData) {
        form.setValue("memberNo", searchQuery);
        form.setValue("fullName", memberData.fullName || "");
        form.setValue("accountNumber", memberData.accountNumber || "");
      } else {
        alert("Member not found.");
        return;
      }

      if (res.ok && fosaData.length > 0) {
        form.setValue("accountNumber", fosaData[0].accountNumber || "");
        setDnc(fosaData);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/dnc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        form.reset();
        setLoanChecked(false);
        setLoanNumber(null);
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div>
      {loading ? (
        <p className="loading"></p>
      ) : (
        <>
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
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border w-full"
          >
            <ResizablePanel defaultSize={30}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 px-5 pt-4"
                >
                  {/* Select Type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== "credit") {
                              setLoanChecked(false);
                              setLoanNumber(null);
                              form.setValue("description", "");
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[250px] mb-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="debit">Debit</SelectItem>
                              <SelectItem value="credit">Credit</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {/* Show Loan Checkbox ONLY when Credit is selected */}
                  {form.watch("type") === "credit" && (
                    <div>
                      <Checkbox
                        id="newLoan"
                        checked={loanChecked}
                        onCheckedChange={handleLoanCheckboxChange}
                      />
                      <label
                        htmlFor="newLoan"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
                      >
                        New Loan?
                      </label>
                    </div>
                  )}

                  {/* Member Number */}
                  <FormField
                    control={form.control}
                    name="memberNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Account Number */}
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={loanChecked} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={new Intl.NumberFormat().format(
                              Number(field.value.replace(/,/g, "")) || 0
                            )}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                              if (/^\d*$/.test(rawValue)) {
                                // Ensure only numbers
                                field.onChange(rawValue);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <Drc data={dnc} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </>
      )}
    </div>
  );
}
