"use client";

import React from "react";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  branchCode: z.union([z.string(), z.number()]),
  branchName: z.string(),
  employerCode: z.union([z.string(), z.number()]),
  employerName: z.string(),
  fullName: z.string(),
  memId: z.union([z.number(), z.string()]),
  memberNo: z.union([z.string(), z.number()]),
  payrollNo: z.union([z.string(), z.number()]),
  salaryAccount: z.union([z.string(), z.number()]),
  statusCode: z.union([z.string(), z.number()]),
  statusName: z.string(),
});

export default function MemberForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchCode: "",
      branchName: "",
      employerCode: "",
      employerName: "",
      fullName: "",
      memId: "",
      memberNo: "",
      payrollNo: "",
      salaryAccount: "",
      statusCode: "",
      statusName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="mt-5">
      <Card className="">
        <CardHeader>
          <CardTitle>Create New Member</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-5 grid grid-cols-2 gap-3 place-content-center my-auto "
            >
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
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FullName</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salaryAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Account</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statusName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Status</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
