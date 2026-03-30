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


const formSchema = z.object({
  memId: z.string().min(3, "ID Number is required"),
  fullName: z.string().min(3, "Full name is required"),
  telephone: z.string().min(10, "Enter a valid phone number"),
  emailAddress: z.string().email("Enter a valid email"),
  title: z.string().optional(),
  accountNumber: z.string().optional(),
  openingBalance: z.string().optional(),
  
});

export function DetailView({ memberNo }: { memberNo: string }) {
  const [user, setUser] = React.useState<z.infer<typeof formSchema> | null>(
    null
  );

  React.useEffect(() => {
    const controller = new AbortController();
    async function fetchUser() {
      try {
        const res = await fetch(`/api/members/${memberNo}`, {
          signal: controller.signal,
          cache: "force-cache", 
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error("Error fetching member data:", data);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching member data:", error);
        }
      }
    }
    fetchUser();
    return () => controller.abort();
  }, [memberNo]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memId: user?.memId || "",
      fullName: user?.fullName || "",
      telephone: user?.telephone || "",
      emailAddress: user?.emailAddress || "",
      title: user?.title || "",
      accountNumber: user?.accountNumber || "",
      openingBalance: user?.openingBalance || "",
     
    },
  });

  async function updateMember(data: unknown) {
    try {
      const response = await fetch(`/api/members/${memberNo}`, {
        method: "PUT",
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
    try {
      const updatedMember = await updateMember(values);
      console.log("Member updated successfully:", updatedMember);
      alert("Member updated successfully!");
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member.");
    }
    window.location.reload();
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
              {/* Full Name */}
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
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                  </FormItem>
                )}
              />
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

              {/* Email Address */}
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
              <Button variant="destructive">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
