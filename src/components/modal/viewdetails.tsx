"use client";

import * as React from "react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { data } from "@/app/data";

export function DetailView({ memberNo }: { memberNo: string | number }) {
  const user = memberNo
    ? data.find((item) => item.memberNo === memberNo)
    : data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchCode: "",
      branchName: !Array.isArray(user) ? user?.branchName :"",
      employerCode: "",
      employerName: !Array.isArray(user) ? user?.employerName : "",
      fullName: !Array.isArray(user) ? user?.fullName : "",
      memId: "",
      memberNo: !Array.isArray(user) ? user?.memberNo :"",
      payrollNo: "",
      salaryAccount:!Array.isArray(user) ?  user?.salaryAccount :"",
      statusCode: "",
      statusName: !Array.isArray(user) ? user?.statusName :"",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Drawer direction="right" >
      <DrawerTrigger asChild>
        <h3 className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          Edit Details
        </h3>
      </DrawerTrigger>
      <DrawerContent className="m-5 rounded-l-xl">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Edit Member</DrawerTitle>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>FullName</FormLabel>
                    <FormControl>
                      <Input
                         {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memberNo"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Member Number</FormLabel>
                    <FormControl>
                      <Input
                       {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input
                       {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employerName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Employer Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salaryAccount"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Salary Account</FormLabel>
                    <FormControl>
                      <Input
                         {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statusName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Member Status</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
          <DrawerFooter>
         
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
