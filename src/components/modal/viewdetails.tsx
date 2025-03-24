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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getSingleMember } from "@/lib/actions";

const formSchema = z.object({
  id: z.string(), // ✅ ID is optional (not required for validation)
  memberNo: z.string(),
  memId: z.string().min(3, "ID Number is required"),
  fullName: z.string().min(3, "Full name is required"),
  telephone: z.string().min(10, "Enter a valid phone number"),
  emailAddress: z.string().email("Enter a valid email"),
  title: z.string().optional(),
  accountNumber: z.string(),
});

export function DetailView({ id }: { id: string }) {
  const [user, setUser] = React.useState<z.infer<typeof formSchema> | null>(
    null
  );

  React.useEffect(() => {
    if (id) {
      getSingleMember(id).then((data) => {
        setUser(data);
      });
    }
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user?.id || "",
      memberNo: user?.memberNo || "",
      memId: user?.memId || "",
      fullName: user?.fullName || "",
      telephone: user?.telephone || "",
      emailAddress: user?.emailAddress || "",
      title: user?.title || "",
      accountNumber: user?.accountNumber || "",
    },
  });

  async function updateMember(id: string, data: unknown) {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update member: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  }

  React.useEffect(() => {
    if (user) {
      form.reset(user);
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form with values:", values); // Debugging log

    if (!values.id) {
      console.error("No member number provided");
      return;
    }

    try {
      const updatedMember = await updateMember(values.id, values);
      console.log("Member updated successfully:", updatedMember);
      alert("Member updated successfully!");
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member.");
    }
  }

  return (
    <Drawer direction="right">
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-5"
            >
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormLabel>ID</FormLabel>
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

              {/* Member Number (Read-Only) */}
              <FormField
                control={form.control}
                name="memberNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Number</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Telephone */}
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email Address */}
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Account Number (Read-Only) */}
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
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
